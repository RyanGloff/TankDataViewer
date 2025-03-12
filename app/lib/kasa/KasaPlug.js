import { fileURLToPath } from "url";
import Kasa from "tplink-smarthome-api";

const client = new Kasa.Client();

export async function getDevice(options) {
  if (typeof options !== "object") throw new Error("Options must be an object");
  if (options.hasOwnProperty("childId")) {
    return await client.getDevice({
      host: options.host,
      childId: options.childId,
    });
  }
  const device = await client.getDevice({ host: options.host });
  if (!options.hasOwnProperty("childName")) {
    return device;
  }
  const child = device.sysInfo.children.filter(
    (d) => d.alias === options.childName,
  )[0];
  return await client.getDevice({ host: options.host, childId: child.id });
}

export async function getCurrentPowerDraw(device) {
  return device.emeter.getRealtime();
}

export async function setPowerState(device, state) {
  return device.setPowerState(state);
}

export async function getPowerState(device) {
  return device.getPowerState();
}

async function main() {
  const host = process.argv[2];
  const childName = process.argv[3];
  const fn = process.argv[4];
  switch (fn) {
    case "turnOn":
      await setPowerState(await getDevice({ host, childName }), true);
      break;
    case "turnOff":
      await setPowerState(await getDevice({ host, childName }), false);
      break;
    case "getPowerUsage":
      console.log(
        await getCurrentPowerDraw(await getDevice({ host, childName })),
      );
      break;
    case "getPowerState":
      console.log(await getPowerState(await getDevice({ host, childName })));
      break;
    default:
      console.log(`Function: ${fn} is not supported`);
      break;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
