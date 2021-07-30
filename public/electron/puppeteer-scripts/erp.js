module.exports = function erp(page, data, mainWindow, erpWindow) {
  const { click, typeText } = require("./helper");
  const { enquiryType, customerCategory } = require("../enums");

  const {
    credentials: { username, password },
  } = data;

  const navigationPromise = page.waitForNavigation();

  async function automate() {
    let done = false;
    console.log(done);
    erpWindow.on("close", async (e) => {
      e.preventDefault();
      await page.waitForSelector("#tb_0");
      await page.click("#tb_0");
      await page.waitForSelector("button[title='Logout']");
      await page.click("button[title='Logout']");
      erpWindow.destroy();
      mainWindow.webContents.send("fromMain", {
        type: done ? "INVOICE_CREATED" : "DO_CREATED",
        data: data.id,
      });
    });

    try {
      //done = true;
      if (username && password) {
        await typeText(page, "#s_swepi_1", username);
        await typeText(page, "#s_swepi_2", password);
        done = true; //done true

        const captcha = await page.$eval("#captchaCode", (el) =>
          el.textContent.replace(/\s+/g, "")
        );
        await typeText(page, "#s_captcha", captcha);
        await click(page, "#s_swepi_22");
        await navigationPromise;
        await click(page, "#s_sctrl > #s_sctrl_tabScreen #ui-id-130");
      }
      // fill data select
      // await click(
      //   page,
      //   'table > tbody > tr > .siebui-bullet-item > #s_3_2_18_0_span > .siebui-anchor-readonly > a[rowid="3"]'
      // );

      //fill new reord
      await typeText(
        page,
        "table > tbody > tr > .siebui-form-data > .s_2_1_19_0",
        data.customerInfo.firstName
      );
      await typeText(
        page,
        "table > tbody > tr > .siebui-form-data > .s_2_1_2_0",
        ""
      ); //todo
      await typeText(
        page,
        "table > tbody > tr > .siebui-form-data > .s_2_1_18_0",
        data.customerInfo.lastName
      );
      await typeText(
        page,
        "table > tbody > tr > .siebui-form-data > .s_2_1_0_0",
        data.customerInfo.phoneNo
      );
      await click(page, 'input[aria-label="Consent For Calling"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let callingType = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const collingTypeButton = callingType.find((item) => item.name === "No"); //todo
      await click(page, `#${collingTypeButton.id}`);
      await click(page, 'input[aria-label="Gender"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let genderType = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const genderTypeButton = genderType.find(
        (item) =>
          item.name === data.customerInfo.gender.slice(0, 1).toUpperCase()
      );
      await click(page, `#${genderTypeButton.id}`);

      await click(page, "tbody > tr > td > #s_2_1_10_0_Ctrl > span");
      await typeText(
        page,
        "tbody > tr > td > .mceGridField > .s_3_1_80_0",
        data.customerInfo.swdo
      );
      await typeText(
        page,
        'tbody > tr > td > .mceGridField > input[aria-label="Date Of Birth"]',
        data.customerInfo.dob
      );
      await typeText(
        page,
        "tbody > tr > td > .mceGridField > .s_3_1_5_0",
        data.customerInfo.currLineOne
      );
      await typeText(
        page,
        "tbody > tr > td > .mceGridField > .s_3_1_6_0",
        data.customerInfo.currLineTwo + ", " + data.customerInfo.currPS
      );

      await click(page, 'input[aria-label="State"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let state = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            // console.log(item.textContent, item.id);
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const stateButton = state.find(
        (item) =>
          item.name === data.customerInfo.currState.slice(0, 2).toUpperCase()
      );
      //  console.log(stateButton.name, stateButton.id);
      await page.waitForSelector(`#${stateButton.id}`, { visible: true });
      await page.$eval(`#${stateButton.id}`, (el) => el.click());
      await typeText(
        page,
        "tbody > tr > td > .mceGridField > .s_3_1_66_0",
        data.customerInfo.currPostal
      );
      await typeText(
        page,
        "tbody > tr > td > .mceGridField > .siebui-ctrl-mailto",
        data.customerInfo.email
      );

      //code work

      //await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
      //await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
      // await page.select('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select', 'All Contacts across My Organization')
      // await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
      // await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')

      //UnhandledPromiseRejectionWarning: Error: Evaluation failed: DOMException: Failed to execute 'querySelector' on 'Document': '#s_2_l > tbody > #↓ > #↓_s_2_l_First_Name > .drilldown' is not a valid selector.
      //await page.waitFor(8000);

      await click(
        page,
        '.ui-jqgrid-btable > tbody > .jqgrow > td[role="gridcell"] > .drilldown '
      );
      await click(
        page,
        "div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span"
      );

      //Enquiry Type
      await click(page, 'input[aria-label="Enquiry Type"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        {
          visible: true,
        }
      );
      let enquiryListItems = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );

      const enquiryButton = enquiryListItems.find(
        (item) => item.name === enquiryType[data.additionalInfo.inquiryType]
      );
      await click(page, `#${enquiryButton.id}`);

      //Customer Type
      await click(page, 'input[aria-label="Customer Type"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let customerType = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const customerTypeButton = customerType.find(
        (item) =>
          item.name.toUpperCase() ===
          customerCategory[data.customerInfo.category].toUpperCase()
      );
      await click(page, `#${customerTypeButton.id}`);

      //Enquiry Source
      await click(page, 'input[aria-label="Enquiry Source"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let enquirySourceItems = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const enquirySourceButton = enquirySourceItems.find((item) =>
        item.name.toUpperCase().includes(data.customerInfo.source.toUpperCase())
      );
      await click(page, `#${enquirySourceButton.id}`);

      //Customer Category
      await click(page, 'input[aria-label="Customer Category"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let customerCategoryItems = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const customerCategoryButton = customerCategoryItems.find(
        (item) =>
          item.name.toUpperCase() === data.customerInfo.type.toUpperCase()
      );
      await click(page, `#${customerCategoryButton.id}`);

      //Enquiry Category
      await click(page, 'input[aria-label="Enquiry Category"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let enquiryCategoryItems = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const enquiryCategoryButton = enquiryCategoryItems.find(
        (item) =>
          item.name.toUpperCase() === data.customerInfo.type.toUpperCase()
      );
      await click(page, `#${enquiryCategoryButton.id}`);

      //Purchase Type
      let purchaseTypeButton;
      await click(page, 'input[aria-label="Purchase Type"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let purchaseTypes = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const purchaseType = !!data.additionalInfo.financier
        ? "Cash"
        : "Financier";
      purchaseTypeButton = purchaseTypes.find(
        (item) => item.name.toUpperCase() === purchaseType.toUpperCase()
      );
      await click(page, `#${purchaseTypeButton.id}`);

      //Financier Category
      // if (purchaseTypeButton.name === "Finance") {
      //   console.log("stape 1")

      // //   await click(page,'input[aria-label="Financier"]');
      // //   console.log("stape 2")
      // //   await typeText(page,'input[aria-label="Financier"]','HDFC BANK')
      // //   console.log("stape 3")
      // // }

      //Model Category
      await click(
        page,
        'input[aria-label="Model Category<Font size= 3 color=Red><b>*</b></Font>"] + span'
      );
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let modelCategory = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const modelCategoryButton = modelCategory.find(
        (item) => item.name === data.vehicleInfo.modelCategory
      );
      await click(page, `#${modelCategoryButton.id}`);

      //Model Name
      await click(
        page,
        'input[aria-label="Model Name<Font size= 3 color=Red><b>*</b></Font>"] + span'
      );
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let modelName = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const modelNameButton = modelName.find((item) =>
        data.modelName.includes(item.name)
      );
      await click(page, `#${modelNameButton.id}`);

      //Model Variant
      await click(
        page,
        'input[aria-label="Model Variant<Font size= 3 color=Red><b>*</b></Font>"] + span'
      );
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let modelVariant = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => ({
            name: item.textContent,
            id: item.id,
          }))
      );
      const modelVariantButton = modelVariant.find(
        (item) => item.name === data.modelName
      );
      await click(page, `#${modelVariantButton.id}`);

      //Assigned To (DSE)  todo
      await click(page, 'input[aria-label="Assigned To (DSE)"] + span');
      await click(page, 'input[aria-label="Find"] + span');
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      await click(
        page,
        'table > tbody > tr > td > .siebui-popup-button > button[aria-label="Pick Assigned To:Query"]'
      );
      await typeText(page, "input[name='Last_Name']", "DEVI");
      await click(page, '#s_3_l > tbody > tr > td[id="1_s_3_l_First_Name"] ');
      await typeText(
        page,
        '#s_3_l > tbody > tr > td[id="1_s_3_l_First_Name"] > input[name="First_Name"]',
        "PINKY"
      );
      await click(
        page,
        'table > tbody > tr > .siebui-popup-action > .siebui-popup-button > button[aria-label="Pick Assigned To:Go"]'
      );
      await click(page, "button[data-display='OK']");
      await page.waitForResponse(
        "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/"
      );
      await page.waitForFunction(
        `document.querySelector("input[aria-labelledby='Assigned_To_(DSE)_Label']").value !== ""`
      );
      await click(page, "button[title='Enquiries Menu']");
      await page.waitForSelector(
        ".siebui-appletmenu-item.ui-menu-item > a.ui-menu-item-wrapper",
        { visible: true }
      );
      const menuOptions = await page.$$eval(
        ".siebui-appletmenu-item.ui-menu-item > a.ui-menu-item-wrapper",
        (options) =>
          options.map((option) => {
            return {
              name: option.textContent,
              id: option.id,
            };
          })
      );
      const saveRecordButton = menuOptions.find((option) =>
        option.name.includes("[Ctrl+S]")
      );
      await click(page, `#${saveRecordButton.id}`);

      await page.waitForSelector("td[role='gridcell'] > a", { visible: true });
      await page.$eval("td[role='gridcell'] > a", (el) => el.click());
      await page.waitForResponse(
        "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/"
      );
      await page.waitForSelector("div[title='Third Level View Bar']", {
        visible: true,
      });
      const allTabs = await page.$$eval(
        "div[title='Third Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );
      const expressBookingButton = allTabs.find((item) =>
        item.name.includes("Express Booking")
      );
      await page.$eval(`#${expressBookingButton.id}`, (el) => el.click());
      // await click(
      //   page,
      //   '.siebui-applet-buttons > .siebui-btn-grp-search > button[name="s_3_1_3_0"]'
      // );
      //   await click(
      //     page,
      //     '#s_3_l > tbody > .jqgrow > td[style="text-align:left;"] > .drilldown',{visible: true}
      //   );
      await page.waitForSelector('div > button[data-display="Create Booking"]');
      await click(page, 'div > button[data-display="Create Booking"]');

      await page.waitForSelector(
        '#s_3_l > tbody > .jqgrow > td[style="text-align:left;"] > .drilldown',
        { visible: true }
      );
      await click(
        page,
        '#s_3_l > tbody > .jqgrow > td[style="text-align:left;"] > .drilldown'
      );
      await page.$eval(
        '#s_3_l > tbody > .jqgrow > td[style="text-align:left;"] > .drilldown',
        (el) => el.click()
      );
      //await typeText('.GridBack > tbody > tr > td[valign="middle"] input[name="s_1_1_41_0"]'); //finance select todo
      let deliveryDate = new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/");

      await typeText(
        page,
        '.GridBack > tbody > tr > td[valign="middle"] input[name="s_1_1_38_0"]',
        deliveryDate
      ); //todo
      await click(page, ".AppletButtons.siebui-applet-buttons > button"); //get price clcik

      //price select
      await page.waitForResponse(
        "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/"
      );
      await page.waitForSelector("div[title='Third Level View Bar']", {
        visible: true,
      });
      const paymentTabs = await page.$$eval(
        "div[title='Third Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );
      const paymentButton = paymentTabs.find((item) =>
        item.name.includes("Payments")
      );
      await page.$eval(`#${paymentButton.id}`, (el) => el.click());
      await click(
        page,
        '.siebui-btn-grp-applet > button[aria-label="Payment Lines:New"]'
      );
      await click(
        page,
        'input[aria-labelledby="1_s_2_l_Payment_Profile_Name s_2_l_Transaction_Type s_2_l_altCombo"] + span'
      );
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let paymentType = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const paymentTypeButton = paymentType.find(
        (item) => item.name === "Advance/Final Payment"
      );

      await page.waitForSelector(`#${paymentTypeButton.id}`, { visible: true });
      await page.$eval(`#${paymentTypeButton.id}`, (el) => el.click());
      //await typeText("input[aria-labelledby='1_s_2_l_Payment_Profile_Name s_2_l_Transaction_Type s_2_l_altCombo']:not([style*='display: none']",'Advance/Final Payment');
      await click(
        page,
        '#s_2_l > tbody > tr[role="row"] > td[aria-labelledby="s_2_l_altCalc"]',
        { visible: true }
      );
      await typeText(
        page,
        'input[aria-labelledby="s_2_l_Transaction_Amount s_2_l_altCalc"]',
        data.additionalInfo.price
      );

      //Booking Details & Vehicle Allotment
      await page.waitForSelector("div[title='Third Level View Bar']", {
        visible: true,
      });
      const vehicleAllotmentTabs = await page.$$eval(
        "div[title='Third Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );
      const vehicleAllotment = vehicleAllotmentTabs.find((item) =>
        item.name.includes("Booking Details & Vehicle Allotment")
      );
      await page.$eval(`#${vehicleAllotment.id}`, (el) => el.click());
      // done = true;
      await click(
        page,
        '.siebui-btn-grp-applet > button[aria-label="Payment Lines:New"]'
      );
      await click(
        page,
        'div > button[aria-label="Line Items:Vehicle Allotment"]'
      );
      await click(page, 'div > button[aria-label="Vehicles:New"]');
      await click(
        page,
        '#s_3_l > tbody > tr[role="row"] > td[data-labelledby=" s_3_l_Serial_Number s_3_l_altpick"]',
        { visible: true }
      );
      await typeText(
        page,
        'input[aria-labelledby=" s_3_l_Serial_Number s_3_l_altpick"]',
        "ME4JF49MCMD051004"
      ); //todo not fill
      await click(page, 'div > button[aria-label="Vehicles:New"]');
      await page.goBack();

      await page.waitForSelector("div[title='Third Level View Bar']", {
        visible: true,
      });
      const invoiceTabs = await page.$$eval(
        "div[title='Third Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );
      const invoiceButton = invoiceTabs.find((item) =>
        item.name.includes("Invoice")
      );
      await page.$eval(`#${invoiceButton.id}`, (el) => el.click());

      await click(
        page,
        'div > button[aria-label="Sales Invoice:Generate Invoice"]'
      );
      //date 10-07-2021
      await click(
        page,
        'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="1_s_2_l_TMI_Ref_Number s_2_l_TMI_Invoice_Key_No "]'
      );
      await typeText(page, 'input[name="TMI_Invoice_Key_No"]', "7078"); //todo add key no mobile app and db
      await click(
        page,
        'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Faktur_Number "]'
      );
      await typeText(
        page,
        'input[name="TMI_Faktur_Number"]',
        "M7C1P6588237C13"
      ); //todo add battery number mobile app and db
      await click(
        page,
        'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Booklet_Number "]'
      );
      await typeText(page, 'input[name="TMI_Booklet_Number"]', "0"); //todo add Booklet number mobile app and db
      await click(
        page,
        'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Riding_Trainer_Flag s_2_l_altCombo"]'
      ); //todo add riding number mobile app and db
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let ridingType = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const ridingTypeButton = ridingType.find((item) => item.name === "N");

      await page.waitForSelector(`#${ridingTypeButton.id}`, { visible: true });
      await page.$eval(`#${ridingTypeButton.id}`, (el) => el.click());
      await click(
        page,
        'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_PDSA_Flag s_2_l_altCombo"]'
      ); //todo add pdsaGiven  mobile app and db
      await page.waitForSelector(
        "ul[role='combobox']:not([style*='display: none'])",
        { visible: true }
      );
      let pdsaGiven = await page.$$eval(
        "ul[role='combobox']:not([style*='display: none']) > li > div",
        (listItems) =>
          listItems.map((item) => {
            return {
              name: item.textContent,
              id: item.id,
            };
          })
      );
      const pdsaGivenpdsaGiven = pdsaGiven.find((item) => item.name === "N");

      await page.waitForSelector(`#${pdsaGivenpdsaGiven.id}`, {
        visible: true,
      });
      await page.$eval(`#${pdsaGivenpdsaGiven.id}`, (el) => el.click());
      await page.waitForSelector("td[role='gridcell'] > a", { visible: true });
      await page.$eval("td[role='gridcell'] > a", (el) => el.click());
      await click(page, 'div > button[data-display="Permanent Invoice"]');
      // await browser.close();
      done = true;
    } catch (err) {
      console.log(err, "WE GET ERROR");
    }
  }

  automate();
};
