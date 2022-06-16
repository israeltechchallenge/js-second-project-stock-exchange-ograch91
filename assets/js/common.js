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

const getPrecentInfo = (profileNum) => {
  let percent = {};
  percent.num = profileNum; //;
  percent.text = parseFloat(percent.num).toFixed(2) + "%";
  percent.Sign;
  percent.Css;
  if (percent.num >= 0) {
    percent.Sign = "+";
    percent.Css = "positive";
  } else {
    percent.Sign = "";
    percent.Css = "negative";
  }
  return percent;
};

const getCssSign = (num) => {
  let sign;
  if (num >= 0) {
    sign = "positive";
  } else {
    sign = "negative";
  }
  return sign;
};
