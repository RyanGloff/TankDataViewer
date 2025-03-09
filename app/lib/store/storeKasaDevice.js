import usePgClient from "../usePgClient.js";
import { fileURLToPath } from "url";

export default function storeKasaDevice(
  pgClient,
  name,
  host,
  deviceTypeId,
  childName,
) {
  const sql = `
INSERT INTO tank_data_schema.kasa_device(name, host, device_type_id, child_name) VALUES($1, $2, $3, $4);
`;
  const parameters = [name, host, deviceTypeId, childName || null];
  return pgClient.query(sql, parameters).then((res) => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const name = process.argv[2];
  const host = process.argv[3];
  const deviceTypeId = process.argv[4];
  const childName = process.argv[5] || null;
  console.log(
    `Storing kasa device type with values: Name -> ${name}, Host -> ${host}, DeviceTypeId -> ${deviceTypeId}, ChildName -> ${childName}`,
  );
  usePgClient("postgres", (pgClient) =>
    storeKasaDevice(pgClient, name, host, deviceTypeId, childName),
  );
}
