import { fileURLToPath } from 'url';

import getILog from './getILog.js';
import getTLog from './getTLog.js';

const didToParam = {
	'2_0': 'alk',
	'2_1': 'calc',
	'2_2': 'mag'
};

function genReading(parameterName, value, time) {
	return { parameterName, value, time };
}

export default function fetchFromApex(host, username, password) {
	const promises = [];

	promises.push(
		getILog(host, username, password, 7, '241025')
		.then(v => v.ilog.record.flatMap(record => {
			return [
				genReading('temp', record.data[0].value, record.date),
				genReading('ph', record.data[1].value, record.date)
			];
		}))
	);


	promises.push(
		getTLog(host, username, password, 7, '241025')
		.then(v => v.tlog.record.map(record => genReading(didToParam[record.did], record.value, record.date)))
	);

	return Promise.all(promises).then(fulfilled => fulfilled.flatMap(x => x));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const host = process.argv[2];
	const username = process.argv[3] || 'admin';
	const password = process.argv[4] || '1234';
	fetchFromApex(host, username, password)
	.then(v => console.log(v));
}
