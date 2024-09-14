/**
 * Append child to element with id.
 * @param {string} id
 * @param {HTMLElement} child
 */
function AppendToId(id, child) {
  const root = document.getElementById(id);
  root.appendChild(child);
}

/**
 * Append child to all elements with className.
 * @param {string} className
 * @param {HTMLElement} child
 */
function AppendToClassName(className, child) {
  for (let root of document.getElementsByClassName(className)) {
    root.appendChild(child);
  }
}

/**
 * Appends child to given element.
 * @param {string} id=""
 * @param {string} className=""
 * @param {HTMLElement} child}
 */
function AppendTo({ id = "", className = "", child }) {
  if (id) {
    AppendToId(id, child);
  }
  if (className) {
    AppendToClassName(className, child);
  }
}

function AppendMultipleTo({ id = "", className = "", children }) {
  for (const child of children) {
    AppendTo({ id, className, child });
  }
}

/**
 * Create <input type="number">
 * @param {HTMLElement} container
 * @param {ElementCreationOptions} opts={}
 * @returns {HTMLElement}
 */
function CreateNumberInput(opts = {}) {
  const input = document.createElement("input");
  input.type = "number";
  for (const [key, value] of Object.entries(opts)) {
    input.setAttribute(key, value);
  }
  return input;
}

function CreateCheckboxList(name, options) {
  const container = document.createElement("div");
  options.forEach((option) => {
    if (!option.id || !option.value) {
      throw Error("Box is missing id or value " + JSON.stringify(option));
    }
    const input = document.createElement("input", { id: option.id });
    input.type = "checkbox";
    input.name = name;
    for (const [key, value] of Object.entries(option)) {
      input.setAttribute(key, value);
    }

    const label = document.createElement("label");
    label.setAttribute("for", option.id);
    label.innerText = option.value;

    container.appendChild(input);
    container.appendChild(label);
  });
  return container;
}

function CreateRadioList(name, options, checked_fn = (option, index) => false) {
  const container = document.createElement("div");
  options.forEach((option, index) => {
    if (!option.id || !option.value) {
      throw Error("Box is missing id or value " + JSON.stringify(option));
    }
    const input = document.createElement("input", { id: option.id });
    input.type = "radio";
    input.name = name;
    for (const [key, value] of Object.entries(option)) {
      input.setAttribute(key, value);
    }
    if (checked_fn(option, index)) {
      input.checked = true;
    }

    const label = document.createElement("label");
    label.setAttribute("for", option.id);
    label.innerText = option.value;

    container.appendChild(input);
    container.appendChild(label);
  });
  return container;
}
