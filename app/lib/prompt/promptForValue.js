import performQuestion from './performQuestion.js';

export default function promptForValue(prompt, dataName, data) {
  return performQuestion(prompt)
  .then(answer => {
    const newData = { ...data };
    newData[dataName] = answer;
    return newData;
  });
}
