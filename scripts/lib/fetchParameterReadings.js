import usePgClient from './usePgClient.js';
import { fileURLToPath } from 'url';

export default function fetchParameterReadings(pgClient, start, end, parameterId) {
  const sql = `
    SELECT * FROM tank_data_schema.parameter_reading WHERE time > $1 AND time < $2${parameterId ? ` AND parameter_id = $3` : ''};
  `;
  console.log(sql);
  const params = [ start.toISOString(), end.toISOString() ];
  if (parameterId) {
    params.push(parameterId);
  }
  return pgClient.query(sql, params).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const defaultTime = 7 * 24 * 60 * 60 * 100;
  const parameterId = process.argv[2];
  const start = process.argv[3] || new Date(Date.now() - defaultTime);
  const end = process.argv[4] || new Date(Date.now());
  console.log(start);
  console.log(end);
  usePgClient('tank_data_injector', pgClient => fetchParameterReadings(pgClient, start, end, parameterId).then(readings => console.log(readings)));
}
