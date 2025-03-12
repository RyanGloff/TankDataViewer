import { fileURLToPath } from "url";
import usePgClient from "../usePgClient.js";

export default function fetchDeviceById(pgClient, id) {
  const sql = `
SELECT * FROM tank_data_schema.device WHERE id = $1;
  `;
  const parameters = [id];
  return pgClient.query(sql, parameters).then((res) => res.rows[0]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const id = process.argv[2];
  usePgClient("postgres", (pgClient) => {
    checkEnergyUsage(pgClient);
  });
}
