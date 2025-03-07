import backupDatabase from "./backupDatabase.js";
import fetchAndStoreApexData from "./fetchAndStoreApexData.js";

const pollRate = 60 * 1000;

//const backupRate = 24 * 60 * 60 * 1000;
const backupRate = 1000 * 60;

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
}

main();
