import { fileURLToPath } from "url";
import usePgClient from "../usePgClient.js";

export default function fetchDevicePowerTargets(pgClient) {
  const sql = `SELECT * FROM tank_data_schema.device_power_target;`;
  return pgClient.query(sql).then((res) => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  usePgClient("postgres", (pgClient) =>
    fetchDevicePowerTargets(pgClient).then((targets) => console.log(targets)),
  );
}
