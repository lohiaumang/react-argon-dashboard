module.exports = async function (page, data, mainWindow, insuranceWindow) {
  const psl = require("puppeteer-salesforce-library");
  const logout = psl.logout;
  // const fetch = require('node-fetch');
  // const _ = require("get-safe");

  // const nomineeRelation = {
  //   "Aunty": "Other",
  //   "Brother": "Sibling",
  //   "Brother in law": "Other",
  //   "Daughter": "Other",
  //   "Daughter in law": "Other",
  //   "Employee": "Other",
  //   "Employee Son": "Other",
  //   "Employee Spouse": "Other",
  //   "Father": "Father",
  //   "Father in law": "Other",
  //   "Grand Daughter": "Other",
  //   "Grand Father": "Other",
  //   "Grand Mother": "Other",
  //   "Grand Son": "Other",
  //   "Maternal Aunt": "Other",
  //   "Maternal Uncle": "Other",
  //   "Mother": "Mother",
  //   "Mother in law": "Other",
  //   "Nephew": "Other",
  //   "Niece": "Other",
  //   "Paternal Aunt": "Other",
  //   "Paternal Uncle": "Other",
  //   "Self": "Other",
  //   "Sister": "Sibling",
  //   "Sister in law": "Other",
  //   "Son": "Son",
  //   "Son in law": "Other",
  //   "Spouse": "Spouse",
  //   "Uncle": "Other",
  //   "Other": "Other"
  // };

  const timeout = 10000000;
  await page.setDefaultTimeout(timeout);
  await page.setDefaultNavigationTimeout(timeout);

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

  async function waitForRandom() {
    await page.waitForTimeout((Math.random() + 1) * 1000);
  }

  const {
    credentials: { username, password },
  } = data;
  const automate = async function () {
    let done = false;

    //  insuranceWindow.webContents.once("close", async (event) => {
    insuranceWindow.on("close", async (e) => {
      // const choice = require("electron").dialog.showMessageBoxSync(this, {
      //   type: "question",
      //   buttons: ["Yes", "No"],
      //   title: "Confirm",
      //   message: "Are you sure you want to quit?",
      // });
      //  if (choice === 1) {
      e.preventDefault();
      await page.waitForSelector(".head-right > li > a[onclick='LogOut();']");
      await page.click(".head-right > li > a[onclick='LogOut();']");

      insuranceWindow.destroy();

      mainWindow.webContents.send("fromMain", {
        type: done ? "INSURANCE_CREATED" : "INVOICE_CREATE",
        data: data.id,
      });
    });

    try {
      if (username && password) {
        await page.waitForSelector("#UserName", { visible: true });
        await waitForRandom();
        await page.type("#UserName", username);
        await page.waitForSelector("#Password", { visible: true });
        await page.type("#Password", password);
        await page.waitForSelector("button[type='submit']", { visible: true });
        await page.click("button[type='submit']");
        await page.waitForResponse(
          "https://pie.hdfcergo.com/en-US/Login/AuthenticateUser"
        );
        await waitForRandom();
        await page.waitForSelector("h2.ng-binding");
        const headerText = await page.$eval(
          "h2.ng-binding",
          (el) => el.textContent
        );
        if (headerText === "Warning") {
          await page.waitForSelector(
            ".button-footer.text-center .btn.btn-primary[ng-click]",
            { visible: true }
          );
          await page.click(
            ".button-footer.text-center .btn.btn-primary[ng-click]"
          );
          await page.waitForSelector("#Password", { visible: true });
          await page.type("#Password", password);
          await page.waitForSelector("button[type='submit']", {
            visible: true,
          });
          await page.click("button[type='submit']");
          await waitForRandom();
        }
      }
      console.log("step 1");
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      await page.waitForSelector(
        "div[data-ng-if='loading'] > .LoadingModel:not([style*='display: none'])",
        {
          hidden: true,
        }
      );
      await page.waitForSelector("div[ng-show='1 == 1'] a.tw-link", {
        visible: true,
      });
      await page.click("div[ng-show='1 == 1'] a.tw-link");
      console.log("step 2");
      //  mainWindow.webContents.send("update-progress-bar", ["20%", "insurance"]);
      await page.waitForSelector(
        ".btn.btn-primary[ng-click='helpers.GoToUrl(TWURL)']",
        { visible: true }
      );
      await page.click(".btn.btn-primary[ng-click='helpers.GoToUrl(TWURL)']");
      // //   mainWindow.webContents.send("update-progress-bar", ["30%", "insurance"]);
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      await waitForRandom();
      await page.waitForSelector("#option2", { visible: true });
      await page.click("#option2");
      await waitForRandom();
      await page.waitForSelector("#ManufacturerName", { visible: true });
      await page.type("#ManufacturerName", "HONDA.");
      await waitForRandom();
      await page.waitForSelector("li > a[title='HONDA.']", { visible: true });
      await page.click("li > a[title='HONDA.']");
      await waitForRandom();
      await page.waitForSelector("input[name='ModelName']", { visible: true });

      await page.type(
        "input[name='ModelName']",
        data.insuranceDetails.modelName.split(" ")[0]
      );
      await waitForRandom();
      await page.waitForSelector(
        `li > a[title='${data.insuranceDetails.modelName}']`,
        {
          visible: true,
        }
      );
      await page.click(`li > a[title='${data.insuranceDetails.modelName}']`);

      await page.waitForSelector("input[name='RtoLocation']", {
        visible: true,
      });
      await page.type("input[name='RtoLocation']", data.customerInfo.currCity);
      await waitForRandom();
      await page.waitForSelector("input[name='RtoLocation']+ul > li > a", {
        visible: true,
      });
      await page.click("input[name='RtoLocation']+ul > li > a");

      await waitForRandom();
      let deliveryDate = new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/");
      await page.type("#Risk1", deliveryDate);
      await waitForRandom();
      await page.click("select[name='YearOfManufacturer']");
      await page.select(
        "select[name='YearOfManufacturer']",
        new Date().getFullYear().toString()
      );
      await page.click("#IDV_SumInsured");
      await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.waitForSelector("#IDV_SumInsured");
      await page.$eval("#IDV_SumInsured", (el) => (el.value = ""));

      const idv = Math.round(new Number(data.priceDetails.price) * 0.95);
      await page.type("#IDV_SumInsured", idv.toString());

      await waitForRandom();
      await page.waitForSelector("input[name='EngineNumber']");
      await page.type(
        "input[name='EngineNumber']",
        data.vehicleInfo.engineNumber
      );
      await waitForRandom();
      await page.waitForSelector("input[name='ChassisNumber']");
      await page.type(
        "input[name='ChassisNumber']",
        data.vehicleInfo.frameNumber
      );
console.log("step 3");
      await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["40%", "insurance"]);
      await page.waitForSelector("#AddOnEdit");
      console.log("step 4");
      await page.click("#AddOnEdit",{visible:true});
      console.log("step 5");
      await waitForRandom();
      await page.waitForSelector(
        "#C_ZeroDep_1"
      );
      console.log("step 6");
      await page.$$eval(
        "div[ng-switch-when='Vehicle Base Value - Zero Depreciation - Claim'] #C_ZeroDep_1",
        (buttons) =>
          buttons.map((button) => {
            if (
              window.getComputedStyle(button).getPropertyValue("display") !==
                "none" &&
              button.offsetHeight
            ) {
              button.click();
            }
          })
      );
     
      await waitForRandom();
      await page.waitForSelector(
        "div[ng-switch-when='Vehicle Base Value - Zero Depreciation - Claim'] #ZD_Information2",
        { visible: true }
      );
      await page.type(
        "div[ng-switch-when='Vehicle Base Value - Zero Depreciation - Claim'] #ZD_Information2",
        data.insuranceDetails.userRate
      );
      await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["50%", "insurance"]);
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.click("#DiscountEdit");
      await waitForRandom();
      await page.waitForSelector("label[uib-btn-radio='6000']", {
        visible: true,
      });
      await page.click("label[uib-btn-radio='6000']");
      await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.click("#PersonalEdit");
      await page.waitForSelector("#CustomerName", { visible: true });
      await page.type("#CustomerName", data.name);
      await page.type("#CustomerEmailMask", "Cbr250r9999@gmail.com");
      await page.type("#CustomerMobileMask", data.customerInfo.phoneNo);
      await waitForRandom();
      await page.waitForSelector(
        "form[name='TwoWheelerForm'] > .text-center > button",
        { visible: true }
      );
      await page.click("form[name='TwoWheelerForm'] > .text-center > button");
      await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await waitForRandom();
      await page.waitForSelector("h5[data-title='Total Premium Amount']", {
        visible: true,
      });
      await page.waitForSelector(
        "form[name='TwoWheelerForm'] > .text-right > button.btn-submit",
        { visible: true }
      );
      await page.click(
        "form[name='TwoWheelerForm'] > .text-right > button.btn-submit"
      );
      // mainWindow.webContents.send("update-progress-bar", ["60%", "insurance"]);
      await waitForRandom();
      await page.waitForSelector(
        "div[ng-show='showSuccessSection'] button:nth-of-type(2)",
        { visible: true }
      );
      await page.click(
        "div[ng-show='showSuccessSection'] button:nth-of-type(2)"
      );
      await waitForRandom();
      await page.waitForSelector(
        "div[ng-show='AlertProceedToBuy'] button:nth-of-type(1)",
        { visible: true }
      );
      await page.click(
        "div[ng-show='AlertProceedToBuy'] button:nth-of-type(1)"
      );
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.waitForSelector(".section-detail b", { visible: true });
      await page.waitForFunction(
        'document.querySelector(".section-detail b").textContent.length'
      );
      await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["70%", "insurance"]);

      // const genderValue = data["Gender"] === "M" ? "MALE" : "FEMALE";
      const salutationValue =
        data.customerInfo.gender.toUpperCase() === "MALE" ? "MR" : "MRS";
      await page.select("#Gender", data.customerInfo.gender.toUpperCase());
      await waitForRandom();
      await page.select("#salutation", salutationValue);
      await waitForRandom();
      await page.type("input[name='Firstname']", data.customerInfo.firstName);
      await waitForRandom();
      await page.type("input[name='Lastname']", data.customerInfo.lastName);
      await waitForRandom();
      await page.type("#flatNo", data.customerInfo.currLineOne);
      await waitForRandom();
      await page.waitForSelector("#CurAddress23");
      await waitForRandom();
      await page.type("#CurAddress23", data.customerInfo.currLineTwo);
      console.log("step 7");
      await waitForRandom();
      await page.waitForSelector("input[name='CurPincode']~span>a");
      await waitForRandom();
      await page.click("input[name='CurPincode']~span>a");
      await waitForRandom();
      console.log("step 8");
      await page.waitForSelector("input[name='PinCode']");
      console.log("step 9");
      await page.type("input[name='PinCode']", data.customerInfo.currPostal);
      console.log("step 10");
      await waitForRandom();
      console.log("step 11");
      await page.waitForSelector("#searchCityStatePin a:nth-of-type(1)",{visible:true});
      console.log("step 12");
      await waitForRandom();
      await page.click("#searchCityStatePin a:nth-of-type(1)");
      console.log("step 13");
      await waitForRandom();
      console.log("step 14");
      await page.waitForSelector(
        "#searchCityStatePin #no-more-tables a.ng-binding"
      );
      console.log("step 15");
      await page.click("#searchCityStatePin #no-more-tables a.ng-binding");
      await waitForRandom();
      // mainWindow.webContents.send("update-progress-bar", ["80%", "insurance"]);

      // Enter hypothecation details
      if (data.additionalInfo.hasOwnProperty("financier")) {
        await page.click("#RiskEdit");
        await waitForRandom();
        await page.waitForSelector(
          "label[ng-change='SetFinancierDetailBanca();LosAndLgCodeValidation()']",
          { visible: true }
        );
        await page.click(
          "label[ng-change='SetFinancierDetailBanca();LosAndLgCodeValidation()']"
        );
        await waitForRandom();
        await page.waitForSelector("#FinancierName", { visible: true });
        await page.type("#FinancierName", data.additionalInfo.financier);
        await waitForRandom();
        await page.waitForSelector(
          `a[title="${data.additionalInfo.financier}"]`,
          { visible: true }
        );
        await page.click(`a[title="${data.additionalInfo.financier}"]`);
        await waitForRandom();
        await page.select("#AgreementType", "string:Hypothecation");
        await waitForRandom();
        await page.type("#FinancierBranchCode", data.customerInfo.currCity);
        await waitForRandom();
      }
      //   mainWindow.webContents.send("update-progress-bar", ["90%", "insurance"]);

      // Enter Nominee Information
      await page.click("#CoverEdit");
      await waitForRandom();
      await page.select("#ddlRelationship", "string:Other");
      await waitForRandom();
      await page.type("input[name='Information2']", data.customerInfo.swdo);
      await waitForRandom();
      await page.type("input[name='Information3']", "65");
      await waitForRandom();
      await page.waitForSelector("form[name='TwoWheelerForm'] > .text-right > button.btn-submit");
      await page.click("form[name='TwoWheelerForm'] > .text-right > button.btn-submit");
      // mainWindow.webContents.send("update-progress-bar", ["100%", "insurance"]);
    
      done = true;
      console.log(done);
    } catch (err) {
      // await page.click(".head-right > li > a[onclick='LogOut();']");
      // console.log("Error logout");
      console.log(err);
    }
  };
  automate();
};
