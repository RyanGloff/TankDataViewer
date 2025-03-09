import promptForValue from "../lib/prompt/promptForValue.js";
import storeKasaDeviceType from "../lib/store/storeKasaDeviceType.js";
import usePgClient from "../lib/usePgClient.js";

function addKasaDeviceType() {
  usePgClient("postgres", (pgClient) => {
    return promptForValue("Enter the kasa device type name: ", "name", {})
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .then((data) => storeKasaDeviceType(pgClient, data.name));
  });
}

addKasaDeviceType();
