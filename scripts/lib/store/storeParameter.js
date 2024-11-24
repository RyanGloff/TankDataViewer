import usePgClient from '../usePgClient.js';
import { fileURLToPath } from 'url';

export default function storeParameter(pgClient, name, apexName) {
	const sql = `
INSERT INTO tank_data_schema.parameter(name, apex_name) VALUES ($1, $2);
	`;
	const parameters = [ name, apexName || null ];
	return pgClient.query(sql, parameters).then(res => res.rows);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const parameterName = process.argv[2];
	const apexName = process.argv[3];
	console.log(`Storing parameter with values: Name -> ${parameterName}, ApexName -> ${apexName}`);
	usePgClient('postgres', pgClient => storeParameter(pgClient, parameterName, apexName));
}
