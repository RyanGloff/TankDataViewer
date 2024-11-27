import { fileURLToPath } from 'url';
import usePgClient from '../usePgClient.js';

function fetchLatestReading(pgClient, parameterId, tankId) {
  const sql = `
SELECT * FROM tank_data_schema.parameter_reading
WHERE parameter_id = $1 AND tank_id = $2
ORDER BY time DESC
LIMIT 1;
  `;
  const params = [ parameterId, tankId ];
  return pgClient.query(sql, params);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const parameterId = process.argv[2];
  const tankId = process.argv[3];
  usePgClient('postgres', pgClient => fetchLatestReading(pgClient, parameterId, tankId));
}
