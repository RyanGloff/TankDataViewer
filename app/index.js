import backupDatabase from "./backupDatabase.js";
import checkEnergyUsage from "./checkEnergyUsage.js";
import fetchAndStoreApexData from "./fetchAndStoreApexData.js";
import usePgClient from "./lib/usePgClient.js";

const pollRate = 60 * 1000;

//const backupRate = 24 * 60 * 60 * 1000;
const backupRate = 1000 * 60;

const energyMonitorRate = 1000 * 30;

function main() {
  console.log(`Starting Interval for fetch from apex`);
  setInterval(() => {
    console.log(`Starting fetch from apex`);
    fetchAndStoreApexData();
  }, pollRate);

  console.log(`Starting Interval for backing up database`);
  setInterval(() => {
    console.log(`Starting backup from database`);
    backupDatabase();
  }, backupRate);

  console.log(`Starting Energy Usage Monitor`);
  setInterval(() => {
    console.log(`Starting energy poll`);
    usePgClient("postgres", (pgClient) => checkEnergyUsage(pgClient));
  }, energyMonitorRate);
}

main();
