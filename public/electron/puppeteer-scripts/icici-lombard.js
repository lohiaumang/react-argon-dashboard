module.exports = async function (page, data, mainWindow, insuranceWindow) {
  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  async function waitForRandom() {
    await page.waitForTimeout((Math.random() + 1) * 1000);
  }

  const {
    credentials: { username, password },
  } = data;
  let done = false;

  // insuranceWindow.on("close", async (e) => {
  //   e.preventDefault();
  //   await page.goto(
  //     "https://ipartner.icicilombard.com/WebPages/Agents/welcome.aspx"
  //   );
  //   await page.waitForSelector("a[href='/WebPages/Logout.aspx?type=agent']");
  //   await page.click("a[href='/WebPages/Logout.aspx?type=agent']");

  //   insuranceWindow.destroy();

  //   mainWindow.webContents.send("fromMain", {
  //     type: done ? "INSURANCE_CREATED" : "INVOICE_CREATE",
  //     data: data.id,
  //   });
  //   // }
  // });

  insuranceWindow.on("close", async (e) => {
    e.preventDefault();

    let url = "";
    const loginUrl = "https://ipartner.icicilombard.com/WebPages/Login.aspx";

    try {
      url = (await page.evaluate(() => window.location.href)) || "";
    } catch (err) {
      console.log("Unable to get current url: ", err);
    }

    if (url && !url.startsWith(loginUrl)) {
      try {
        await page.goto(
          "https://ipartner.icicilombard.com/WebPages/Agents/welcome.aspx"
        );
        await page.waitForSelector(
          "a[href='/WebPages/Logout.aspx?type=agent']"
        );
        await page.click("a[href='/WebPages/Logout.aspx?type=agent']");
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
      await page.waitForSelector("#login2_txtLoginId", { visible: true });
      await page.type("#login2_txtLoginId", username);
      await page.waitForSelector("#login2_txtPassword", { visible: true });
      await page.type("#login2_txtPassword", password);
      await page.select("#login2_ddlLandingPage", "1");
      await page.click("#login2_btnLogin");
    }

    await page.waitForSelector("input[value='Get Full Quote']", {
      visible: true,
    });
    await page.click("input[value='Get Full Quote']");

    await waitForRandom();
    await page.waitForSelector("#TxtRegistrationNumber", { visible: true });
    await page.type("#TxtRegistrationNumber", "NEW");
    await page.type("#TxtRtoCity", data.customerInfo.currCity);
    await page.waitForSelector("#divwidth > div", { visible: true });
    await page.click("#divwidth > div");
    await page.waitForSelector("#divwidth > div", { hidden: true });

    let deliveryDate = new Date()
      .toJSON()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");
    await page.type("#TxtRegistrationDate", deliveryDate);
    await page.click(".robo-card-panel");
    const manufacturer = "HONDA MOTORCYCLE".toUpperCase();
    const manufacturerValues = await page.$$eval(
      "#DdlManufacture > option",
      (options) =>
        options.map((option) => ({
          value: option.value,
          name: option.textContent,
        }))
    );
    const manufacturerId = manufacturerValues.find((manufacturerDetails) =>
      manufacturerDetails.name.startsWith(manufacturer)
    );

    await page.select("#DdlManufacture", manufacturerId.value);

    await page.waitForFunction(
      "document.querySelectorAll('#DdlModel > option').length > 1"
    );

    const model = data.insuranceDetails.modelName;
    console.log(model);
    const modelVariants = await page.$$eval("#DdlModel > option", (options) =>
      options.map((option) => ({
        value: option.value,
        name: option.textContent,
      }))
    );
    const modelVariant = modelVariants.find((variants) =>
      variants.name.includes(model)
    );

    await page.select("#DdlModel", modelVariant.value); //not get currect data
    await page.waitForFunction('!!document.querySelector("#txtPrice").value');

    await page.click("#lnkbtnIDVtoExShowConv");
    await page.waitForSelector("#txtRequiredIDV", { visible: true });
    await page.waitForSelector("#txtExShowroom", { visible: true });
    await page.$eval("#txtRequiredIDV", (el) => (el.value = ""));
    const idv = Math.round(new Number(data.priceDetails.price) * 0.95);
    console.log(idv), "get idv price";
    await page.type("#txtRequiredIDV", idv.toString());
    await page.click("#imgbtnCalculateIDVtoExShowConv");
    await page.waitForFunction(
      '!!document.querySelector("#txtExShowroom").value'
    );
    await page.click("#imgbtnSubmitIDVtoExShowConv");

    await page.waitForSelector("#pnlIDVtoExShowConv", { hidden: true });
    const state = data.customerInfo.currState.toUpperCase();
    const allStates = await page.$$eval("#ddToState > option", (options) =>
      options.map((option) => ({
        value: option.value,
        name: option.textContent,
      }))
    );
    const stateToChoose = allStates.find((currState) =>
      currState.name.includes(state)
    );
    await page.select("#ddToState", stateToChoose.value);
    await page.select("#DdlCPATenure", "1");

    await page.click("label[for=RdbAdditionalCover_0]");
    await page.waitForSelector("#ddZeroDepValue", { visible: true });
    await page.select("#ddZeroDepValue", "Silver");
    await page.click("label[for=rdbAddDiscount_0]");
    await page.waitForSelector("#ddlTppdSumInsured", { visible: true });
    await page.select("#ddlTppdSumInsured", "1");
    await page.click("#BtnCalculatePremium");

    await page.waitForSelector("#TxtEngineNumber", { visible: true });
    await page.type("#TxtEngineNumber", data.vehicleInfo.engineNumber);
    await page.type("#TxtChassisNumber", data.vehicleInfo.frameNumber); //todo chassisNumber

    if (data.additionalInfo.hasOwnProperty("financier")) {
      await page.click("label[for='rdbVehicleUnder_2']");
      await page.waitForSelector("#txtFinancierName", { visible: true });
      if (data.additionalInfo.financier === "OTHERS") {
        await page.type("#txtFinancierName", data.additionalInfo.hypothecation);
      } else {
        await page.type("#txtFinancierName", data.additionalInfo.financier);
      }

      await page.waitForSelector("#txtFinancierBranch", { visible: true });
      await page.type("#txtFinancierBranch", data.customerInfo.currCity);
    }

    await page.click("#ctrlCustomerAddress_btnCreateNew");

    const titleValue = data.customerInfo.gender.slice(0, 1).toUpperCase()
      ? "1"
      : "0";
    await page.waitForSelector("#ctrlCustomerAddress_DdlCustTitle", {
      visible: true,
    });
    await page.select("#ctrlCustomerAddress_DdlCustTitle", titleValue);
    await page.type(
      "#ctrlCustomerAddress_TxtCustName",
      `${data.customerInfo.firstName} ${data.customerInfo.lastName}`
    );
    await page.type(
      "#ctrlCustomerAddress_TxtCustAddressLine1",
      data.customerInfo.currLineOne
    );
    await page.type(
      "#ctrlCustomerAddress_TxtCustAddressLine2",
      data.customerInfo.currLineTwo
    );
    await page.type(
      "#ctrlCustomerAddress_TxtCustPincode",
      data.customerInfo.currPostal
    );

    const dropDown = await page.waitForSelector(
      "#ctrlCustomerAddress_AutoCompleteExtender1_completionListElem > div",
      { visible: true }
    );
    await dropDown.click();
    await page.waitForSelector(
      "#ctrlCustomerAddress_AutoCompleteExtender1_completionListElem > div",
      { hidden: true }
    );
    await page.waitForFunction(
      "!!document.querySelector('#ctrlCustomerAddress_TxtCustCity').value"
    );

    await page.type(
      "#ctrlCustomerAddress_TxtCustEmail",
      "cbr250r999@ggmail.com"
    ); //todo

    await page.type(
      "#ctrlCustomerAddress_TxtCustMobile",
      data.customerInfo.phoneNo
    );
    await waitForRandom();
    await page.waitForSelector(
      "label[for='ctrlCustomerAddress_chkGSTDetails']",
      { visible: true }
    );
    await page.click("label[for='ctrlCustomerAddress_chkGSTDetails']");
    await page.waitForSelector("#ctrlCustomerAddress_txtGSTIN", {
      visible: true,
    });
    //  await page.type("#ctrlCustomerAddress_txtGSTIN", data.customerInfo.gst);

    done = true;
  } catch (err) {
    console.log(err);
  }
};
