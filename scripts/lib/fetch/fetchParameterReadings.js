import usePgClient from '../usePgClient.js';
import { fileURLToPath } from 'url';

export default function fetchParameterReadings(pgClient, options) {
  const { start, end, parameterId, tankId } = options;
  let sql = `SELECT * FROM tank_data_schema.parameter_reading WHERE 1=1`;

  let paramId = 1;
  const params = [];
  if (start) {
    sql += ` AND time > $${paramId++}`;
    params.push(start.toISOString());
  }
  if (end) {
    sql += ` AND time < $${paramId++}`;
    params.push(end.toISOString());
  }
  if (parameterId) {
    sql += ` AND parameter_id = $${paramId++}`;
    params.push(parameterId);
  }
  if (tankId) {
    sql += ` AND tank_id = $${paramId++}`;
    params.push(tankId);
  }

  sql += ' ORDER BY time;'

  console.log(`Generated SQL: ${sql}`);
  console.log(`Params: ${JSON.stringify(params)}`);
  return pgClient.query(sql, params).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const defaultTime = 7 * 24 * 60 * 60 * 100;
  const options = {
    parameterId: process.argv[2],
    tankId: process.argv[3],
    start: new Date(process.argv[4] || Date.now() - defaultTime),
    end: new Date(process.argv[5] || Date.now()),
  };
  console.log(`Options: ${JSON.stringify(options)}`);
  usePgClient('tank_data_injector', pgClient => fetchParameterReadings(pgClient, options).then(readings => console.log(readings)));
}
