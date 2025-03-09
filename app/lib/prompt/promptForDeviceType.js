import fetchDeviceTypes from "../fetch/fetchDeviceTypes.js";
import promptFromList from "./promptFromList.js";

export default function promptForDeviceType(pgClient, dataName, data) {
  return fetchDeviceTypes(pgClient).then((types) =>
    promptFromList("Device Types", types, "name", dataName, data),
  );
}
