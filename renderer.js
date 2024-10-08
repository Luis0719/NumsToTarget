function CreateTargetInput() {
  AppendToClassName("js-target-input", () =>
    CreateNumberInput({
      name: "i-target",
      min: 3,
      max: 17,
      value: 3,
    })
  );
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
  AppendToClassName("js-exclude-inputs", () =>
    CreateCheckboxList(
      { name: "i-exclude" },
      IncrementNumbersInputData("i-exclude", 9)
    )
  );
}
CreateExcludeOptions();

function CreateExcludeGroupOptions() {
  AppendToClassName("js-exclude-group-inputs", () =>
    CreateCheckboxList(
      { name: "i-exclude-group" },
      IncrementNumbersInputData("i-exclude-group", 9)
    )
  );
}
CreateExcludeGroupOptions();

function CreateMustIncludeOptions() {
  AppendToClassName("js-must-include-inputs", () =>
    CreateCheckboxList(
      { name: "i-include" },
      IncrementNumbersInputData("i-include", 9)
    )
  );
}
CreateMustIncludeOptions();

function CreateSizeOptions() {
  AppendToClassName("js-size-inputs", () =>
    CreateRadioList(
      { name: "i-size" },
      IncrementNumbersInputData("i-size", /*size=*/ 5, /*start=*/ 2),
      CheckedIfFirst
    )
  );
}
CreateSizeOptions();

/**
 * Description
 */
function AddNumsForm() {
  document.getElementById("forms-container").appendChild(
    CopyElement(/*id=*/ "nums-form-template", {
      id: "",
      className: "nums-form",
    })
  );
}

/**
 * Description
 * @param {HTMLElement} form
 */
function RemoveNumsForm(form) {
  document.getElementById("forms-container").removeChild(form);
}
