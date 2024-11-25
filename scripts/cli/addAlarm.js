import performQuestion from '../lib/prompt/performQuestion.js';
import promptForTank from '../lib/prompt/promptForTank.js';
import promptForParameter from '../lib/prompt/promptForParameter.js';
import promptForValue from '../lib/prompt/promptForValue.js';
import storeAlarm from '../lib/store/storeAlarm.js';
import usePgClient from '../lib/usePgClient.js';

function addAlarm() {
	usePgClient('postgres', pgClient => {
    return promptForValue('Enter a name for the alarm: ', 'name', {})
    .then(data => promptForTank(pgClient, 'tank', data))
    .then(data => promptForParameter(pgClient, 'parameter', data))
    .then(data => promptForValue('Enter a low limit (leave empty for none): ', 'lowLimit', data))
    .then(data => promptForValue('Enter a high limit (leave empty for none): ', 'highLimit', data))
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeAlarm(pgClient, data.name, data.tank.id, data.parameter.id, data.lowLimit, data.highLimit));
	});
}

addAlarm();
