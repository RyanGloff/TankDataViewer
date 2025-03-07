import usePgClient from '../usePgClient.js';
import { fileURLToPath } from 'url';

export default function storeTank(pgClient, tankName, apexHost) {
	const sql = `
INSERT INTO tank_data_schema.tank(name, apex_host) VALUES ($1, $2);
	`;
	const parameters = [ tankName, apexHost || '' ];
	console.log(parameters);
	return pgClient.query(sql, parameters).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const tankName = process.argv[2];
	const apexHost = process.argv[3] || '';
	console.log(apexHost);
	console.log(`Storing tank with values: Name -> ${tankName}, ApexHost -> ${apexHost}`);
	usePgClient('postgres', pgClient => storeTank(pgClient, tankName, apexHost));
}
