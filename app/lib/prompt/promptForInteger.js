import performQuestion from "./performQuestion.js";

export default function promptForInteger(prompt, dataName, data, defaultValue) {
  return performQuestion(prompt).then((answer) => {
    if (answer === "") {
      answer = `${defaultValue}`;
    }
    const newData = { ...data };
    newData[dataName] = parseInt(answer);
    return newData;
  });
}
