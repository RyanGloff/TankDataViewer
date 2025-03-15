import fetchAndStoreApexData from "./fetchAndStoreApexData.js";

const pollRate = 60 * 1000;

function main() {
  console.log(`Starting Interval for fetch from apex`);
  fetchAndStoreApexData();
  setInterval(() => {
    console.log(`Starting fetch from apex`);
    fetchAndStoreApexData();
  }, pollRate);
}

main();
