
// TODO: code / methods which belong in all files go here
// Elements



// Functions
function makeElement(type, elementOptions) {   
	const domElm = document.createElement(type);
	if (!elementOptions) return domElm;

  // update DOM elements with CSS class etc..
	// if (elementOptions.className) domElm.className = elementOptions.className;
	// if (elementOptions.innerText) domElm.innerText = elementOptions.innerText;
	// if (elementOptions.placeholder) domElm.placeholder = elementOptions.placeholder;

  //better way with assign function ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.assign(domElm, elementOptions);
	return domElm;
}