import usePgClient from "../usePgClient.js";
import { fileURLToPath } from "url";

export default function storeKasaDeviceType(pgClient, name) {
  const sql = `
INSERT INTO tank_data_schema.kasa_device_type(name) VALUES($1);
`;
  const parameters = [name];
  return pgClient.query(sql, parameters).then((res) => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const name = process.argv[2];
  console.log(`Storing kasa device type with values: Name -> ${name}`);
  usePgClient("postgres", (pgClient) => storeKasaDeviceType(pgClient, name));
}
