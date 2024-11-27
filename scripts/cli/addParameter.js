import promptForValue from '../lib/prompt/promptForValue.js';
import storeParameter from '../lib/store/storeParameter.js';
import usePgClient from '../lib/usePgClient.js';

function addParameter() {
	usePgClient('postgres', pgClient => {
    return promptForValue('Enter a name for the parameter: ', 'name', {})
    .then(data => promptForValue('Enter a apex name (Leave empty for parameters not tracked by apex): ', 'apex_name', data))
		.then(data => {
			console.log(JSON.stringify(data));
			return data;
		})
		.then(data => storeParameter(pgClient, data.name, data.apex_name));
	});
}

addParameter();
