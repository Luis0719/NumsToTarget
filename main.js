const targetInput = document.getElementsByName("i-target");
const sizeInputs = document.getElementsByName("i-size");
const excludeInputs = document.getElementsByName("i-exclude");
const excludeGroupInputs = document.getElementsByName("i-exclude-group");

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

function CalculateResults() {
  const size = ValueFromRadio(sizeInputs, ToInt);
  const target = +targetInput[0].value;
  const exclude = ValuesFromCheckboxes(excludeInputs, ToInt);
  const excludeGroup = ValuesFromCheckboxes(excludeGroupInputs, ToInt);

  const root = new Node(0);
  NodesTo(root, /*start=*/ 0, target, size, exclude);
  const results = [];
  Traverse(root, results, [], excludeGroup, false);

  const resultDiv = document.getElementById("js-result");
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
 * @param {() => undefined} handler
 */
function SetChangeHandler(inputs, handler) {
  for (const input of inputs) {
    input.addEventListener("change", handler);
  }
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

function HandleSizeChange(e) {
  const value = +e.target.value;
  const min = GetMinPossible(value);
  const max = GetMaxPossible(value);
  targetInput[0].setAttribute("min", min);
  targetInput[0].setAttribute("max", max);
  if (targetInput[0].value < min) {
    targetInput[0].value = min;
  }
  if (targetInput[0].value > max) {
    targetInput[0].value = max;
  }

  CalculateResults();
}
SetChangeHandler(targetInput, CalculateResults);
SetChangeHandler(sizeInputs, HandleSizeChange);
SetChangeHandler(excludeInputs, CalculateResults);
SetChangeHandler(excludeGroupInputs, CalculateResults);
