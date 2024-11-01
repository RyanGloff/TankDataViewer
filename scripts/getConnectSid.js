import fetch from 'node-fetch';

let connectSid = null;

async function getConnectSid(host, username, password) {
  if (connectSid === null) {
    const response = await fetch(`http://${host}/rest/login`, {
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "accept-version": "1",
        "content-type": "application/json",
        "x-csrf-token": "undefined",
        "x-requested-with": "XMLHttpRequest",
        "Referer": `http://${host}/`,
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      body: `{\"login\":\"${username}\",\"password\":\"${password}\",\"remember_me\":false}`,
      method: "POST"
    });
    const body = await response.json();
    connectSid = body['connect.sid'];
  }
  return { connectSid };
}

export default getConnectSid;
