import usePgClient from './lib/usePgClient.js';
import storeParameterReading from './lib/storeParameterReading.js';
import fetchTanks from './lib/fetchTanks.js';
import fetchParameters from './lib/fetchParameters.js';
import performQuestion from './lib/performQuestion.js';

function addReading() {
	// Pick a tank
	usePgClient('tank_data_injector', pgClient => {
		return fetchTanks(pgClient)
		.then(tanks => {
			console.log('----- Tanks -----');
			tanks.forEach((tank, index) => console.log(`${index + 1}: ${tank.name} (${tank.apex_host || 'No Apex'})`));
			console.log('-----------------');
			return performQuestion('Enter a tank number: ')
			.then(tankNumber => tanks[tankNumber - 1])
			.then(tank => {
				return { tank };
			});
		})
		.then(data => {
			return fetchParameters(pgClient)
			.then(parameters => {
				console.log('----- Parameters -----');
				parameters.forEach((parameter, index) => console.log(`${index + 1}: ${parameter.name}`));
				console.log('----------------------');
				return performQuestion('Enter a parameter number: ')
				.then(parameterNumber => parameters[parameterNumber - 1])
				.then(parameter => {
					return { ...data, parameter };
				});
			});
		})
		.then(data => {
			return performQuestion('Enter a value: ')
			.then(answer => {
				return { ...data, value: answer };
			});
		})
		.then(data => {
			return performQuestion('Enter a time: (blank uses the current time)')
			.then(answer => {
				return { ...data, time: new Date(answer.length === 0 ? Date.now() : answer) };
			});
		})
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeParameterReading(pgClient, data.tank.id, data.parameter.id, data.value, data.time));

	});
}

addReading();





