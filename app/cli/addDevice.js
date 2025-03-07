import promptForDeviceType from '../lib/prompt/promptForDeviceType.js';
import promptForValue from '../lib/prompt/promptForValue.js';
import storeDevice from '../lib/store/storeDevice.js';
import usePgClient from '../lib/usePgClient.js';

function addDevice() {
	usePgClient('postgres', pgClient => {
    return promptForDeviceType(pgClient, 'device_type', {})
    .then(data => promptForValue('Enter a name for the device: ', 'name', data))
    .then(data => promptForValue('Enter a hostname for the device: ', 'host', data))
    .then(data => {
      console.log(JSON.stringify(data));
      return data;
    })
    .then(data => storeDevice(pgClient, data.name, data.host, data.device_type.id));
	});
}

addDevice();
