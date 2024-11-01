import { fileURLToPath } from 'url';
import usePgClient from './usePgClient.js';

export default function fetchTanks(pgClient) {
	const sql = `SELECT * FROM tank_data_schema.tank;`;
	return pgClient.query(sql).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	usePgClient('postgres', pgClient => fetchTanks(pgClient).then(tanks => console.log(tanks)));
}
