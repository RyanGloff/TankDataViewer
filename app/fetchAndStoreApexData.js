/*
 This script is meant to be run as a cron job to periodically pull ParameterReading values from the apex and store
 them in the postgres database. This script uses the postgres role of `tank_data_injector`. This role was created
 by the setup script in the postgres directory and has permissions limited only to required permissions
 */

import usePgClient from "./lib/usePgClient.js";
import fetchFromApex from "./lib/fetch/fetchFromApex.js";
import fetchParameters from "./lib/fetch/fetchParameters.js";
import fetchTanks from "./lib/fetch/fetchTanks.js";
import storeParameterReading from "./lib/store/storeParameterReading.js";

const APEX_DEFAULT_USERNAME = "admin";
const APEX_DEFAULT_PASSWORD = "1234";

const parameterCache = {};

function cacheParameters(pgClient) {
  return fetchParameters(pgClient).then((parameters) =>
    parameters.forEach(
      (parameter) => (parameterCache[parameter.apex_name] = parameter),
    ),
  );
}

function filterOutNonApexTanks(tanks) {
  function isApexTank(tank) {
    return tank.apex_host && tank.apex_host.length !== 0;
  }

  return tanks.filter(isApexTank);
}

function logReadings(readings) {
  console.log(`Found ${readings.length}`);
  return readings;
}

function storeEachReading(pgClient, tank, readings) {
  return readings.map((reading) => {
    return storeParameterReading(
      pgClient,
      tank.id,
      parameterCache[reading.parameterName].id,
      reading.value,
      new Date(reading.time * 1000),
    ).then(logAddedReadings);
  });
}

function logAddedReadings(storeReadingResult) {
  if (storeReadingResult === null) return null;
  return storeReadingResult;
}

function fetchAndStoreReadingsForTanks(pgClient, tanks) {
  return Promise.all(
    tanks.map((tank) => {
      console.log(`Fetching from Apex at ${tank.apex_host}`);
      return fetchFromApex(
        tank.apex_host,
        APEX_DEFAULT_USERNAME,
        APEX_DEFAULT_PASSWORD,
      ) // Hardcoded the default values for apex.local
        .then(logReadings)
        .then((readings) => storeEachReading(pgClient, tank, readings))
        .then((v) => Promise.all(v));
    }),
  );
}

export default function fetchAndStoreApexData() {
  console.log(
    `Starting script to pull from Apex and inject into postgres: ${new Date(Date.now()).toISOString()}`,
  );
  usePgClient("tank_data_injector", (pgClient) => {
    return cacheParameters(pgClient)
      .then(() => fetchTanks(pgClient))
      .then(filterOutNonApexTanks)
      .then((tanks) => fetchAndStoreReadingsForTanks(pgClient, tanks));
  });
}
