import performQuestion from '../lib/prompt/performQuestion.js';
import promptForParameter from '../lib/prompt/promptForParameter.js';
import promptForTank from '../lib/prompt/promptForTank.js';
import promptForValue from '../lib/prompt/promptForValue.js';
import promptForTime from '../lib/prompt/promptForTime.js';
import storeParameterReading from '../lib/store/storeParameterReading.js';
import usePgClient from '../lib/usePgClient.js';

function addReading() {
	usePgClient('tank_data_injector', pgClient => {
    return promptForTank(pgClient, 'tank', {})
		.then(data => promptForParameter(pgClient, 'parameter', data))
		.then(data => promptForValue('Enter a value: ', 'value', data))
    .then(data => promptForTime('Enter a time: (blank uses the current time)', 'time', data))
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeParameterReading(pgClient, data.tank.id, data.parameter.id, data.value, data.time));
	});
}

addReading();





