import { fileURLToPath } from 'url';
import usePgClient from '../usePgClient.js';

export default function fetchParameters(pgClient) {
	const sql = `SELECT * FROM tank_data_schema.parameter;`;
	return pgClient.query(sql).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	usePgClient('postgres', pgClient => fetchParameters(pgClient).then(parameters => console.log(parameters)));
}
