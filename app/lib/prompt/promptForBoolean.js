import performQuestion from "./performQuestion.js";

function toBoolean(v) {
  if (["true", "on", "y", "yes", "1"].includes(v.toLowerCase())) {
    return true;
  } else if (["false", "off", "n", "no", "0"].includes(v.toLowerCase())) {
    return false;
  } else {
    throw new Error(`Invalid input for boolean. Value was: ${v}`);
  }
}

export default function promptForBoolean(prompt, dataName, data) {
  return performQuestion(prompt).then((answer) => {
    const newData = { ...data };
    newData[dataName] = toBoolean(answer);
    return newData;
  });
}
