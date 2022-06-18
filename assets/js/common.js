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

const getCompanyProfile = async (symbol) => {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
  let response = await fetch(searchUrl);
  if (!response.ok) {
    return console.warn("Bad response from server", response);
  }
  let data = await response.json();
  if (!data || !data.profile) {
    return console.warn("No data from server");
  }

  const profile = data.profile;
  return profile;
};

// todo: concider making a generic "GetJsonFromServer"
//       with data validation as callback.
//       put all API related code here / in another file

// consider making iterable class
const splitBySearch = (text, pattern) => {
  let pos = text.indexOf(pattern);
  if (pos == -1) {
    return; //"Not Found Result"
  }
  let end = pos + pattern.length;

  //todo: add case insensetive support
  //todo: add support for more than one occurance

  let before = text.substring(0, pos);
  let inside = text.substring(pos, end);
  let after = text.substring(end);

  return {
    split: [before, inside, after],
    pos: pos,
    origin: text,
  };
};
