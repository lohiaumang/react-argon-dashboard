module.exports = function erp(page, data, mainWindow) {
  //console.log(data.customerInfo.currState);
  const { click, typeText } = require("../puppeteer-scripts/helper");

  const {
    credentials: { username, password },
  } = data;

  const navigationPromise = page.waitForNavigation();

  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  async function automate() {
    await typeText(page, "#s_swepi_1", username);
    await typeText(page, "#s_swepi_2", password);
    const captcha = await page.$eval("#captchaCode", (el) =>
      el.textContent.replace(/\s+/g, "")
    );
    await typeText(page, "#s_captcha", captcha);
    await click(page, "#s_swepi_22");
    await navigationPromise;
    await click(page, "#s_sctrl > #s_sctrl_tabScreen #ui-id-130");

    // fill data select
    await click(
      page,
      'table > tbody > tr > .siebui-bullet-item > #s_3_2_18_0_span > .siebui-anchor-readonly > a[rowid="1"]'
    );

    //fill new reord
    // await typeText(
    //   page,
    //   "table > tbody > tr > .siebui-form-data > .s_2_1_19_0",
    //   data.customerInfo.firstName
    // );
    // await typeText(
    //   page,
    //   "table > tbody > tr > .siebui-form-data > .s_2_1_2_0",
    //   ""
    // );
    // await typeText(
    //   page,
    //   "table > tbody > tr > .siebui-form-data > .s_2_1_18_0",
    //   data.customerInfo.lastName
    // );
    // await typeText(
    //   page,
    //   "table > tbody > tr > .siebui-form-data > .s_2_1_0_0",
    //   data.customerInfo.phoneNo
    // );

    // await click(page, 'input[aria-label="Consent For Calling"] + span');
    // await page.waitForSelector(
    //   "ul[role='combobox']:not([style*='display: none'])",
    //   {
    //     visible: true,
    //   }
    // );
    // let callingType = await page.$$eval(
    //   "ul[role='combobox']:not([style*='display: none']) > li > div",
    //   (listItems) =>
    //     listItems.map((item) => {
    //       return {
    //         name: item.textContent,
    //         id: item.id,
    //       };
    //     })
    // );
    // const collingTypeButton = callingType.find((item) => item.name === "No"); //todo
    // await click(page, `#${collingTypeButton.id}`);

    // await click(page, 'input[aria-label="Gender"] + span');
    // await page.waitForSelector(
    //   "ul[role='combobox']:not([style*='display: none'])",
    //   {
    //     visible: true,
    //   }
    // );
    // let genderType = await page.$$eval(
    //   "ul[role='combobox']:not([style*='display: none']) > li > div",
    //   (listItems) =>
    //     listItems.map((item) => {
    //       return {
    //         name: item.textContent,
    //         id: item.id,
    //       };
    //     })
    // );
    // const genderTypeButton = genderType.find(
    //   (item) => item.name === data.customerInfo.gender.slice(0, 1).toUpperCase()
    // );
    // await click(page, `#${genderTypeButton.id}`);

    // await click(page, "tbody > tr > td > #s_2_1_10_0_Ctrl > span");
    // await typeText(
    //   page,
    //   "tbody > tr > td > .mceGridField > .s_3_1_80_0",
    //   data.customerInfo.swdo
    // );

    // await typeText(
    //   page,
    //   'tbody > tr > td > .mceGridField > input[aria-label="Date Of Birth"]',
    //   data.customerInfo.dob
    // );

    // await typeText(
    //   page,
    //   "tbody > tr > td > .mceGridField > .s_3_1_5_0",
    //   data.customerInfo.currLineOne +
    //     " " +
    //     data.customerInfo.currLineTwo +
    //     " " +
    //     "PS" +
    //     " " +
    //     data.customerInfo.currPS
    // );
    // await typeText(
    //   page,
    //   "tbody > tr > td > .mceGridField > .s_3_1_6_0",
    //   data.customerInfo.currDistrict + " " + data.customerInfo.currCity
    // );

    // await click(page, 'input[aria-label="State"] + span');
    // await page.waitForSelector(
    //   "ul[role='combobox']:not([style*='display: none'])",
    //   {
    //     visible: true,
    //   }
    // );
    // let state = await page.$$eval(
    //   "ul[role='combobox']:not([style*='display: none']) > li > div",
    //   (listItems) =>
    //     listItems.map((item) => {
    //       // console.log(item.textContent, item.id);
    //       return {
    //         name: item.textContent,
    //         id: item.id,
    //       };
    //     })
    // );
    // const stateButton = state.find(
    //   (item) =>
    //     item.name === data.customerInfo.currState.slice(0, 2).toUpperCase()
    // );
    // //  console.log(stateButton.name, stateButton.id);
    // await page.waitForSelector(`#${stateButton.id}`, { visible: true });
    // await page.$eval(`#${stateButton.id}`, (el) => el.click());
    // await typeText(
    //   page,
    //   "tbody > tr > td > .mceGridField > .s_3_1_66_0",
    //   data.customerInfo.currPostal
    // );
    // await typeText(
    //   page,
    //   "tbody > tr > td > .mceGridField > .siebui-ctrl-mailto",
    //   data.customerInfo.email
    // );

    //code work

    //await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    //await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    // await page.select('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select', 'All Contacts across My Organization')
    // await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    // await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')

    //UnhandledPromiseRejectionWarning: Error: Evaluation failed: DOMException: Failed to execute 'querySelector' on 'Document': '#s_2_l > tbody > #↓ > #↓_s_2_l_First_Name > .drilldown' is not a valid selector.
    //await page.waitFor(8000);

    //await click(page,'.ui-jqgrid-btable > tbody > .jqgrow > td[role="gridcell"] > .drilldown ');

    await click(
      page,
      "div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span"
    );

    //Enquiry Type

    await click(page, 'input[aria-label="Enquiry Type"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
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
      (item) => item.name === data.additionalInfo.inquiryType
    );
    await click(page, `#${enquiryButton.id}`);

    //Customer Type
    await click(page, 'input[aria-label="Customer Type"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
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
      (item) => item.name === data.customerInfo.customerType
    );
    await click(page, `#${customerTypeButton.id}`);

    //Enquiry Source
    await click(page, 'input[aria-label="Enquiry Source"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
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
    const enquirySourceButton = enquirySourceItems.find(
      (item) => item.name === data.customerInfo.enquirySource
    );
    await click(page, `#${enquirySourceButton.id}`);

    //Customer Category

    await click(page, 'input[aria-label="Customer Category"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
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
      (item) => item.name.toUpperCase() === data.customerInfo.type.toUpperCase()
    );
    await click(page, `#${customerCategoryButton.id}`);

    //Enquiry Category

    await click(page, 'input[aria-label="Enquiry Category"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
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
      (item) => item.name.toUpperCase() === data.customerInfo.type.toUpperCase()
    );
    await click(page, `#${enquiryCategoryButton.id}`);

    //Purchase Type
    let purchaseTypeButton;
    await click(page, 'input[aria-label="Purchase Type"] + span');
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
    );
    let purchaseTypes = await page.$$eval(
      "ul[role='combobox']:not([style*='display: none']) > li > div",
      (listItems) =>
        listItems.map((item) => ({
          name: item.textContent,
          id: item.id,
        }))
    );
    const purchaseType = !!data.additionalInfo.financier ? "Cash" : "Financier";
    purchaseTypeButton = purchaseTypes.find(
      (item) => item.name.toUpperCase() === purchaseType.toUpperCase()
    );
    await click(page, `#${purchaseTypeButton.id}`);

    //Financier Category

    // if (purchaseTypeButton.name === "Finance") {
    //   console.log("stape 1")

    //   await click(page,'input[aria-label="Financier"]');
    //   console.log("stape 2")
    //   await typeText(page,'input[aria-label="Financier"]','HDFC BANK')
    //   console.log("stape 3")
    // }

    //Model Category

    await click(
      page,
      'input[aria-label="Model Category<Font size= 3 color=Red><b>*</b></Font>"] + span'
    );
    await page.waitForSelector(
      "ul[role='combobox']:not([style*='display: none'])",
      {
        visible: true,
      }
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
      {
        visible: true,
      }
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
      {
        visible: true,
      }
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
      {
        visible: true,
      }
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
    await click(
      page,
      '.siebui-popup-btm > .siebui-popup-button > button[data-display="OK"]'
    );

    await page.waitForSelector(".siebui-applet-header #s_at_m_1", {
      visible: true,
    });
    await page.$eval(
      ".siebui-applet-header #s_at_m_1:not([style*='display: none'])",
      (el) => el.click()
    );
    await click(
      page,
      '#s_at_m_1-menu > li[data-caption="Save Record                [Ctrl+S]"] > .ui-menu-item-wrapper'
    ); //todo
    await click(page, "#s_1_l > tbody > tr > td > .drilldown");
    await click(
      page,
      '#s_vctrl_div_tabScreen > ul[role="tablist"] li[aria-labelledby="ui-id-543"] > a[data-tabindex="tabScreen3"]'
    );
    // await page.waitForSelector('#s_vctrl_div_tabScreen > ul[role="tablist"] li[aria-labelledby="ui-id-543"] > a[data-tabindex="tabScreen3"]');
    // await page.$eval('#s_vctrl_div_tabScreen > ul[role="tablist"] li[aria-labelledby="ui-id-543"] > a[data-tabindex="tabScreen3"]', el => el.click());
    //  await click(page,'.siebui-applet-buttons > .siebui-btn-grp-search > button[name="s_3_1_3_0"]');
    //  await click(page,'#s_3_l > tbody > .jqgrow > td[style="text-align:left;"] > .drilldown');
    //   console.log("step 1")
  }

  automate();
};
