import promptForValue from "../lib/prompt/promptForValue.js";
import promptForKasaDeviceType from "../lib/prompt/promptForKasaDeviceType.js";
import storeKasaDevice from "../lib/store/storeKasaDevice.js";
import usePgClient from "../lib/usePgClient.js";

function addKasaDevice() {
  usePgClient("postgres", (pgClient) => {
    return promptForValue("Enter the kasa device name: ", "name", {})
      .then((data) => promptForValue("Enter the device host: ", "host", data))
      .then((data) =>
        promptForValue("Enter the device child name: ", "childName", data),
      )
      .then((data) => promptForKasaDeviceType(pgClient, "deviceType", data))
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .then((data) =>
        storeKasaDevice(
          pgClient,
          data.name,
          data.host,
          data.deviceType.id,
          data.childName,
        ),
      );
  });
}

addKasaDevice();
