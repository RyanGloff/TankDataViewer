import performQuestion from './performQuestion.js';

/**
 Prompts user to pick from a list of data objects
 @param {listName} the name of the list of objects
 @param {list} the list of objects
 @param {nameField} the field in the objects to list out as an identifying name
 @param {dataName} the field name to store the result in the data object
 @param {data} the object of data collected. Also the place where the result is stored
 @returns a promise for the data object
 */
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
