function getCompanyProfile(symbol) {
	// get symbol profile data
	const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
	fetch(searchUrl).then((response) => {
		if (response.ok === true) response.json().then(handleResponse);
	});

	function handleResponse(dataFromServer) {
		console.log(dataFromServer);
    // dataFromServer.description
    // dataFromServer.image
    // dataFromServer.price
    // dataFromServer.changesPercentage or dataFromServer.changes
    
	}
	// TODO: this function will get the symbol to request, fetch data from API, and call subsequent methods to show - image, title, descr...
}

function getStockPriceHistory(symbol) {
	// get symbol stock price history
	const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
	fetch(searchUrl).then((response) => {
		if (response.ok === true) response.json().then(handleResponse);
	});

	function handleResponse(dataFromServer) {
		console.log(dataFromServer);
	}
	// TODO: this method will fetch all / partial data from API, to be able to display GRAPH of stock history
}

function getSymbolFromQuery() {
	// extract value from query parameter
	const urlSearchParams = new URLSearchParams(window.location.search);
	//default fallback in case param is missing/empty
	const symbolValue = urlSearchParams.get('symbol') || 'AAPL';
	return symbolValue;
	// const params = Object.fromEntries(urlSearchParams.entries());
	// ref: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript#:~:text=%3B%20//%20%22some_value%22-,Update%3A%20June%2D2021,-For%20a%20specific
}
