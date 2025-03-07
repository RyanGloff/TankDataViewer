import promptForValue from './promptForValue.js';

export default function promptForReal(prompt, dataName, data) {
  return promptForValue(prompt, dataName, data)
  .then(data => {
      data[dataName] = parseFloat(data[dataName]);
      return data;
  });
}
