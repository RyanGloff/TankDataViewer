import fetchLatestReading from '../lib/fetch/fetchLatestReading.js';
import performQuestion from '../lib/prompt/performQuestion.js';
import promptForParameter from '../lib/prompt/promptForParameter.js';
import promptForTank from '../lib/prompt/promptForTank.js';
import promptForValue from '../lib/prompt/promptForValue.js';
import promptForTime from '../lib/prompt/promptForTime.js';
import storeParameterReading from '../lib/store/storeParameterReading.js';
import usePgClient from '../lib/usePgClient.js';

function addLatestValueToData(data, pgClient) {
  return fetchLatestReading(pgClient, data.parameter.id, data.tank.id)
  .then(reading => {
    data.latestReading = reading;
    return data;
  });
}

function storeLastReading(data, pgClient) {
  const newDate = new Date(data.time.getTime() - 1000);
  return storeParameterReading(pgClient, data.tank.id, data.parameter.id, data.latestReading.value, newDate)
  .then(res => {
    console.log(`Stored new reading: Tank -> ${data.tank.id}, Parameter -> ${data.parameter.id}, Value -> ${data.latestReading.value}, Time -> ${newDate}`);
    return data;
  });
}

function storeNewReading(data, pgClient) {
  return storeParameterReading(pgClient, data.tank.id, data.parameter.id, data.value, data.time)
  .then(res => {
    console.log(`Stored new reading: Tank -> ${data.tank.id}, Parameter -> ${data.parameter.id}, Value -> ${data.value}, Time -> ${data.time}`);
    return data;
  });
}

function addDosage() {
	usePgClient('tank_data_injector', pgClient => {
    return promptForTank(pgClient, 'tank', {})
		.then(data => promptForParameter(pgClient, 'parameter', data))
		.then(data => promptForValue('Enter a value: ', 'value', data))
    .then(data => promptForTime('Enter a time: (blank uses the current time)', 'time', data))
    .then(data => addLatestValueToData(data, pgClient))
    .then(data => storeLastReading(data, pgClient))
		.then(data => storeNewReading(data, pgClient));
	});
}

addDosage();





