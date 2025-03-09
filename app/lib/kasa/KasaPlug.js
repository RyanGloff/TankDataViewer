import Kasa from "tplink-smarthome-api";

const client = new Kasa.Client();

export async function getDevice(host) {
  return await client.getDevice({ host });
}

export async function getSubDevice(host, childName) {
  const device = await getDevice(host);
  const child = device.sysInfo.children.filter((d) => d.alias === childName)[0];
  return await client.getDevice({ host, childId: child.id });
}

export async function getCurrentPowerDraw(host, childName) {
  let device;
  if (childName) {
    device = await getSubDevice(host, childName);
  } else {
    device = await getDevice(host);
  }

  return device.emeter.getRealtime();
}

async function main() {
  const host = process.argv[2];
  const childName = process.argv[3];
  const fn = process.argv[4];
  switch (fn) {
    case "turnOn":
      (await getSubDevice(host, childName)).setPowerState(true);
      break;
    case "turnOff":
      (await getSubDevice(host, childName)).setPowerState(false);
      break;
    case "getPower":
      console.log(await getCurrentPowerDraw(host, childName));
      break;
    default:
      console.log(`Function: ${fn} is not supported`);
      break;
  }
}

main();
