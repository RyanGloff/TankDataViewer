import promptForValue from "../lib/prompt/promptForValue.js";
import storeDeviceType from "../lib/store/storeDeviceType.js";
import usePgClient from "../lib/usePgClient.js";

function addDeviceType() {
  usePgClient("postgres", (pgClient) => {
    return promptForValue("Enter the device type name: ", "name", {})
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .then((data) => storeDeviceType(pgClient, data.name));
  });
}

addDeviceType();
