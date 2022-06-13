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

function getDataFromServer(stockSymbol) {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${stockSymbol}&limit=10&exchange=NASDAQ`;
  fetch(searchUrl)
    .then((response) => {
      if (response.ok === true) response.json().then(handleResponse);
    })
    .finally(() => fillLoader(false));
  function handleResponse(dataFromServer) {
    dataFromServer.forEach(createResultLine);
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

  const link = makeElement("a", {
    className: "search-result-img",
    href: `./company.html?symbol=${resultObj.symbol}`,
    target: "_blank",
    innerText: `${resultObj.name} (${resultObj.symbol})`,
  });

  let percent = getPrecentInfo(profile.changesPercentage);

  const stockChange = makeElement("span", {
    className: `company-percentage ${percent.Css}`,
    innerText: `(${percent.Sign}${percent.text})`,
  });

  itemContainer.append(image, link, stockChange);
  resultsList.append(itemContainer);

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

const GetMarqueeData = async () => {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/`;
  let response = await fetch(searchUrl);
  if (!response.ok) {
    return console.warn("Bad response from server", response);
  }
  let data = await response.json();
  if (!data) {
    return console.warn("No data from server");
  }

  const marqueeContainer = makeElement("div");

  for (const element of data) {
    const symbolMarquee = makeElement("p", {
      className: "symbol-marquee",
      innerText: `${element.symbol} `,
    });
    const sign = getCssSign(element.changesPercentage);
    const symbolPrice = makeElement("span", {
      className: `symbol-price ${sign}`,
      innerText: `${element.price}`,
    });

    marqueeContainer.append(symbolMarquee, symbolPrice);
  }

  const domContainer = document.querySelector(".marquee-content");
  domContainer.innerHTML = "";

  domContainer.style = `animation-duration: ${0.8 * data.length}s ;`;
  domContainer.append(marqueeContainer);
};

// TODO: run this line from onload
GetMarqueeData();
