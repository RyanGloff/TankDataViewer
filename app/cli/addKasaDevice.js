import promptForValue from "../lib/prompt/promptForValue.js";
import promptForDeviceType from "../lib/prompt/promptForDeviceType.js";
import storeDevice from "../lib/store/storeDevice.js";
import usePgClient from "../lib/usePgClient.js";

function addKasaDevice() {
  usePgClient("postgres", (pgClient) => {
    return promptForValue("Enter the device name: ", "name", {})
      .then((data) => promptForValue("Enter the device host: ", "host", data))
      .then((data) =>
        promptForValue("Enter the device child name: ", "childName", data),
      )
      .then((data) => promptForDeviceType(pgClient, "deviceType", data))
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .then((data) =>
        storeDevice(
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
