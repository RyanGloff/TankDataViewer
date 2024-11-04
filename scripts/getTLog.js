import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import getStartDay from './getStartDay.js';
import getConnectSid from './getConnectSid.js';

async function getTLog(host, username, password, startDay, numDays) {
  const { connectSid } = await getConnectSid(host, username, password);
  const url = `http://${host}/rest/tlog?days=${numDays || 7}&sdate=${startDay}&_=${Date.now()}`;
  const response = await fetch(url, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "accept-version": "1",
      "x-requested-with": "XMLHttpRequest",
      "cookie": `connect.sid=${connectSid}`,
      "Referer": `http://${host}/apex/ilog`,
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });
  const body = await response.json();
  return body;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const host = process.argv[2];
	const numDays = process.argv[3] || 7;
	const startDate = process.argv[4] || getStartDay(numDays);
	const username = process.argv[5] || 'admin';
	const password = process.argv[6] || '1234';
	getTLog(host, username, password, startDate, numDays);
}

export default getTLog;
