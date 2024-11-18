import usePgClient from './usePgClient.js';
import fileURLToPath from 'url';

function storeReading(pgClient, tankId, parameterId, value, time) {
	const sql = `
INSERT INTO tank_data_schema.parameter_reading(tank_id, parameter_id, value, time)
SELECT $1, $2, $3, $4 from (
	SELECT 1 from tank_data_schema.parameter_reading where not exists(tank_id = $1 and 
)
	`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const tankId = process.argv[2];
	const parameterId = process.argv[3];
	const value = process.argv[4];
	const timeStr = process.argv[5];
	const timeObj = new Date(timeStr || Date.now());
	console.log(`Storing reading with values: TankId -> ${tankId}, ParameterId -> ${parameterId}, Value -> ${value}, Time -> ${timeObj.toISOString()}`);
	usePgClient('postgres', pgClient => storeReading(tankId, parameterId, value, time));
}
