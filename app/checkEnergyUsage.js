import { fileURLToPath } from "url";
import fetchDevicePowerTargets from "./lib/fetch/fetchDevicePowerTargets.js";
import fetchDeviceById from "./lib/fetch/fetchDeviceById.js";
import {
  getDevice,
  getCurrentPowerDraw,
  getPowerState,
  setPowerState,
} from "./lib/kasa/KasaPlug.js";
import usePgClient from "./lib/usePgClient.js";

async function sendNotification(msg) {
  console.log(`[Mock Notification]: ${msg}`);
}

function isCurrentTimeInRange(startTime, endTime) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  );

  function parseTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (end < start) {
    return now >= start || now <= end;
  }

  return now >= start && now <= end;
}

export default async function checkEnergyUsage() {
  return usePgClient("postgres", async (pgClient) => {
    const targets = await fetchDevicePowerTargets(pgClient);
    const promises = targets.map(async (target) => {
      const deviceConfig = await fetchDeviceById(pgClient, target.device_id);
      const device = await getDevice({
        host: deviceConfig.host,
        childName: deviceConfig.child_name,
      });
      const emeter = await getCurrentPowerDraw(device);
      const powerState = await getPowerState(device);

      if (
        (target.start_time === null && target.end_time !== null) ||
        (target.start_time !== null && target.end_time === null)
      ) {
        console.error(
          `Only one of start_time or end_time are null for power target [${target.id}]. Either both need to be null or neither. Start: ${target.start_time}. End: ${target.end_time}`,
        );
        return Promise.resolve();
      }
      if (
        !(target.start_time === null && target.end_time === null) &&
        !isCurrentTimeInRange(target.start_time, target.end_time)
      ) {
        console.debug(
          `Skipping target [${target.id}] because current time is not in time window. Start: ${target.start_time}. End: ${target.end_time}, Current: ${new Date().toString()}`,
        );
        return Promise.resolve();
      }

      if (powerState !== target.desired_power_state) {
        console.warn(
          `[${deviceConfig.name}] Power state of device is unacceptable. Target: ${target.desired_power_state}. Current: ${powerState}`,
        );
        if (target.enforce_on_discrepancy) {
          console.warn(
            `[${deviceConfig.name}] Setting power state of device to state: ${target.desired_power_state}`,
          );
          await setPowerState(device, target.desired_power_state);
        }
        if (target.notify_on_discrepancy) {
          console.info(
            `[${deviceConfig.name}] Sending notification of device with unacceptable power state. Target: ${target.desired_power_state}. Current: ${powerState}`,
          );
          await sendNotification(
            `[${deviceConfig.name}] Power state of device is unacceptable. Target: ${target.desired_power_state}. Current: ${powerState}.${target.enforce_on_discrepancy ? " Power state was enforced." : ""}`,
          );
        }
      } else {
        console.log(
          `[${deviceConfig.name}] Power state is acceptable. Target: ${target.desired_power_state}. Current: ${powerState}`,
        );
      }

      if (emeter.power_mw > target.max_acceptable_draw) {
        console.error(
          `[${deviceConfig.name}] Power draw is above acceptable limits. Limit: ${target.max_acceptable_draw}. Power: ${emeter.power_mw}`,
        );
      } else if (emeter.power_mw < target.min_acceptable_draw) {
        console.error(
          `[${deviceConfig.name}] Power draw is below acceptable limits. Limit: ${target.min_acceptable_draw}. Power: ${emeter.power_mw}`,
        );
      } else {
        console.log(
          `[${deviceConfig.name}] Power draw is in acceptable range. Range: ${target.min_acceptable_draw} to ${target.max_acceptable_draw}. Power: ${emeter.power_mw}`,
        );
      }

      return emeter;
    });
    return await Promise.all(promises);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkEnergyUsage();
}
