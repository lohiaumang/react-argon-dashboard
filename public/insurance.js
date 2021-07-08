module.exports = function (page, data, insuranceCompany, mainWindow) {
  const hdfcAutomation = require("./electron/puppeteer-scripts/hdfc-ergo");
  const iciciAutomation = require("./electron/puppeteer-scripts/icici-lombard");

  switch (insuranceCompany) {
    case "HDFC": {
      hdfcAutomation(page, data, mainWindow);

      break;
    }
    case "ICICI": {
      iciciAutomation(page, data, mainWindow);

      break;
    }
    default: {
      console.log("Automation file not found!");
    }
  }
};
