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

const getPrecentInfo = profileNum => {
  let percent = {};
  percent.num = profileNum; //;
  percent.text = parseFloat(percent.num).toFixed(2) + '%';
  percent.Sign;
  percent.Css;
  if (percent.num >= 0) {
    percent.Sign = '+';
    percent.Css = 'positive';
  } else {
    percent.Sign = '';
    percent.Css = 'negative';
  }
  return percent;
};

const getCssSign = num => {
  let sign;
  if (num >= 0) {
    sign = 'positive';
  } else {
    sign = 'negative';
  }
  return sign;
};

const getCompanyProfile = async symbol => {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
  const data = await getJsonFromServer(searchUrl);
  if (!data || !data.profile) {
    return console.warn("Expected data 'data.profile' was not found");
  }
  const profile = data.profile;
  return profile;
};

async function getJsonFromServer(apiUrl) {
  let response = await fetch(apiUrl);
  if (!response.ok) {
    return console.warn('Bad response from server', response);
  }
  let data = await response.json();
  if (!data) {
    return console.warn('No data from server');
  }
  return data;
}

// consider making iterable class
const splitAllBySearch = (text, pattern) => {
  const regex = new RegExp(pattern, 'ig');
  const matches = text.matchAll(regex);

  const allMatched = [];
  let endOfPrev = 0;

  for (const hit of matches) {
    let pos = hit.index;
    let end = pos + pattern.length;

    let before = text.substring(endOfPrev, pos);
    let inside = hit[0]; // using what regex already found

    allMatched.push({ before, inside, pos });
    endOfPrev = end;
  }

  let after = text.substring(endOfPrev);

  // if (!matches) {
  //   return 'Not Found Result';
  // }
  // const firstMatch = matches[0];

  return {
    hits: allMatched,
    after,
    text,
  };
};

function fixMissingImage(domImage) {
  domImage.addEventListener('error', () => {
    domImage.src = '/assets/img/unknowncompany.png';
    return true;
  });
}
