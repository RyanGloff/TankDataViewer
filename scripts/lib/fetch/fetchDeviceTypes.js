import { fileURLToPath } from 'url';
import usePgClient from '../usePgClient.js';

export default function fetchDeviceTypes(pgClient) {
  const sql = `SELECT * FROM tank_data_schema.device_type;`;
  return pgClient.query(sql).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  usePgClient('postgres', pgClient => fetchDeviceTypes(pgClient).then(deviceTypes => console.log(deviceTypes)));
}
