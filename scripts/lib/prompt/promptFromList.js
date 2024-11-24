import performQuestion from './performQuestion.js';

export default function promptFromList(listName, list, nameField, dataName, data) {
  const header = `----- ${listName} -----`;
  console.log(header);
  list.forEach((ele, index) => console.log(`${index + 1}: ${ele[nameField]}`));
  console.log('-'.repeat(header.length));
  return performQuestion(`Enter a ${listName} number: `)
  .then(selectionNumber => list[selectionNumber - 1])
  .then(selection => {
    const newData = { ...data };
    newData[dataName] = selection;
    return newData;
  });
}
