// Elemnts
const globalContainer = makeElement("div", { className: "global-container" });
const profileContainer = makeElement("div", { className: "profile-container" });
const chartContainer = makeElement("div", { className: "chart-container" });

globalContainer.append(profileContainer, chartContainer);
document.body.append(globalContainer);

function createProfileElements(compProfile) {
  const titleContainer = makeElement("div", {
    className: "title-container",
  });

  const infoContainer = makeElement("div", {
    className: "info-container",
  });

  const companyImg = makeElement("img", {
    className: "company-img",
    src: compProfile.image,
    alt: "Company Image",
  });

  let companyNameText;
  if (compProfile.industry)
    companyNameText = `${compProfile.companyName} (${compProfile.industry})`;
  else companyNameText = `${compProfile.companyName}`;

  const companyNameIndustry = makeElement("h1", {
    className: "company-name-industry",
    innerText: companyNameText,
  });

  let currency;
  if (compProfile.currency == "USD") currency = "$";
  else currency = compProfile.currency;

  const companyPrice = makeElement("p", {
    className: "company-price",
    innerText: `Stock Price: ${currency}${compProfile.price} `,
  });

  let percent = getPrecentInfo(compProfile.changesPercentage);

  const companyPercentage = makeElement("span", {
    className: `company-percentage ${percent.Css}`,
    innerText: `(${percent.Sign}${percent.text})`,
  });

  const companyDescription = makeElement("p", {
    className: "company-description",
    innerText: compProfile.description,
  });

  companyPrice.append(companyPercentage);
  infoContainer.append(companyNameIndustry, companyPrice);
  titleContainer.append(infoContainer, companyImg);
  profileContainer.append(titleContainer, companyDescription);
}

const getStockPriceHistory = async (symbol) => {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=60`;
  let response = await fetch(searchUrl);
  if (!response.ok) {
    return console.warn("Bad response from server", response);
  }
  let data = await response.json();
  printStockHistory(data);
};

function printStockHistory(dataFromServer) {
  if (!dataFromServer || !dataFromServer.historical) {
    return console.warn("No data from server");
  }

  const historical = dataFromServer.historical.reverse();
  closePrice = historical.map((x) => x.close);
  closeDate = historical.map((x) => x.date);

  const chartConfig = {
    type: "line",
    data: {
      labels: closeDate,
      datasets: [
        {
          fill: {
            target: "origin",
          },
          label: "Stock Price History",
          backgroundColor: "#00c9b7",
          borderColor: "#00c9b7",
          data: closePrice,
        },
      ],
    },
    options: {
      // starting point of stock price
      // scales: {
      // 	y: {
      // 		type: 'linear',
      // 		// min: 0,
      // 	},
      // },
    },
  };

  const chartArea = makeElement("canvas");
  chartContainer.append(chartArea);
  const myChart = new Chart(chartArea, chartConfig);
}

function getSymbolFromQuery() {
  // extract value from query parameter
  const urlSearchParams = new URLSearchParams(window.location.search);
  //default fallback in case param is missing/empty
  const symbolValue = urlSearchParams.get("symbol") || "AAPL";
  return symbolValue;
}

window.onload = async function () {
  const symbolParam = getSymbolFromQuery();
  const profile = await getCompanyProfile(symbolParam);
  createProfileElements(profile);
  const stock = getStockPriceHistory(symbolParam);
  Promise.all([profile, stock]).then(() => {
    document.querySelector(".cssload-jumping").classList.add("hidden");
  });
};
