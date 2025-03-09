import fetchKasaDeviceTypes from "../fetch/fetchKasaDeviceTypes.js";
import promptFromList from "./promptFromList.js";

export default function promptForKasaDeviceType(pgClient, dataName, data) {
  return fetchKasaDeviceTypes(pgClient).then((types) =>
    promptFromList("Kasa Device Types", types, "name", dataName, data),
  );
}
