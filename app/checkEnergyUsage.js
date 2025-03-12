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

export default async function checkEnergyUsage(pgClient) {
  const targets = await fetchDevicePowerTargets(pgClient);
  const promises = targets.map(async (target) => {
    const deviceConfig = await fetchDeviceById(pgClient, target.device_id);
    const device = await getDevice({
      host: deviceConfig.host,
      childName: deviceConfig.child_name,
    });
    const emeter = await getCurrentPowerDraw(device);
    const powerState = await getPowerState(device);

    if (powerState !== target.desired_power_state) {
      console.error(
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
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  usePgClient("postgres", (pgClient) => {
    return checkEnergyUsage(pgClient);
  });
}
