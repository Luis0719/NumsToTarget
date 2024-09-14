function CreateTargetInput() {
  AppendTo({
    id: "js-target-input",
    child: CreateNumberInput({ name: "i-target", min: 3, max: 17, value: 3 }),
  });
}
CreateTargetInput();

/**
 * Generates a list of
 * @param {string} name
 * @param {number} size
 * @param {number} start
 * @returns {{value: number, id: string, innerHTML: string}}
 */
function IncrementNumbersInputData(name, size, start = 1) {
  return [...Array(size).keys()].map((x) => ({
    value: x + start,
    id: `${name}-${x + start}`,
  }));
}

function CheckedIfFirst(option, index) {
  return index == 0;
}

function CreateExcludeOptions() {
  AppendTo({
    id: "js-exclude-inputs",
    child: CreateCheckboxList(
      "i-exclude",
      IncrementNumbersInputData("i-exclude", 9)
    ),
  });
}
CreateExcludeOptions();

function CreateExcludeGroupOptions() {
  AppendTo({
    id: "js-exclude-group-inputs",
    child: CreateCheckboxList(
      "i-exclude-group",
      IncrementNumbersInputData("i-exclude-group", 9)
    ),
  });
}
CreateExcludeGroupOptions();

function CreateSizeOptions() {
  AppendTo({
    id: "js-size-inputs",
    child: CreateRadioList(
      "i-size",
      IncrementNumbersInputData("i-size", /*size=*/ 5, /*start=*/ 2),
      CheckedIfFirst
    ),
  });
}
CreateSizeOptions();
