import fetchDevices from "../fetch/fetchDevices.js";
import promptFromList from "./promptFromList.js";

export default function promptForDevice(pgClient, dataName, data) {
  return fetchDevices(pgClient).then((parameters) =>
    promptFromList("Devices", parameters, "name", dataName, data),
  );
}
