import promptForValue from '../lib/prompt/promptForValue.js';
import storeTank from '../lib/store/storeTank.js';
import usePgClient from '../lib/usePgClient.js';

function addTank() {
	usePgClient('postgres', pgClient => {
    return promptForValue('Enter the tank name: ', 'name', {})
    .then(data => promptForValue('Enter the apex_host (Leave empty for none): ', 'apex_host', data))
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeTank(pgClient, data.name, data.apex_host));
	});
}

addTank();
