module.exports = async function (page, data, mainWindow, insuranceWindow, systemConfig) {
  // const psl = require("puppeteer-salesforce-library");
  // const logout = psl.logout;
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

    // insuranceWindow.on("close", async (e) => {
    //   e.preventDefault();

    //   let url = "";
    //   const loginUrl = "https://pie.hdfcergo.com//Login/";

    //   try {
    //     url = (await page.evaluate(() => window.location.href)) || "";
    //   } catch (err) {
    //     console.log("Unable to get current url: ", err);
    //   }

    //   if (url && !url.startsWith(loginUrl)) {
    //     try {
    //       await page.waitForSelector(
    //         ".head-right > li > a[onclick='LogOut();']"
    //       );
    //       await page.click(".head-right > li > a[onclick='LogOut();']");
    //     } catch (err) {
    //       console.log("Unable to log out: ", err);
    //     }
    //   }

    //   if (!url.startsWith(loginUrl)) {
    //     await page.waitForSelector(".head-right > li > a[onclick='LogOut();']");
    //     await page.click(".head-right > li > a[onclick='LogOut();']");
    //     insuranceWindow.destroy();
    //   } else {
    //     insuranceWindow.destroy();
    //   }

    //   mainWindow.webContents.send("fromMain", {
    //     type: done ? "INSURANCE_CREATED" : "DISABLE_LOADER",
    //     data: data.id,
    //   });
    // });

    console.log(systemConfig, "hdfc sys");

    let timeout = systemConfig.hdfcTimeOut;
    console.log(timeout, "hdfc sys1");

    function waitForNetworkIdle(page, tOut, maxInflightRequests = 0) {
      page.on("request", onRequestStarted);
      page.on("requestfinished", onRequestFinished);
      page.on("requestfailed", onRequestFinished);

      let inflight = 0;
      let fulfill;
      let promise = new Promise((x) => (fulfill = x));
      let timeoutId = setTimeout(onTimeoutDone, tOut);
      return promise;

      function onTimeoutDone() {
        page.removeListener("request", onRequestStarted);
        page.removeListener("requestfinished", onRequestFinished);
        page.removeListener("requestfailed", onRequestFinished);
        fulfill();
      }

      function onRequestStarted() {
        ++inflight;
        if (inflight > maxInflightRequests) clearTimeout(timeoutId);
      }

      function onRequestFinished() {
        if (inflight === 0) {
          return;
        }
        --inflight;
        if (inflight === maxInflightRequests)
          timeoutId = setTimeout(onTimeoutDone, tOut);
      }
    }

    insuranceWindow.on("close", async (e) => {
      e.preventDefault();

      let url = "";
      const loginUrl = "https://pie.hdfcergo.com//Login/";

      try {
        url = (await page.evaluate(() => window.location.href)) || "";
      } catch (err) {
        console.log("Unable to get current url: ", err);
      }

      if (url && !url.startsWith(loginUrl)) {
        try {
          await page.waitForSelector(
            ".head-right > li > a[onclick='LogOut();']"
          );
          await page.click(".head-right > li > a[onclick='LogOut();']");
        } catch (err) {
          console.log("Unable to log out: ", err);
        }
      }

      insuranceWindow.destroy();

      mainWindow.webContents.send("fromMain", {
        type: done ? "INSURANCE_CREATED" : "DISABLE_LOADER",
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
        //      await waitForRandom();
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
          //       await waitForRandom();
        }
      }

      // This should wait till comtent is loaded on the page
      console.log("step 1");
      // await waitForNetworkIdle(page, 500, 0);
      // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      // This should wait till loading has stopped
      console.log("step 2");
      await waitForNetworkIdle(page, timeout, 0);
      await page.waitForSelector(
        "div[data-ng-if='loading'] > .LoadingModel:not([style*='display: none'])",
        {
          hidden: true,
        }
      );
      // This should wait for an additional 3 secs
      // await page.waitForTimeout(3000);
      console.log("step 3");
      await waitForNetworkIdle(page, timeout, 0);
      console.log("step 4");
      // This should wait for the link to be visible
      await page.waitForSelector("div[ng-show='1 == 1'] a.tw-link", {
        visible: true,
      });
      console.log("step 5");
      await waitForNetworkIdle(page, timeout, 0);
      console.log("step 6");
      await page.click("div[ng-show='1 == 1'] a.tw-link");
      console.log("step 7");
      //await waitForNetworkIdle(page, 500, 0);
      //
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      //
      //

      //  mainWindow.webContents.send("update-progress-bar", ["20%", "insurance"]);
      await page.waitForSelector(
        ".btn.btn-primary[ng-click='helpers.GoToUrl(TWURL)']",
        { visible: true }
      );
      await page.click(".btn.btn-primary[ng-click='helpers.GoToUrl(TWURL)']");
      // //   mainWindow.webContents.send("update-progress-bar", ["30%", "insurance"]);
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      //   await waitForRandom();
      await page.waitForSelector("#option2", { visible: true });
      await page.click("#option2");
      //  await waitForRandom();
      await page.waitForSelector("#ManufacturerName", { visible: true });
      await page.type("#ManufacturerName", "HONDA.");
      //    await waitForRandom();
      await page.waitForSelector("li > a[title='HONDA.']", { visible: true });
      await page.click("li > a[title='HONDA.']");
      //   await waitForRandom();
      await page.waitForSelector("input[name='ModelName']", { visible: true });

      await page.type(
        "input[name='ModelName']",
        data.insuranceDetails.modelName.split(" ")[0]
      );
      //   await waitForRandom();
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
      //    await waitForRandom();
      await page.waitForSelector("input[name='RtoLocation']+ul > li > a", {
        visible: true,
      });
      await page.click("input[name='RtoLocation']+ul > li > a");

      //    await waitForRandom();
      let deliveryDate = new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/");
      await page.type("#Risk1", deliveryDate);
      //   await waitForRandom();
      await page.click("select[name='YearOfManufacturer']");
      await waitForNetworkIdle(page, timeout, 0);
      await page.select(
        "select[name='YearOfManufacturer']",
        new Date().getFullYear().toString()
      );
      await waitForNetworkIdle(page, timeout, 0);
      await page.click("#IDV_SumInsured");
      //  await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.waitForSelector("#IDV_SumInsured");
      await page.$eval("#IDV_SumInsured", (el) => (el.value = ""));

      const idv = Math.round(new Number(data.priceDetails.price) * 0.95);
      await page.type("#IDV_SumInsured", idv.toString());

      // await waitForRandom();
      await waitForNetworkIdle(page, timeout, 0);
      await page.waitForSelector("input[name='EngineNumber']");
      await page.type(
        "input[name='EngineNumber']",
        data.vehicleInfo.engineNumber
      );
      //   await waitForRandom();
      await page.waitForSelector("input[name='ChassisNumber']");
      await page.type(
        "input[name='ChassisNumber']",
        data.vehicleInfo.frameNumber
      );

      await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["40%", "insurance"]);
      await page.waitForSelector("#AddOnEdit");

      await page.evaluate(() => {
        document.querySelector('#AddOnEdit').click();
      });

      // page.click("#AddOnEdit", { visible: true });

      //    await waitForRandom();
      await page.waitForSelector("#C_ZeroDep_1");

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

      //     await waitForRandom();
      await page.waitForSelector(
        "div[ng-switch-when='Vehicle Base Value - Zero Depreciation - Claim'] #ZD_Information2",
        { visible: true }
      );
      await page.type(
        "div[ng-switch-when='Vehicle Base Value - Zero Depreciation - Claim'] #ZD_Information2",
        data.insuranceDetails.userRate
      );
      //    await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["50%", "insurance"]);
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.evaluate(() => {
        document.querySelector('#DiscountEdit').click();
      });
      //await page.click("#DiscountEdit");
      //    await waitForRandom();
      await page.waitForSelector("label[uib-btn-radio='6000']", {
        visible: true,
      });
      await page.click("label[uib-btn-radio='6000']");
      //     await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      await page.evaluate(() => {
        document.querySelector('#PersonalEdit').click();
      });
      //await page.click("#PersonalEdit");
      await page.waitForSelector("#CustomerName", { visible: true });
      await page.type("#CustomerName", data.name);
      await page.type("#CustomerEmailMask", "Cbr250r9999@gmail.com");
      await page.type("#CustomerMobileMask", data.customerInfo.phoneNo);
      //    await waitForRandom();
      await page.waitForSelector(
        "form[name='TwoWheelerForm'] > .text-center > button",
        { visible: true }
      );
      await page.click("form[name='TwoWheelerForm'] > .text-center > button");
      //     await waitForRandom();
      await page.waitForSelector("div[data-ng-if='loading']", { hidden: true });
      //     await waitForRandom();
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
      //     await waitForRandom();
      await page.waitForSelector(
        "div[ng-show='showSuccessSection'] button:nth-of-type(2)",
        { visible: true }
      );
      await page.click(
        "div[ng-show='showSuccessSection'] button:nth-of-type(2)"
      );
      //     await waitForRandom();
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
      //     await waitForRandom();
      //   mainWindow.webContents.send("update-progress-bar", ["70%", "insurance"]);

      // const genderValue = data["Gender"] === "M" ? "MALE" : "FEMALE";
      const salutationValue =
        data.customerInfo.gender.toUpperCase() === "MALE" ? "MR" : "MRS";
      await page.select("#Gender", data.customerInfo.gender.toUpperCase());
      //     await waitForRandom();
      await page.select("#salutation", salutationValue);
      //     await waitForRandom();
      await page.type("input[name='Firstname']", data.customerInfo.firstName);
      //    await waitForRandom();
      await page.type("input[name='Lastname']", data.customerInfo.lastName);
      //    await waitForRandom();
      await page.type("#flatNo", data.customerInfo.currLineOne);
      //   await waitForRandom();
      await page.waitForSelector("#CurAddress23");
      //   await waitForRandom();
      await page.type("#CurAddress23", data.customerInfo.currLineTwo);

      //   await waitForRandom();
      await page.waitForSelector("input[name='CurPincode']~span>a");
      //   await waitForRandom();
      await page.click("input[name='CurPincode']~span>a");
      //   await waitForRandom();

      await page.waitForSelector("input[name='PinCode']");

      await page.type("input[name='PinCode']", data.customerInfo.currPostal);

      //  await waitForRandom();

      await page.waitForSelector("#searchCityStatePin a:nth-of-type(1)", {
        visible: true,
      });

      //   await waitForRandom();
      await page.click("#searchCityStatePin a:nth-of-type(1)");

      //   await waitForRandom();

      await page.waitForSelector(
        "#searchCityStatePin #no-more-tables a.ng-binding"
      );

      await page.click("#searchCityStatePin #no-more-tables a.ng-binding");
      //     await waitForRandom();
      // mainWindow.webContents.send("update-progress-bar", ["80%", "insurance"]);

      // Enter hypothecation details
      if (data.additionalInfo.hasOwnProperty("financier")) {
        await page.click("#RiskEdit");
        //       await waitForRandom();
        await page.waitForSelector(
          "label[ng-change='SetFinancierDetailBanca();LosAndLgCodeValidation()']",
          { visible: true }
        );
        await page.click(
          "label[ng-change='SetFinancierDetailBanca();LosAndLgCodeValidation()']"
        );
        //     await waitForRandom();
        await page.waitForSelector("#FinancierName", { visible: true });
        await page.type("#FinancierName", data.additionalInfo.financier);
        //     await waitForRandom();
        await page.waitForSelector(
          `a[title="${data.additionalInfo.financier}"]`,
          { visible: true }
        );
        await page.click(`a[title="${data.additionalInfo.financier}"]`);
        //      await waitForRandom();
        await page.select("#AgreementType", "string:Hypothecation");
        //      await waitForRandom();
        await page.type("#FinancierBranchCode", data.customerInfo.currCity);
        //     await waitForRandom();
      }
      //   mainWindow.webContents.send("update-progress-bar", ["90%", "insurance"]);

      // Enter Nominee Information
      await page.click("#CoverEdit");
      //    await waitForRandom();
      await page.select("#ddlRelationship", "string:Other");
      //   await waitForRandom();
      await page.type("input[name='Information2']", data.customerInfo.swdo);
      //   await waitForRandom();
      await page.type("input[name='Information3']", "65");
      //   await waitForRandom();
      await page.waitForSelector(
        "form[name='TwoWheelerForm'] > .text-right > button.btn-submit"
      );
      await page.click(
        "form[name='TwoWheelerForm'] > .text-right > button.btn-submit"
      );
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
