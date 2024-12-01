import { fileURLToPath } from 'url';
import usePgClient from '../usePgClient.js';

export default function deleteReadings(pgClient, ids) {
	const sql = `DELETE FROM tank_data_schema.parameter_reading where id IN ( ${ids.join(', ')} );`;
  console.log(sql);
	return Promise.resolve(ids);//pgClient.query(sql).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ids = process.argv.slice(2, process.argv.length);
  console.log(`Ids: ${ids}`);
	usePgClient('postgres', pgClient => deleteReadings(pgClient, ids));
}
