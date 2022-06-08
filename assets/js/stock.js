// Elements
const mainContainer = makeElement('div', { className: 'main-container' });
const formContainer = makeElement('div', { className: 'form-container' });
const resultsContainer = makeElement('div', { className: 'results-container' });
const searchButton = makeElement('button', {
	className: 'search-button cssload-jumping',
	innerText: 'Search',
});
const inputField = makeElement('input', {
	className: 'input-field',
	placeholder: 'Search for company stock symbol',
});
const resultsList = makeElement('ul', { className: 'results-list' });

// Appends
formContainer.append(inputField, searchButton);
resultsContainer.append(resultsList);
mainContainer.append(formContainer, resultsContainer);
document.body.append(mainContainer);

// // Functions
function fillLoader(isLoading) {
	if (isLoading) {
		searchButton.disabled = true;
		searchButton.innerHTML = ''; //clear search text
		for (let i = 0; i < 5; i++) {
			const loaderDots = document.createElement('span');
			searchButton.append(loaderDots);
		}
	} else {
		searchButton.innerHTML = 'Search';
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
		dataFromServer.forEach(appendResult);
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
	if (event.key === 'Enter') {
		searchHandler();
	}
}

function appendResult(resultObj) {
	const item = document.createElement('li');
	item.className = 'result-item';
	item.innerHTML = `<a href='./company.html?symbol=${resultObj.symbol}' target="_blank">${resultObj.name} (${resultObj.symbol})</a>`;
	resultsList.append(item);
}

// Event listeners
searchButton.addEventListener('click', searchHandler);
inputField.addEventListener('keydown', userEnterSearch);

// TODO: add all "html init" methods to an "onLoad" method
// https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#examples
