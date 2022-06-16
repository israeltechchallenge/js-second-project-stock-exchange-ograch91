// Elements
const mainContainer = makeElement("div", { className: "main-container" });
const formContainer = makeElement("div", { className: "form-container" });
const resultsContainer = makeElement("div", { className: "results-container" });
const searchButton = makeElement("button", {
  className: "search-button cssload-jumping",
  innerText: "Search",
});
const inputField = makeElement("input", {
  className: "input-field",
  placeholder: "Search for company stock symbol",
});
const resultsList = makeElement("div", { className: "results-list" });

// Appends
formContainer.append(inputField, searchButton);
resultsContainer.append(resultsList);
mainContainer.append(formContainer, resultsContainer);
document.body.append(mainContainer);

// // Functions
function fillLoader(isLoading) {
  if (isLoading) {
    searchButton.disabled = true;
    searchButton.innerHTML = ""; //clear search text
    for (let i = 0; i < 5; i++) {
      const loaderDots = document.createElement("span");
      searchButton.append(loaderDots);
    }
  } else {
    searchButton.innerHTML = "Search";
    searchButton.disabled = false;
  }
}

let lastSearchQuery = "";

async function getDataFromServer(stockSymbol) {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${stockSymbol}&limit=10&exchange=NASDAQ`;
  try {
    let response = await fetch(searchUrl);
    let data = await response.json();
    if (!data || !Array.isArray(data)) {
      return console.warn("No data from server");
    }

    lastSearchQuery = stockSymbol;
    let promAllLines = data.map(createResultLine);
    const createdLines = await Promise.all(promAllLines);
    resultsList.append(...createdLines);
  } finally {
    fillLoader(false);
  }
}

function searchHandler() {
  fillLoader(true);
  // get user input
  const input = inputField.value;
  const removeItems = [...resultsList.children];
  removeItems.forEach((li) => li.remove());

  // call server with input
  getDataFromServer(input);

  //todo: add input validation from user
}

function userEnterSearch(event) {
  if (event.key === "Enter") {
    searchHandler();
  }
}

const createResultLine = async (resultObj) => {
  const itemContainer = makeElement("div", {
    className: "result-item-container",
  });

  const profile = await getCompanyProfile(resultObj.symbol);

  const image = makeElement("img", {
    className: "search-result-img",
    src: profile.image,
  });

  let linkText = `${resultObj.name} (${resultObj.symbol})`;
  let res = splitBySearch(linkText, lastSearchQuery);

  if (res) {
    linkText =
      res.split[0] +
      `<span class='searched-found'>` +
      res.split[1] +
      `</span>` +
      res.split[2];
  }

  const link = makeElement("a", {
    className: "search-result-img",
    href: `./company.html?symbol=${resultObj.symbol}`,
    target: "_blank",
    innerHTML: linkText,
  });

  let percent = getPrecentInfo(profile.changesPercentage);

  const stockChange = makeElement("span", {
    className: `company-percentage ${percent.Css}`,
    innerText: `(${percent.Sign}${percent.text})`,
  });

  itemContainer.append(image, link, stockChange);
  //   resultsList.append(itemContainer);

  return itemContainer;
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

// Event listeners
searchButton.addEventListener("click", searchHandler);
inputField.addEventListener("keydown", userEnterSearch);

// TODO: add all "html init" methods to an "onLoad" method
// https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#examples




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
