import checkEnergyUsage from "./checkEnergyUsage.js";

const pollRate = 60 * 1000;

function main() {
  console.log(`Starting Interval for checkEnergyUsage`);
  checkEnergyUsage();
  setInterval(() => {
    console.log(`Starting checkEnergyUsage`);
    checkEnergyUsage();
  }, pollRate);
}

main();
