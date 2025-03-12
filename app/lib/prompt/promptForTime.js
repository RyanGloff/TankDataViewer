import performQuestion from "./performQuestion.js";

export default function promptForTime(prompt, dataName, data) {
  return performQuestion(`${prompt}: (blank uses the current time)`).then(
    (answer) => {
      const newData = { ...data };
      newData[dataName] = new Date(answer.length === 0 ? Date.now() : answer);
      return newData;
    },
  );
}
