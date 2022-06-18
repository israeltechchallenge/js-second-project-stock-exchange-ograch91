class Marquee {
  constructor(domContainer) {
    this.container = domContainer;
  }

  start() {
    this.GetMarqueeData();
  }

  async GetMarqueeData() {
    const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/`;
    const data = await getJsonFromServer(searchUrl);
    if (!data) {
      return console.warn('No data from server');
    }
    this.printMarquee(data);
  }

  printMarquee(data) {
    const marqueeContainer = makeElement('div');

    for (const element of data) {
      const symbolMarquee = makeElement('p', {
        className: 'symbol-marquee',
        innerHTML: `${element.symbol} &nbsp;`,
      });
      const sign = getCssSign(element.changesPercentage);
      const symbolPrice = makeElement('span', {
        className: `symbol-price ${sign}`,
        innerText: `${element.price}`,
      });

      symbolMarquee.append(symbolPrice);
      marqueeContainer.append(symbolMarquee);
    }

    const domContainer = this.container;

    domContainer.innerHTML = '';

    domContainer.style = `animation-duration: ${0.8 * data.length}s ;`;
    domContainer.append(marqueeContainer);
  }
}
