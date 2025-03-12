import { fileURLToPath } from "url";
import usePgClient from "../usePgClient.js";

export default function fetchDevices(pgClient) {
  const sql = `SELECT * FROM tank_data_schema.device;`;
  return pgClient.query(sql).then((res) => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  usePgClient("postgres", (pgClient) =>
    fetchDevices(pgClient).then((devices) => console.log(devices)),
  );
}
