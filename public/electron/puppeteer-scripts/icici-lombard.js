module.exports = async function (page, data, mainWindow) {
  console.log("HERE ICICI", Object.keys(data));
  // const fetch = require('node-fetch');
  // const _ = require("get-safe");

  // const timeout = 10000000;
  // page.setDefaultTimeout(timeout);
  // page.setDefaultNavigationTimeout(timeout);

  // function fetch_retry(url, options, n) {
  //   return new Promise(function (resolve, reject) {
  //     fetch(url, options).then(res => res.json()) // <--- Much cleaner!
  //       .catch(function (error) {
  //         if (n === 1) return reject(error);
  //         fetch_retry(url, options, n - 1)
  //           .then(resolve)
  //           .catch(reject);
  //       }).then(resolve);
  //   });
  // }

  // async function waitForRandom() {
  //   await page.waitForTimeout((Math.random() + 1) * 1000);
  // }

  // let location;

  // await fetch_retry(`https://api.postalpincode.in/pincode/${data["Zip Code"]}`, {}, 5).then(async function ([{ Status, PostOffice }]) { // Fetching district and police station data
  //   if (Status === "Success" && PostOffice[0]) {
  //     location = await _("0", PostOffice);
  //   }
  // });
  // const {
  //   iciciUsername,
  //   iciciPassword
  // } = dealerData;

  // try {
  //   if (iciciUsername && iciciPassword) {
  //     await page.waitForSelector("#login2_txtLoginId", { visible: true });
  //     await page.type("#login2_txtLoginId", iciciUsername);
  //     await page.waitForSelector("#login2_txtPassword", { visible: true });
  //     await page.type("#login2_txtPassword", iciciPassword);
  //     await page.select("#login2_ddlLandingPage", "1");
  //     await page.click("#login2_btnLogin");
  //   }

  //   mainWindow.webContents.send("update-progress-bar", ["20%", "insurance"]);
  //   await page.waitForSelector("input[value='Get Full Quote']", { visible: true });
  //   await page.click("input[value='Get Full Quote']");
  //   mainWindow.webContents.send("update-progress-bar", ["30%", "insurance"]);
  //   await waitForRandom();
  //   await page.waitForSelector("#TxtRegistrationNumber", { visible: true });
  //   await page.type("#TxtRegistrationNumber", "NEW");
  //   await page.type("#TxtRtoCity", location["Division"]);
  //   await page.waitForSelector("#divwidth > div", { visible: true });
  //   await page.click("#divwidth > div");
  //   await page.waitForSelector("#divwidth > div", { hidden: true });
  //   let actualDate = data["Actual Deliver date"].split(/[\/ \–\-]/);
  //   if (actualDate[2].length === 2) {
  //     actualDate[2] = `20${actualDate[2]}`;
  //   }
  //   actualDate = actualDate.join("/");
  //   await page.type("#TxtRegistrationDate", actualDate);
  //   await page.click(".robo-card-panel");
  //   const manufacturer = data["Two wheeler brand"].toUpperCase();
  //   const manufacturerValues = await page.$$eval("#DdlManufacture > option", options => options.map(option => ({
  //     value: option.value,
  //     name: option.textContent
  //   })));
  //   const manufacturerId = manufacturerValues.find(manufacturerDetails => manufacturerDetails.name.startsWith(manufacturer));

  //   await page.select("#DdlManufacture", manufacturerId.value);

  //   await page.waitForFunction("document.querySelectorAll('#DdlModel > option').length > 1");

  //   const model = modelData[data["Model Variant"]].iciciModelName;
  //   const modelVariants = await page.$$eval("#DdlModel > option", options => options.map(option => ({
  //     value: option.value,
  //     name: option.textContent
  //   })));
  //   const modelVariant = modelVariants.find(variants => variants.name.includes(model));

  //   await page.select("#DdlModel", modelVariant.value);
  //   await page.waitForFunction('!!document.querySelector("#txtPrice").value');
  //   await page.click("#lnkbtnIDVtoExShowConv");
  //   await page.waitForSelector("#txtRequiredIDV", { visible: true });
  //   await page.waitForSelector("#txtExShowroom", { visible: true });
  //   await page.$eval("#txtRequiredIDV", el => el.value = '');
  //   await page.type("#txtRequiredIDV", data["IDV"].toString());
  //   await page.click("#imgbtnCalculateIDVtoExShowConv");
  //   await page.waitForFunction('!!document.querySelector("#txtExShowroom").value');
  //   await page.click("#imgbtnSubmitIDVtoExShowConv");
  //   await page.waitForSelector("#pnlIDVtoExShowConv", { hidden: true });
  //   const state = location["State"].toUpperCase();
  //   const allStates = await page.$$eval("#ddToState > option", options => options.map(option => ({
  //     value: option.value,
  //     name: option.textContent
  //   })));
  //   const stateToChoose = allStates.find(currState => currState.name.includes(state));
  //   await page.select("#ddToState", stateToChoose.value);
  //   await page.select("#DdlCPATenure", "1");
  //   mainWindow.webContents.send("update-progress-bar", ["30%", "insurance"]);
  //   await page.click("label[for=RdbAdditionalCover_0]");
  //   await page.waitForSelector("#ddZeroDepValue", { visible: true });
  //   await page.select("#ddZeroDepValue", "Silver");
  //   await page.click("label[for=rdbAddDiscount_0]");
  //   await page.waitForSelector("#ddlTppdSumInsured", { visible: true });
  //   await page.select("#ddlTppdSumInsured", "1");
  //   await page.click("#BtnCalculatePremium");
  //   mainWindow.webContents.send("update-progress-bar", ["50%", "insurance"]);
  //   await page.waitForSelector("#TxtEngineNumber", { visible: true });
  //   await page.type("#TxtEngineNumber", data["Engine #"]);
  //   await page.type("#TxtChassisNumber", data["Frame #"]);
  //   if (data["Hypothecation"] !== "") {
  //     await page.click("label[for='rdbVehicleUnder_2']");
  //     await page.waitForSelector("#txtFinancierName", { visible: true });
  //     await page.type("#txtFinancierName", data["Hypothecation"]);
  //     await page.waitForSelector("#txtFinancierBranch", { visible: true });
  //     await page.type("#txtFinancierBranch", data["City"]);
  //   }
  //   await page.click("#ctrlCustomerAddress_btnCreateNew");
  //   mainWindow.webContents.send("update-progress-bar", ["60%", "insurance"]);
  //   const titleValue = data["Gender"] === "M" ? "1" : "0";
  //   await page.waitForSelector("#ctrlCustomerAddress_DdlCustTitle", { visible: true });
  //   await page.select("#ctrlCustomerAddress_DdlCustTitle", titleValue);
  //   await page.type("#ctrlCustomerAddress_TxtCustName", `${data["Customer First Name"]} ${data["Customer Last Name"]}`);
  //   await page.type("#ctrlCustomerAddress_TxtCustAddressLine1", data["Address Line 1"]);
  //   await page.type("#ctrlCustomerAddress_TxtCustAddressLine2", data["Address Line 2"]);
  //   await page.type("#ctrlCustomerAddress_TxtCustPincode", data["Zip Code"]);
  //   mainWindow.webContents.send("update-progress-bar", ["70%", "insurance"]);
  //   const dropDown = await page.waitForSelector("#ctrlCustomerAddress_AutoCompleteExtender1_completionListElem > div", { visible: true });
  //   await dropDown.click();
  //   await page.waitForSelector("#ctrlCustomerAddress_AutoCompleteExtender1_completionListElem > div", { hidden: true });
  //   await page.waitForFunction("!!document.querySelector('#ctrlCustomerAddress_TxtCustCity').value");
  //   mainWindow.webContents.send("update-progress-bar", ["80%", "insurance"]);
  //   await page.type("#ctrlCustomerAddress_TxtCustEmail", dealerData["policy-email"]);
  //   await page.type("#ctrlCustomerAddress_TxtCustMobile", data["Mobile Phone #"]);
  //   await waitForRandom();
  //   await page.waitForSelector("label[for='ctrlCustomerAddress_chkGSTDetails']", { visible: true });
  //   await page.click("label[for='ctrlCustomerAddress_chkGSTDetails']");
  //   await page.waitForSelector("#ctrlCustomerAddress_txtGSTIN", { visible: true });
  //   await page.type("#ctrlCustomerAddress_txtGSTIN", data["GST"]);
  //   mainWindow.webContents.send("update-progress-bar", ["90%", "insurance"]);
  //   await waitForRandom();
  //   await page.click("#btnCreateProposal");
  //   mainWindow.webContents.send("update-progress-bar", ["100%", "insurance"]);
  // } catch (err) {
  //   console.log(err);
  // }
};
