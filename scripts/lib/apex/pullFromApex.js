async function fetchApexData(host) {
	const parameterReadings = [];
	// Copied from browser
	const response = await fetch(`http://${host}/rest/ilog?days=1&sdate=241025&_=1729961895122`, {
	    "credentials": "include",
	    "headers": {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
		"Accept": "application/json, text/javascript, */*; q=0.01",
		"Accept-Language": "en-US,en;q=0.5",
		"accept-version": "1",
		"X-Requested-With": "XMLHttpRequest",
		"Sec-GPC": "1"
	    },
	    "referrer": `http://${host}/apex/dash`,
	    "method": "GET",
	    "mode": "cors"
	});

	const data = await response.json();
	data.ilog.record.forEach(record => {
		const tempReading = {
			parameterName: 'temp',
			time: new Date(record.date),
			value: record.data[0].value
		};
		parameterReadings.push(tempReading);

		const phReading = {
			parameterName: 'ph',
			time: new Date(record.date),
			value: record.data[1].value
		};
		parameterReadings.push(phReading);
	});

	return parameterReadings;
}

if (require.main === module) {
	fetchApexData('192.168.50.80').then(data => console.log(data));
}

module.exports = fetchApexData;
