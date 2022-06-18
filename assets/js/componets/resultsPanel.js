class ResultsPanel {
  constructor(domContainer) {
    this.container = domContainer;
    this.generate();
  }

  generate() {
    this.resultsList = makeElement('div', { className: 'results-list' });
    this.container.append(this.resultsList);
  }

  clearAll() {
    const removeItems = [...this.resultsList.children];
    removeItems.forEach(li => li.remove());
  }

  async addAllRes(data) {
    let promAllLines = data.map(this.createResultLine);
    const createdLines = await Promise.all(promAllLines);
    this.resultsList.append(...createdLines);
  }

  addNothingFound() {
    const itemContainer = makeElement('div', {
      className: 'result-item-container no-item',
    });

    const message = makeElement('div', {
      className: 'search-result-text',
      innerText: 'Apologies, no stock found 🤷',
    });

    const image = makeElement('img', {
      className: 'search-result-img',
      src: '/assets/img/thinking-emoji-trans.gif',
    });

    itemContainer.append(image, message);
    this.resultsList.append(itemContainer);
  }

  async createResultLine(resultObj) {
    const itemContainer = makeElement('div', {
      className: 'result-item-container',
    });

    const profile = await getCompanyProfile(resultObj.symbol);

    const image = makeElement('img', {
      className: 'search-result-img',
      src: profile.image,
    });

    fixMissingImage(image);

    let fullLinkText = `${resultObj.name} (${resultObj.symbol})`;
    let res = splitAllBySearch(fullLinkText, lastSearchQuery);

    let linkText = '';

    for (const found of res.hits) {
      const before = found.before;
      const inside = found.inside;

      // append/ add to existing string
      linkText += before + `<span class='searched-found'>` + inside + `</span>`;
    }

    linkText += res.after;

    const link = makeElement('a', {
      className: 'search-result-text',
      href: `./company.html?symbol=${resultObj.symbol}`,
      target: '_blank',
      innerHTML: linkText,
    });

    let percent = getPrecentInfo(profile.changesPercentage);

    const stockChange = makeElement('span', {
      className: `company-percentage ${percent.Css}`,
      innerText: `(${percent.Sign}${percent.text})`,
    });

    itemContainer.append(image, link, stockChange);
    //   resultsList.append(itemContainer);

    return itemContainer;
  }
}
