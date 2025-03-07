import fetchTanks from '../fetch/fetchTanks.js';
import promptFromList from './promptFromList.js';

export default function promptForTank(pgClient, dataName, data) {
  return fetchTanks(pgClient)
  .then(tanks => promptFromList('Tanks', tanks, 'name', dataName, data));
}
