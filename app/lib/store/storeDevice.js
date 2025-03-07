import usePgClient from '../usePgClient.js';
import { fileURLToPath } from 'url';

export default function storeDevice(pgClient, name, host, deviceTypeId) {
  const sql = `
INSERT INTO tank_data_schema.device(name, host, device_type_id) VALUES ($1, $2, $3);
`;
  const params = [ name, host, deviceTypeId ];
  return pgClient.query(sql, params).catch(err => {
    if (!err.detail.indexOf('already exists')) {
      throw err;
    }
    return null;
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const name = process.argv[2];
  const host = process.argv[3];
  console.log(`Storing device with values: Name -> ${name}, Host -> ${host}`);
  usePgClient('postgres', pgClient => storeDevice(pgClient, name, host, deviceType));
}
