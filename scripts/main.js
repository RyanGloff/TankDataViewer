/*
 This script is meant to be run as a cron job to periodically pull ParameterReading values from the apex and store
 them in the postgres database. This script uses the postgres role of `tank_data_injector`. This role was created
 by the setup script in the postgres directory and has permissions limited only to required permissions
 */

import usePgClient from './usePgClient.js';
import fetchFromApex from './fetchFromApex.js';
import fetchParameters from './fetchParameters.js';
import fetchTanks from './fetchTanks.js';
import storeParameterReading from './storeParameterReading.js';

const parameterCache = {};

function cacheParameters(pgClient) {
	return fetchParameters(pgClient)
	.then(parameters => parameters.forEach(parameter => parameterCache[parameter.apex_name] = parameter))
}

function main() {
	usePgClient('tank_data_injector', pgClient => {
		return cacheParameters(pgClient)
		.then(() => console.log(parameterCache))
		.then(() => fetchTanks(pgClient))
		.then(tanks => Promise.all(tanks.map(tank => {
			if (!tank.apex_host || tank.apex_host.length === 0) return;
			return fetchFromApex(tank.apex_host, 'admin', '1234') // Hardcoded the default values for apex.local
			.then(readings => readings.map(reading => {
				console.log(JSON.stringify(reading));
				console.log(parameterCache[reading.parameterName]);
				return storeParameterReading(pgClient, tank.id, parameterCache[reading.parameterName].id, reading.value, new Date(reading.time * 1000));
			})).then(v => Promise.all(v));
		})));
	});
}

main();

