import promptForInteger from "./promptForInteger.js";

export default function promptForDailyTime(prompt, dataName, data) {
  console.log(prompt);
  return promptForInteger("Hour of day (0): ", "hour", {}, 0)
    .then((data) => promptForInteger("Minute of hour (0): ", "minute", data, 0))
    .then((data) =>
      promptForInteger("Second of the minute (0): ", "second", data, 0),
    )
    .then((time) => {
      data[dataName] = time;
      return data;
    });
}
