import fetchParameters from '../fetch/fetchParameters.js';
import promptFromList from './promptFromList.js';

export default function promptForParameter(pgClient, dataName, data) {
  return fetchParameters(pgClient)
  .then(parameters => promptFromList('Parameters', parameters, 'name', dataName, data));
}
