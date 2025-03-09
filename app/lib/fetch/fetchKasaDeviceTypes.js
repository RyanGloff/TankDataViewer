import { fileURLToPath } from "url";
import usePgClient from "../usePgClient.js";

export default function fetchKasaDeviceTypes(pgClient) {
  const sql = `SELECT * FROM tank_data_schema.kasa_device_type;`;
  console.log(pgClient);
  return pgClient.query(sql).then((res) => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  usePgClient("postgres", (pgClient) => fetchKasaDeviceTypes(pgClient));
}
