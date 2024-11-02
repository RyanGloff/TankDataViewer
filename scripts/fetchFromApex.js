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
	const numDays = 7;
	const startDate = new Date(Date.now() - (numDays * 24 * 60 * 60 * 1000));
	const yearStr = startDate.getFullYear() % 100;
	const monthStr = `0${startDate.getMonth() + 1}`.slice(-2);
	const dayStr = `0${startDate.getDate()}`.slice(-2);
	const startDateStr = `${yearStr}${monthStr}${dayStr}`;
	console.log(`StartDateStr: ${startDateStr}`);

	promises.push(
		getILog(host, username, password, startDateStr, numDays)
		.then(v => v.ilog.record.flatMap(record => {
			return [
				genReading('temp', record.data[0].value, record.date),
				genReading('ph', record.data[1].value, record.date)
			];
		}))
	);


	promises.push(
		getTLog(host, username, password, startDateStr, numDays)
		.then(v => v.tlog.record.map(record => genReading(didToParam[record.did], record.value, record.date)))
		.then(v => {
			console.log(v);
			return v;
		})
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
