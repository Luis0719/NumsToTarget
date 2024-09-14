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

function CreateInputWithLabel(
  inputName,
  inputType,
  attrs,
  configInputFn = (x) => {}
) {
  if (!attrs.id || !attrs.value) {
    throw Error("Box is missing id or value " + JSON.stringify(attrs));
  }
  const input = document.createElement("input");
  input.id = attrs.id;
  input.type = inputType;
  input.name = inputName;
  input.value = attrs.value;
  if (attrs.attrs) {
    for (const [key, value] of Object.entries(attrs.attrs)) {
      input.setAttribute(key, value);
    }
  }
  configInputFn(input);

  const label = document.createElement("label");
  label.setAttribute("for", attrs.id);
  label.innerText = attrs.value;
  return [input, label];
}

function CreateCheckboxList(attrs, options) {
  const container = document.createElement("div");
  container.className = attrs.className || "";
  options.forEach((option) => {
    const [input, label] = CreateInputWithLabel(attrs.name, "checkbox", option);

    container.appendChild(input);
    container.appendChild(label);
  });
  return container;
}

function CreateRadioList(attrs, options, checkedFn = (option, index) => false) {
  const container = document.createElement("div");
  container.className = attrs.className || "";
  options.forEach((option, index) => {
    const [input, label] = CreateInputWithLabel(
      attrs.name,
      "radio",
      option,
      (x) => {
        if (checkedFn(option, index)) {
          x.checked = true;
        }
      }
    );

    container.appendChild(input);
    container.appendChild(label);
  });
  return container;
}
