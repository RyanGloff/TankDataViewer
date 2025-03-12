import promptForDevice from "../lib/prompt/promptForDevice.js";
import promptForReal from "../lib/prompt/promptForReal.js";
import promptForDailyTime from "../lib/prompt/promptForDailyTime.js";
import promptForBoolean from "../lib/prompt/promptForBoolean.js";
import storeDevicePowerTarget from "../lib/store/storeDevicePowerTarget.js";
import usePgClient from "../lib/usePgClient.js";

function addDevicePowerTarget() {
  usePgClient("postgres", (pgClient) => {
    return promptForDevice(pgClient, "device", {})
      .then((data) => promptForDailyTime("Enter a time: ", "time", data))
      .then((data) =>
        promptForBoolean(
          "Enter a desired power state: ",
          "desiredPowerState",
          data,
        ),
      )
      .then((data) =>
        promptForBoolean(
          "Enforce desired power state on discrepancy: ",
          "enforceOnDiscrepancy",
          data,
        ),
      )
      .then((data) =>
        promptForBoolean(
          "Notify on power state discrepancy: ",
          "notifyOnDiscrepancy",
          data,
        ),
      )
      .then((data) =>
        promptForReal(
          "Minimum Acceptable Draw (null): ",
          "minimumAcceptableDraw",
          data,
        ),
      )
      .then((data) =>
        promptForReal(
          "Maximum Acceptable Draw (null): ",
          "maximumAcceptableDraw",
          data,
        ),
      )
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .then((data) =>
        storeDevicePowerTarget(
          pgClient,
          data.device.id,
          data.time,
          data.desiredPowerState,
          data.enforceOnDiscrepancy,
          data.notifyOnDiscrepancy,
          data.minimumAcceptableDraw,
          data.maximumAcceptableDraw,
        ),
      );
  });
}

addDevicePowerTarget();
