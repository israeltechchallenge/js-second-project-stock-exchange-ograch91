// Elemnts
const globalContainer = makeElement('div', { className: 'global-container' });
const profileContainer = makeElement('div', { className: 'profile-container' });
const chartContainer = makeElement('div', { className: 'chart-container' });

globalContainer.append(profileContainer, chartContainer);
document.body.append(globalContainer);

const getCompanyProfile = async (symbol) => {
	const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
	let response = await fetch(searchUrl);
	if (!response.ok) {
		return console.warn('Bad response from server', response);
	}
	let data = await response.json();
	if (!data || !data.profile) {
		return console.warn('No data from server');
	}
	console.log(data);
	const profile = data.profile;
	createProfileElements(profile);
};

function createProfileElements(compProfile) {
	const companyImg = makeElement('img', {
		className: 'company-img',
		src: compProfile.image,
		alt: 'Company Image',
	});

	let companyNameText;
	if (compProfile.industry)
		companyNameText = `${compProfile.companyName} (${compProfile.industry})`;
	else companyNameText = `${compProfile.companyName}`;

	const companyNameIndustry = makeElement('h1', {
		className: 'company-name-industry',
		innerText: companyNameText,
	});

	let currency;
	if (compProfile.currency == 'USD') currency = '$';
	else currency = compProfile.currency;

	const companyPrice = makeElement('p', {
		className: 'company-price',
		innerText: `Stock Price: ${currency}${compProfile.price} `,
	});

	let percentNum = compProfile.changesPercentage;
	let percentText = parseFloat(percentNum).toFixed(2) + '%';
	let percentSign, percentCss;
	if (percentNum >= 0) {
		percentSign = '+';
		percentCss = 'positive';
	}
	else{
		percentSign = '';
		percentCss = 'negative';

	}

	const companyPercentage = makeElement('span', {
		className: `company-percentage ${percentCss}`,
		innerText: `(${percentSign}${percentText})`,
	});

	const companyDescription = makeElement('p', {
		className: 'company-description',
		innerText: compProfile.description,
	});

	companyPrice.append(companyPercentage);

	profileContainer.append(
		companyImg,
		companyNameIndustry,
		companyPrice,
		companyDescription
	);
}

const getStockPriceHistory = async (symbol) => {
	const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=60`;
	let response = await fetch(searchUrl);
	if (!response.ok) {
		return console.warn('Bad response from server', response);
	}
	let data = await response.json();
	printStockHistory(data);
};

function printStockHistory(dataFromServer) {
	if (!dataFromServer || !dataFromServer.historical) {
		return console.warn('No data from server');
	}

	const historical = dataFromServer.historical;
	closePrice = historical.map((x) => x.close);
	closeDate = historical.map((x) => x.date);
	// createProfileElements(profile)
	const chartConfig = {
		type: 'line',
		data: {
			labels: closeDate,
			datasets: [
				{
					fill: {
						target: 'origin',
					},
					label: 'Stock Price History',
					backgroundColor: '#00c9b7',
					borderColor: '#00c9b7',
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

	const chartArea = makeElement('canvas');
	chartContainer.append(chartArea);
	const myChart = new Chart(chartArea, chartConfig);
}

function getSymbolFromQuery() {
	// extract value from query parameter
	const urlSearchParams = new URLSearchParams(window.location.search);
	//default fallback in case param is missing/empty
	const symbolValue = urlSearchParams.get('symbol') || 'AAPL';
	return symbolValue;
}

window.onload = function () {
	const symbolParam = getSymbolFromQuery();
	const profile = getCompanyProfile(symbolParam);
	const stock = getStockPriceHistory(symbolParam);
	Promise.all([profile, stock]).then(() => {
		document.querySelector('.cssload-jumping').classList.add('hidden');
	});
};
