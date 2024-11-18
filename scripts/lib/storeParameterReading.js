import usePgClient from './usePgClient.js';
import { fileURLToPath } from 'url';

export default function storeParameterReading(pgClient, tank_id, parameter_id, value, time) {
	const sql = `
INSERT INTO tank_data_schema.parameter_reading(tank_id, parameter_id, value, time) VALUES ($1, $2, $3, $4);
	`;
	const params = [ tank_id, parameter_id, value, time ];
	return pgClient.query(sql, params).catch(err => {
		if (!err.detail.indexOf('already exists')) {
			throw err;
		}
		return null;
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const tankId = process.argv[2];
	const parameterId = process.argv[3];
	const value = process.argv[4];
	const time = new Date(process.argv[5] || Date.now());
	console.log(`Storing parameter with values: TankId -> ${tankId}, ParameterId -> ${parameterId}, Value -> ${value}, Time -> ${time.toISOString()}`);
	usePgClient('postgres', pgClient => storeParameterReading(pgClient, tankId, parameterId, value, time));
}
