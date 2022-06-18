window.onload = async function () {
  // remove static html use js
  const marContainer = document.querySelector(".marquee-content");
  const marquee = new Marquee(marContainer);
  marquee.start();

  const resultsPanel = new ResultsPanel(resultsContainer);
  const search = new Search(formContainer, resultsPanel);
  createMain();
};

const mainContainer = makeElement("div", { className: "main-container" });
const formContainer = makeElement("div", { className: "form-container" });
const resultsContainer = makeElement("div", {
  className: "results-container",
});

function createMain() {
  // const mainContainer = makeElement("div", { className: "main-container" });
  // const formContainer = makeElement("div", { className: "form-container" });
  // const resultsContainer = makeElement("div", {
  //   className: "results-container",
  // });

  mainContainer.append(formContainer, resultsContainer);
  document.body.append(mainContainer);
}
