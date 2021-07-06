module.exports = function erp(
  page,
  { data, modelData, dealerData },
  mainWindow
) {
  const { click, typeText } = require("../puppeteer-scripts/helper");

  const navigationPromise = page.waitForNavigation();

  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  async function automate() {
    await typeText(page, "#s_swepi_1", "AS010002SA003");
    await typeText(page, "#s_swepi_2", "Hirise_3956");
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
      'table > tbody > tr > .siebui-bullet-item > #s_3_2_18_0_span > .siebui-anchor-readonly > a[rowid="5"]'
    );

    //fill new reord
    // await typeText(page,"table > tbody > tr > .siebui-form-data > .s_2_1_19_0","rahuli89");
    // await typeText(page,"table > tbody > tr > .siebui-form-data > .s_2_1_2_0","kumari89");
    // await typeText(page,"table > tbody > tr > .siebui-form-data > .s_2_1_18_0","kumari89");
    // await typeText(page,"table > tbody > tr > .siebui-form-data > .s_2_1_0_0","2154748541");
    // await click(page, "table #s_2_1_1_0_icon");
    // await click(page, "div > #_sweview > #ui-id-178 #ui-id-183");
    // await click(page, "table #s_2_1_3_0_icon");
    // await click(page, "div > #_sweview > #ui-id-179 #ui-id-187");
    // await click(page, "tbody > tr > td > #s_2_1_10_0_Ctrl > span");
    // await typeText(page,"tbody > tr > td > .mceGridField > .s_3_1_80_0","r pd");
    // await typeText(page,"tbody > tr > td > .mceGridField > .s_3_1_5_0","testlane983");
    // await typeText(page,"tbody > tr > td > .mceGridField > .s_3_1_6_0","testlane984");
    // await typeText(page,"tbody > tr:nth-child(8) > td > .mceGridField > .siebui-ctrl-select","AS");
    // await typeText(page,"tbody > tr > td > .mceGridField > .s_3_1_66_0","781005");
    // await typeText(page,"tbody > tr > td > .mceGridField > .siebui-ctrl-mailto","test983@gmail.com");

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
      (item) => item.name === "Phone"
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
      (item) => item.name === "First Time Buyer"
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
      (item) => item.name === "Friend"
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
      (item) => item.name === "Individual"
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
      (item) => item.name === "Individual"
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
    let purchaseType = await page.$$eval(
      "ul[role='combobox']:not([style*='display: none']) > li > div",
      (listItems) =>
        listItems.map((item) => ({
          name: item.textContent,
          id: item.id,
        }))
    );
    purchaseTypeButton = purchaseType.find((item) => item.name === "Finance");
    await click(page, `#${purchaseTypeButton.id}`);

    //Assigned To (DSE)

    //await click(page,'tbody #s_1_2_32_0_icon')
    //await typeText(page,'tbody > .AppletButtons > .siebui-popup-filter > .siebui-popup-button > .siebui-ctrl-input', 'RAO')
    //await click(page,'tbody button[name="s_3_1_5_0"]')

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
    await page.focus("input[name='Last_Name']");
    await typeText(page, "input[name='Last_Name']", "DEVI");
    await page.$eval("input[name='Last_Name']", (e) => e.blur());
    await typeText(page, "input[name='First_Name']", "PINKY");
    await click(
      page,
      'table > tbody > tr > .siebui-popup-action > .siebui-popup-button > button[aria-label="Pick Assigned To:Go"]'
    );
    await click(
      page,
      '.siebui-popup-btm > .siebui-popup-button > button[data-display="OK"]'
    );

    //  let assigned = await page.$$eval(
    //    "ul[role='combobox']:not([style*='display: none']) > li > div",
    //    (listItems) =>
    //      listItems.map((item) => ({
    //        name: item.textContent,
    //        id: item.id,
    //      }))
    //  );
    //  const assignedButton = assigned.find(
    //    (item) => item.name === "Last Name"
    //  );
    //  await click(page, `#${assignedButton.id}`);
    //  await typeText(page,'tbody > .AppletButtons > .siebui-popup-filter > .siebui-popup-button > .siebui-ctrl-input', 'DE')
    //  await click(page,'tbody button[name="s_3_1_5_0"]')

    //Financier Category

    // if (purchaseTypeButton.name === "Finance") {
    //   await typeText(page,'input[aria-label="Financier"]','HDFC BANK')
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
      (item) => item.name === "SC"
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
    const modelNameButton = modelName.find((item) => item.name === "DIO");
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
      (item) => item.name === "DIO DLX-BSVI"
    );
    await click(page, `#${modelVariantButton.id}`);

    //get saler name
    // await click(page, '#s_5_l > tbody > tr > td[title="RAO"]');
    // await click(
    //   page,
    //   ".siebui-popup-btm > .siebui-popup-button > #s_5_1_70_0_Ctrl"
    // );
  }

  automate();
};

//OLD CODE

// module.exports = function erp(page,{ data, modelData, dealerData }, mainWindow) {
//   // const path = require("path");
//   // const fetch = require("node-fetch");
//   // const _ = require("get-safe");
//   const {click} = require('../puppeteer-scripts/halper');
//   const navigationPromise = page.waitForNavigation();

//   const timeout = 10000000;
//   page.setDefaultTimeout(timeout);
//   page.setDefaultNavigationTimeout(timeout);

//   async function automate() {
//     await page.waitForSelector("#s_swepi_1", { visible: true });
//     await page.type("#s_swepi_1", "AS010002SA003");
//     await page.type("#s_swepi_2", "Hirise_3956");
//     const captcha = await page.$eval("#captchaCode", (el) =>
//       el.textContent.replace(/\s+/g, "")
//     );
//     await page.type("#s_captcha", captcha);
//     await page.click("#s_swepi_22");
//     // await page.waitForSelector("#s_sctrl_tabScreen > ul > li > a", {
//     //   visible: true,
//     // });
//     // const tabButtons = await page.$$eval(
//     //   "#s_sctrl_tabScreen > ul > li > a",
//     //   (options) =>
//     //     options.map((option) => ({
//     //       name: option.innerText,
//     //       id: option.id,
//     //     }))
//     // );
//     // const customerButton = tabButtons.find(
//     //   (button) => button.name === "Customer"
//     // );
//     // await page.click(`#${customerButton.id}`);

//     await navigationPromise

//     await page.waitForSelector('#s_sctrl > #s_sctrl_tabScreen #ui-id-130')
//     await page.click('#s_sctrl > #s_sctrl_tabScreen #ui-id-130')

//     // fill data select

//     //await page.waitForSelector('table > tbody > tr > .siebui-bullet-item > #s_3_2_18_0_span > .siebui-anchor-readonly > a[rowid="5"]')
//     //await page.click('table > tbody > tr > .siebui-bullet-item > #s_3_2_18_0_span > .siebui-anchor-readonly > a[rowid="5"] ')

//     //fill new reord

//     await page.waitForSelector('table > tbody > tr > .siebui-form-data > .s_2_1_19_0')
//     await page.click('table > tbody > tr > .siebui-form-data > .s_2_1_19_0')
//     await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_19_0', 'rahuli116')
//     await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_2_0', 'kumari116')
//     await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_18_0', 'kumari116')
//     await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_0_0', '2154711541')
//     await page.waitForSelector('table #s_2_1_1_0_icon')
//     await page.click('table #s_2_1_1_0_icon')
//     await page.waitForSelector('div > #\_sweview > #ui-id-178 #ui-id-183')
//     await page.click('div > #\_sweview > #ui-id-178 #ui-id-183')
//     await page.waitForSelector('table #s_2_1_3_0_icon')
//     await page.click('table #s_2_1_3_0_icon')
//     await page.waitForSelector('div > #\_sweview > #ui-id-179 #ui-id-187')
//     await page.click('div > #\_sweview > #ui-id-179 #ui-id-187')
//     await page.waitForSelector('tbody > tr > td > #s_2_1_10_0_Ctrl > span')
//     await page.click('tbody > tr > td > #s_2_1_10_0_Ctrl > span')
//     await page.waitForSelector('tbody > tr > td > .mceGridField > .s_3_1_80_0')
//     await page.click('tbody > tr > td > .mceGridField > .s_3_1_80_0')
//     await page.type('tbody > tr > td > .mceGridField > .s_3_1_80_0', 'r pd')
//     await page.waitForSelector('tbody > tr > td > .mceGridField > .s_3_1_5_0')
//     await page.click('tbody > tr > td > .mceGridField > .s_3_1_5_0')
//     await page.type('tbody > tr > td > .mceGridField > .s_3_1_5_0', 'testlane7113')
//     await page.type('tbody > tr > td > .mceGridField > .s_3_1_6_0', 'testlane6114')
//    // await page.type('tbody > tr > td > .mceGridField > .s_3_1_65_0', 'India')
//     await page.type('tbody > tr:nth-child(8) > td > .mceGridField > .siebui-ctrl-select', 'AS')
//     await page.type('tbody > tr > td > .mceGridField > .s_3_1_66_0', '781005')
//     await page.waitForSelector('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto')
//     await page.click('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto')
//     await page.type('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto', 'test7113@gmail.com')

//     //code work

//     //await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
//     //await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
//     // await page.select('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select', 'All Contacts across My Organization')
//     // await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
//     // await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')

//     //UnhandledPromiseRejectionWarning: Error: Evaluation failed: DOMException: Failed to execute 'querySelector' on 'Document': '#s_2_l > tbody > #↓ > #↓_s_2_l_First_Name > .drilldown' is not a valid selector.
//     //await page.waitFor(8000);

//      await page.waitForSelector('.ui-jqgrid-btable > tbody > .jqgrow > td[role="gridcell"] > .drilldown ')

//      await page.click('.ui-jqgrid-btable > tbody > .jqgrow > td[role="gridcell"] > .drilldown ')

//      await page.waitForSelector('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')
//      await page.click('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')

//    //await page.waitForSelector('table > tbody > tr > td > .mceField > input[name="s_1_2_64_0"]')
//   //  await page.waitForSelector('table > tbody > tr > td > .mceField > input[name="s_1_2_64_0"]')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_64_0"]', 'Phone')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_51_0"]', 'First Time Buyer')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_54_0"]', 'Friend')
//   //  //await page.waitForSelector('table > tbody > tr > td > .mceField > input[name="s_1_2_50_0"]')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_50_0"]', 'individual')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_52_0"]', 'individual')
//   //  await page.type('table > tbody > tr > td > .mceField > input[name="s_1_2_59_0"]', 'Cash')

//   //  await page.waitForSelector('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')
//   //  await page.click('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')
//    await page.waitForSelector('tbody #s_1_2_64_0_icon')
//    await page.type('tbody  input[name="s_1_2_64_0"]', 'Phone')
//    await page.waitForSelector('tbody #s_1_2_51_0_icon')
//    await page.type('tbody  input[name="s_1_2_51_0"]', 'First Time Buyer')
//    await page.waitForSelector('tbody #s_1_2_54_0_icon')
//    await page.type('tbody  input[name="s_1_2_54_0"]', 'Friend')
//    await page.waitForSelector('tbody #s_1_2_50_0_icon')
//    await page.type('tbody  input[name="s_1_2_50_0"]', 'individual')
//    await page.waitForSelector('tbody #s_1_2_52_0_icon')
//    await page.type('tbody  input[name="s_1_2_52_0"]', 'individual')
//    await page.waitForSelector('tbody #s_1_2_59_0_icon')
//    await page.type('tbody  input[name="s_1_2_59_0"]', 'Cash')

//   // await page.click('tbody #s_1_2_64_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-245 #ui-id-274')
//   // await page.click('div > #\_sweview > #ui-id-245 #ui-id-274')
//   // await page.waitForSelector('tbody #s_1_2_51_0_icon')
//   // await page.click('tbody #s_1_2_51_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-247 #ui-id-281')
//   // await page.click('div > #\_sweview > #ui-id-247 #ui-id-281')
//   // await page.waitForSelector('tbody #s_1_2_54_0_icon')
//   // await page.click('tbody #s_1_2_54_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-249 #ui-id-325')
//   // await page.click('div > #\_sweview > #ui-id-249 #ui-id-325')
//   // await page.waitForSelector('tbody #s_1_2_50_0_icon')
//   // await page.click('tbody #s_1_2_50_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-244 #ui-id-348')
//   // await page.click('div > #\_sweview > #ui-id-244 #ui-id-348')
//   // await page.waitForSelector('tbody #s_1_2_52_0_icon')
//   // await page.click('tbody #s_1_2_52_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-248 #ui-id-357')
//   // await page.click('div > #\_sweview > #ui-id-248 #ui-id-357')
//   // await page.waitForSelector('tbody #s_1_2_59_0_icon')
//   // await page.click('tbody #s_1_2_59_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-246 #ui-id-367')
//   // await page.click('div > #\_sweview > #ui-id-246 #ui-id-367')
//   // await page.waitForSelector('tbody #s_1_2_32_0_icon')
//   // await page.click('tbody #s_1_2_32_0_icon')
//   // await page.waitForSelector('div > #s_3_l #\34_s_3_l_Last_Name')
//   // await page.click('div > #s_3_l #\34_s_3_l_Last_Name')
//   // await page.waitForSelector('form #s_3_1_70_0_Ctrl')
//   // await page.click('form #s_3_1_70_0_Ctrl')
//   // await page.waitForSelector('tbody #s_1_2_35_0_icon')
//   // await page.click('tbody #s_1_2_35_0_icon')
//   // await page.waitForSelector('div > #s_4_l #\38_s_4_l_Name')
//   // await page.click('div > #s_4_l #\38_s_4_l_Name')
//   // await page.waitForSelector('.AppletStylePopup > .siebui-popup-btm > .siebui-popup-button > #s_4_1_67_0_Ctrl > span')
//   // await page.click('.AppletStylePopup > .siebui-popup-btm > .siebui-popup-button > #s_4_1_67_0_Ctrl > span')
//   // await page.waitForSelector('tbody #s_1_2_40_0_icon')
//   // await page.click('tbody #s_1_2_40_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-250 #ui-id-450')
//   // await page.click('div > #\_sweview > #ui-id-250 #ui-id-450')
//   // await page.waitForSelector('tbody #s_1_2_41_0_icon')
//   // await page.click('tbody #s_1_2_41_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-251 #ui-id-456')
//   // await page.click('div > #\_sweview > #ui-id-251 #ui-id-456')
//   // await page.waitForSelector('tbody #s_1_2_42_0_icon')
//   // await page.click('tbody #s_1_2_42_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-252 #ui-id-463')
//   // await page.click('div > #\_sweview > #ui-id-252 #ui-id-463')
//   // await page.waitForSelector('tbody #s_1_2_49_0_icon')
//   // await page.click('tbody #s_1_2_49_0_icon')
//   // await page.waitForSelector('div > #\_sweview > #ui-id-253 #ui-id-469')
//   // await page.click('div > #\_sweview > #ui-id-253 #ui-id-469')

//   }

//   automate();
// };
