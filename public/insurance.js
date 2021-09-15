module.exports = function (page, data, insuranceCompany, mainWindow, insuranceWindow, systemConfig) {
  const hdfcAutomation = require("./electron/puppeteer-scripts/hdfc-ergo");
  const iciciAutomation = require("./electron/puppeteer-scripts/icici-lombard");

  switch (insuranceCompany) {
    case "HDFC": {
      hdfcAutomation(page, data, mainWindow, insuranceWindow, systemConfig);

      break;
    }
    case "ICICI": {
      iciciAutomation(page, data, mainWindow, insuranceWindow);

      break;
    }
    default: {
      console.log("Automation file not found!");
    }
  }
};
