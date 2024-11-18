import usePgClient from './lib/usePgClient.js';
import fetchTanks from './lib/fetchTanks.js';
import fetchParameters from './lib/fetchParameters.js';
import storeAlarm from './lib/storeAlarm.js';
import performQuestion from './lib/performQuestion.js';

function addAlarm() {
	// Pick a tank
	usePgClient('postgres', pgClient => {
    return performQuestion('Enter a name for the alarm: ')
    .then(answer => {
        return { name: answer };
    })
		.then(data => {
      return fetchTanks(pgClient)
      .then(tanks => {
        console.log('----- Tanks -----');
        tanks.forEach((tank, index) => console.log(`${index + 1}: ${tank.name} (${tank.apex_host || 'No Apex'})`));
        console.log('-----------------');
        return performQuestion('Enter a tank number: ')
        .then(tankNumber => tanks[tankNumber - 1])
        .then(tank => {
          return { ...data, tank };
        });
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
			return performQuestion('Enter a low limit (leave empty for none): ')
			.then(answer => {
				return { ...data, lowLimit: answer || null };
			});
		})
		.then(data => {
			return performQuestion('Enter a high limit (leave empty for none): ')
			.then(answer => {
				return { ...data, highLimit: answer || null };
			});
		})
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeAlarm(pgClient, data.name, data.tank.id, data.parameter.id, data.lowLimit, data.highLimit));
	});
}

addAlarm();
