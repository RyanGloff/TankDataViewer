import usePgClient from '../usePgClient.js';
import { fileURLToPath } from 'url';

export default function storeAlarm(pgClient, name, tankId, parameterId, lowLimit, highLimit) {
	const sql = `
INSERT INTO tank_data_schema.alarm(name, tank_id, parameter_id, low_limit, high_limit) VALUES ($1, $2, $3, $4, $5);
	`;
	const parameters = [ name, tankId, parameterId, lowLimit, highLimit ];
	return pgClient.query(sql, parameters).then(res => res.rows);
}
