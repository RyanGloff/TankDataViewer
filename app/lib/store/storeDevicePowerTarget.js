import usePgClient from "../usePgClient.js";
import { fileURLToPath } from "url";

export default function storeDevicePowerTarget(
  pgClient,
  deviceId,
  time,
  desiredPowerState,
  enforceOnDiscrepancy,
  notifyOnDiscrepancy,
  minAcceptableDraw,
  maxAcceptableDraw,
) {
  const sql = `
INSERT INTO tank_data_schema.device_power_target(device_id, time, desired_power_state, enforce_on_discrepancy, notify_on_discrepancy, min_acceptable_draw, max_acceptable_draw) VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
  const timeStr = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}`;
  const parameters = [
    deviceId,
    timeStr,
    desiredPowerState,
    enforceOnDiscrepancy,
    notifyOnDiscrepancy,
    minAcceptableDraw,
    maxAcceptableDraw,
  ];
  return pgClient.query(sql, parameters).then((res) => res.rows);
}
