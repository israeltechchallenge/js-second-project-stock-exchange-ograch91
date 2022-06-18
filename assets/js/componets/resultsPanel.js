class ResultsPanel {
  constructor(domContainer) {
    this.container = domContainer;
    this.generate();
  }

  generate() {
    this.resultsList = makeElement("div", { className: "results-list" });
    this.container.append(this.resultsList);
  }

  clearAll() {
    const removeItems = [...this.resultsList.children];
    removeItems.forEach((li) => li.remove());
  }

  async addAllRes(data) {
    let promAllLines = data.map(this.createResultLine);
    const createdLines = await Promise.all(promAllLines);
    this.resultsList.append(...createdLines);
  }

  async createResultLine(resultObj) {
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
  }
}
