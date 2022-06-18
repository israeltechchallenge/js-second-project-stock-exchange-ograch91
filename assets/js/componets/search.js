let lastSearchQuery = "";

class Search {
  constructor(domContainer, resultsPanel) {
    this.container = domContainer;
    this.resultsPanel = resultsPanel;
    this.generate();
  }

  generate() {
    //creating elemnts
    this.searchButton = makeElement("button", {
      className: "search-button cssload-jumping",
      innerText: "Search",
    });
    this.inputField = makeElement("input", {
      className: "input-field",
      placeholder: "Search for company stock symbol",
    });

    this.container.append(this.inputField, this.searchButton);

    // Event listeners  --- https://stackoverflow.com/a/57963910
    this.searchButton.addEventListener("click", (e) => this.searchHandler(e));
    this.inputField.addEventListener("keydown", (e) => this.userEnterSearch(e));
  }

  fillLoader(isLoading) {
    const searchButton = this.searchButton;

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

  async searchHandler() {
    this.fillLoader(true);
    // get user input
    const input = this.inputField.value;

    this.resultsPanel.clearAll();

    // call server with input
    const data = await this.getDataFromServer(input);

    await this.resultsPanel.addAllRes(data);
    this.fillLoader(false);
    //todo: add input validation from user
  }

  userEnterSearch(event) {
    if (event.key === "Enter") {
      this.searchHandler();
    }
  }

  async getDataFromServer(stockSymbol) {
    const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${stockSymbol}&limit=10&exchange=NASDAQ`;
    try {
      let response = await fetch(searchUrl);
      let data = await response.json();
      if (!data || !Array.isArray(data)) {
        return console.warn("No data from server");
      }

      lastSearchQuery = stockSymbol;
      return data;
    } catch {
      console.error("Search went wrong");
    }
  }
}
