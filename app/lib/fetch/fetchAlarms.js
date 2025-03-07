import { fileURLToPath } from 'url';
import usePgClient from '../usePgClient.js';

export default function fetchAlarms(pgClient) {
	const sql = `SELECT * FROM tank_data_schema.alarm;`;
	return pgClient.query(sql).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	usePgClient('postgres', pgClient => fetchAlarms(pgClient).then(alarms => console.log(alarms)));
}
