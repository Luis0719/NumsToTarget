function ToInt(x) {
  return +x;
}

/**
 * Description
 * @param {[HTMLElement]} inputs
 * @param {(string) => T} parser parse each selected input
 * @returns {[T]}
 */
function ValuesFromCheckboxes(inputs, parser = (x) => x) {
  return [...inputs]
    .map((x) => (x.checked ? parser(x.value) : undefined))
    .filter((x) => x);
}

/**
 * Description
 * @param {[HTMLElement]} inputs
 * @param {(string) => T} parser=(x
 * @returns {T}
 */
function ValueFromRadio(inputs, parser = (x) => x) {
  for (const input of inputs) {
    if (input.checked) {
      return parser(input.value);
    }
  }
}

/**
 * @class
 * @constructor
 * @public
 */
class Node {
  /**
   * Description
   * @param {number} value
   * @returns {Node}
   */
  constructor(value) {
    /**
     * Value
     * @type {number}
     * @public
     */
    this.value = value;

    /**
     * Children contains a list of children
     * @type {[number]}
     * @public
     */
    this.children = [];
  }

  /**
   * Description
   * @param {Node} child
   */
  addChild(child) {
    this.children.push(child);
  }
}

/**
 * Description
 * @param {Node} node
 * @param {number} start
 * @param {number} target
 * @param {number} size
 * @param {[number]} exclude
 */
function NodesTo(node, start, target, size, exclude) {
  if (size === 1) {
    if (target <= start || target >= 10) return false;
    if (exclude.includes(target)) return false;
    if (target <= start) return false;
    node.addChild(new Node(target));
    return true;
  }
  let added = false;
  for (let i = start + 1; i < 10; i++) {
    if (exclude.includes(i)) continue;

    let tmpNode = new Node(i);
    if (NodesTo(tmpNode, i, target - i, size - 1, exclude)) {
      node.addChild(tmpNode);
      added = true;
    }
  }
  return added;
}

/**
 * Description
 * @param {Node} node
 * @param {Array(Array(number))} results
 * @param {Array(number)} block
 * @param {Array(number)} exclude_group reject solution if 2 numbers are found in this group.
 * @param {boolean} found_in_group
 */
function Traverse(node, results, block = [], exclude_group, found_in_group) {
  if (node.value !== 0) {
    block.push(node.value);
  }
  if (exclude_group.includes(node.value)) {
    if (found_in_group) return; // We had already found 1! This is invalid.
    found_in_group = true;
  }
  if (node.children.length === 0) {
    results.push(block);
    return;
  }
  node.children.forEach((child) => {
    Traverse(child, results, [...block], exclude_group, found_in_group);
  });
}

/**
 * Description
 * @param {FormData} form
 * @returns {[number]}
 */
function CalculateResultsFor(form) {
  const size = +form.get("i-size");
  const target = +form.get("i-target");
  const exclude = form.getAll("i-exclude").map(ToInt);
  const excludeGroup = form.getAll("i-exclude-group").map(ToInt);

  const root = new Node(0);
  NodesTo(root, /*start=*/ 0, target, size, exclude);
  const results = [];
  Traverse(root, results, [], excludeGroup, false);
  return results;
}

/**
 * Description
 * @param {Event} e
 */
function CalculateResults(e) {
  const form = e.target.closest(".nums-form");
  const results = CalculateResultsFor(new FormData(form));

  const resultDiv = form.getElementsByClassName("js-result")[0];
  resultDiv.innerHTML = "";
  results.forEach((result) => {
    const div = document.createElement("div");
    div.innerText = JSON.stringify(result);
    resultDiv.appendChild(div);
  });
}

/**
 * Description
 * @param {[HTMLElement]} inputs
 * @param {string} event
 * @param {() => undefined} handler
 */
function SetEventHandler(inputs, event, handler) {
  for (const input of inputs) {
    input.addEventListener(event, handler);
  }
}

/**
 * Description
 * @param {[HTMLElement]} inputs
 * @param {() => undefined} handler
 */
function SetChangeHandler(inputs, handler) {
  SetEventHandler(inputs, "change", handler);
}

/**
 * Description
 * @param {[HTMLElement]} inputs
 * @param {() => undefined} handler
 */
function SetClickHandler(inputs, handler) {
  SetEventHandler(inputs, "click", handler);
}

/**
 * Description
 * @param {number} size
 * @returns {number}
 */
function GetMinPossible(size) {
  // We add 1 since Array(size) starts at 0.
  return [...Array(size).keys()].reduce((sum, next) => sum + next + 1, 0);
}
/**
 * Description
 * @param {number} size
 * @returns {number}
 */
function GetMaxPossible(size) {
  return [...Array(size).keys()].reduce((sum, next) => sum + (9 - next), 0);
}

/**
 * Description
 * @param {Event} e
 */
function HandleSizeChange(e) {
  const value = +e.target.value;
  const min = GetMinPossible(value);
  const max = GetMaxPossible(value);
  const targetInput = e.target
    .closest(".nums-form")
    .querySelector('input[name="i-target"]');
  targetInput.setAttribute("min", min);
  targetInput.setAttribute("max", max);
  if (targetInput.value < min) {
    targetInput.value = min;
  }
  if (targetInput.value > max) {
    targetInput.value = max;
  }

  CalculateResults(e);
}

function HandleResetClick(e) {
  const form = e.target.closest(".nums-form");
  form
    .querySelectorAll('input[name="i-exclude"]')
    .forEach((x) => (x.checked = false));
  form
    .querySelectorAll('input[name="i-exclude-group"]')
    .forEach((x) => (x.checked = false));
  CalculateResults(e);
}

function SetChangeHandlers() {
  SetChangeHandler(document.getElementsByName("i-target"), CalculateResults);
  SetChangeHandler(document.getElementsByName("i-size"), HandleSizeChange);
  SetChangeHandler(document.getElementsByName("i-exclude"), CalculateResults);
  SetChangeHandler(
    document.getElementsByName("i-exclude-group"),
    CalculateResults
  );
  SetClickHandler(
    document.getElementsByClassName("btn-reset"),
    HandleResetClick
  );
}
SetChangeHandlers();

// Disable form submit
const forms = document.getElementsByClassName("nums-form");
for (const form of forms) {
  form.addEventListener("submit", (e) => e.preventDefault());
}

document.getElementById("btn-add").addEventListener("click", (e) => {
  const newForm = document
    .getElementById("nums-form-template")
    .cloneNode(/*deep=*/ true);
  newForm.id = "";
  newForm.class = "nums-form";
  document.getElementById("forms-container").appendChild(newForm);
  SetChangeHandlers();
});

document.getElementById("btn-remove").addEventListener("click", (e) => {
  const forms = document.getElementsByClassName("nums-form");
  forms[forms.length - 1].remove();
});
