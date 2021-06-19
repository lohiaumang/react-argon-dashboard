module.exports = function(page, data, insuranceCompany, mainWindow) {
  const hdfcAutomation = require("./puppeteer-scripts/hdfc-ergo");
  const iciciAutomation = require("./puppeteer-scripts/icici-lombard");

  switch(insuranceCompany) {
    case "HDFC Ergo": {
      hdfcAutomation(page, data, mainWindow);
      
      break;
    }
    case "ICICI Lombard": {
      iciciAutomation(page, data, mainWindow);

      break;
    }
    default: {
      console.log("Automation file not found!");
    }
  }
}