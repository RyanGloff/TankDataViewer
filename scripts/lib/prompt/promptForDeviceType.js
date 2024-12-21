import fetchDeviceTypes from '../fetch/fetchDeviceTypes.js';
import promptFromList from './promptFromList.js';

export default function promptForParameter(pgClient, dataName, data) {
  return fetchDeviceTypes(pgClient)
  .then(deviceTypes => promptFromList('Device Types', deviceTypes, 'name', dataName, data));
}
