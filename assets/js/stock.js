// Elements
//todo: migrate to function created elements
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

// Functions
function makeElement(type, elementOptions) {
	const domElm = document.createElement(type);
	if (!elementOptions) return domElm;

  // update DOM elements with CSS class etc..
	// if (elementOptions.className) domElm.className = elementOptions.className;
	// if (elementOptions.innerText) domElm.innerText = elementOptions.innerText;
	// if (elementOptions.placeholder) domElm.placeholder = elementOptions.placeholder;

  //better way with assign function ref:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.assign(domElm, elementOptions);
	return domElm;
}

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

function appendResult(resultObj) {
	console.log(resultObj.symbol, resultObj.name);
	const item = document.createElement('li');
	item.className = 'result-item';
	item.innerText = `${resultObj.name} (${resultObj.symbol})`;
	resultsList.append(item);
}

//todo: make every relevant item as A tag

// Event listeners
searchButton.addEventListener('click', searchHandler);
//todo: add listener for enter key

// inputField.addEventListener();
