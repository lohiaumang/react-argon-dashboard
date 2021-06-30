module.exports = function erp(page,{ data, modelData, dealerData }, mainWindow) {
  // const path = require("path");
  // const fetch = require("node-fetch");
  // const _ = require("get-safe");
  const navigationPromise = page.waitForNavigation();

  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  async function automate() {
    await page.waitForSelector("#s_swepi_1", { visible: true });
    await page.type("#s_swepi_1", "AS010002SA003");
    await page.type("#s_swepi_2", "Hirise_3956");
    const captcha = await page.$eval("#captchaCode", (el) =>
      el.textContent.replace(/\s+/g, "")
    );
    await page.type("#s_captcha", captcha);
    await page.click("#s_swepi_22");
    // await page.waitForSelector("#s_sctrl_tabScreen > ul > li > a", {
    //   visible: true,
    // });
    // const tabButtons = await page.$$eval(
    //   "#s_sctrl_tabScreen > ul > li > a",
    //   (options) =>
    //     options.map((option) => ({
    //       name: option.innerText,
    //       id: option.id,
    //     }))
    // );
    // const customerButton = tabButtons.find(
    //   (button) => button.name === "Customer"
    // );
    // await page.click(`#${customerButton.id}`);

    await navigationPromise
  
    await page.waitForSelector('#s_sctrl > #s_sctrl_tabScreen #ui-id-130')
    await page.click('#s_sctrl > #s_sctrl_tabScreen #ui-id-130')
    await page.waitForSelector('table > tbody > tr > .siebui-form-data > .s_2_1_19_0')
    await page.click('table > tbody > tr > .siebui-form-data > .s_2_1_19_0')
    await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_19_0', 'rahul3')
    await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_2_0', 'kumar3')
    await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_18_0', 'kumar3')
    await page.type('table > tbody > tr > .siebui-form-data > .s_2_1_0_0', '2154654541')
    await page.waitForSelector('table #s_2_1_1_0_icon') 
    await page.click('table #s_2_1_1_0_icon')
    await page.waitForSelector('div > #\_sweview > #ui-id-178 #ui-id-183')
    await page.click('div > #\_sweview > #ui-id-178 #ui-id-183')
    await page.waitForSelector('table #s_2_1_3_0_icon')
    await page.click('table #s_2_1_3_0_icon')
    await page.waitForSelector('div > #\_sweview > #ui-id-179 #ui-id-187')
    await page.click('div > #\_sweview > #ui-id-179 #ui-id-187')
    await page.waitForSelector('tbody > tr > td > #s_2_1_10_0_Ctrl > span')
    await page.click('tbody > tr > td > #s_2_1_10_0_Ctrl > span')
    await page.waitForSelector('tbody > tr > td > .mceGridField > .s_3_1_80_0')
    await page.click('tbody > tr > td > .mceGridField > .s_3_1_80_0')
    await page.type('tbody > tr > td > .mceGridField > .s_3_1_80_0', 'ramashankar pd')
    await page.waitForSelector('tbody > tr > td > .mceGridField > .s_3_1_5_0')
    await page.click('tbody > tr > td > .mceGridField > .s_3_1_5_0')
    await page.type('tbody > tr > td > .mceGridField > .s_3_1_5_0', 'testlane3')
    await page.type('tbody > tr > td > .mceGridField > .s_3_1_6_0', 'testlane3')
   // await page.type('tbody > tr > td > .mceGridField > .s_3_1_65_0', 'India')
    await page.type('tbody > tr:nth-child(8) > td > .mceGridField > .siebui-ctrl-select', 'AS')
    await page.type('tbody > tr > td > .mceGridField > .s_3_1_66_0', '781005')
    await page.waitForSelector('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto')
    await page.click('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto')
    await page.type('tbody > tr > td > .mceGridField > .siebui-ctrl-mailto', 'test13@gmail.com')
    await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    await page.select('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select', 'All Contacts across My Organization')
    await page.waitForSelector('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')
    await page.click('.AppletStyleParent77 > div > .siebui-applet-header > #s_vis_div > select')


    //UnhandledPromiseRejectionWarning: Error: Evaluation failed: DOMException: Failed to execute 'querySelector' on 'Document': '#s_2_l > tbody > #↓ > #↓_s_2_l_First_Name > .drilldown' is not a valid selector.

    await page.waitForSelector('#s_2_l > tbody > #\31 > #\31_s_2_l_First_Name > .drilldown')
    await page.click('#s_2_l > tbody > #\31 > #\31_s_2_l_First_Name > .drilldown')


  
  // await page.waitForSelector('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')
  // await page.click('div > .siebui-applet-header > .siebui-btn-grp-applet > #s_1_1_20_0_Ctrl > span')
  // await page.waitForSelector('tbody #s_1_2_64_0_icon')
  // await page.click('tbody #s_1_2_64_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-245 #ui-id-274')
  // await page.click('div > #\_sweview > #ui-id-245 #ui-id-274')
  // await page.waitForSelector('tbody #s_1_2_51_0_icon')
  // await page.click('tbody #s_1_2_51_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-247 #ui-id-281')
  // await page.click('div > #\_sweview > #ui-id-247 #ui-id-281')
  // await page.waitForSelector('tbody #s_1_2_54_0_icon')
  // await page.click('tbody #s_1_2_54_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-249 #ui-id-325')
  // await page.click('div > #\_sweview > #ui-id-249 #ui-id-325')
  // await page.waitForSelector('tbody #s_1_2_50_0_icon')
  // await page.click('tbody #s_1_2_50_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-244 #ui-id-348')
  // await page.click('div > #\_sweview > #ui-id-244 #ui-id-348')
  // await page.waitForSelector('tbody #s_1_2_52_0_icon')
  // await page.click('tbody #s_1_2_52_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-248 #ui-id-357')
  // await page.click('div > #\_sweview > #ui-id-248 #ui-id-357')
  // await page.waitForSelector('tbody #s_1_2_59_0_icon')
  // await page.click('tbody #s_1_2_59_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-246 #ui-id-367')
  // await page.click('div > #\_sweview > #ui-id-246 #ui-id-367')
  // await page.waitForSelector('tbody #s_1_2_32_0_icon')
  // await page.click('tbody #s_1_2_32_0_icon')
  // await page.waitForSelector('div > #s_3_l #\34_s_3_l_Last_Name')
  // await page.click('div > #s_3_l #\34_s_3_l_Last_Name')
  // await page.waitForSelector('form #s_3_1_70_0_Ctrl')
  // await page.click('form #s_3_1_70_0_Ctrl')
  // await page.waitForSelector('tbody #s_1_2_35_0_icon')
  // await page.click('tbody #s_1_2_35_0_icon')
  // await page.waitForSelector('div > #s_4_l #\38_s_4_l_Name')
  // await page.click('div > #s_4_l #\38_s_4_l_Name')
  // await page.waitForSelector('.AppletStylePopup > .siebui-popup-btm > .siebui-popup-button > #s_4_1_67_0_Ctrl > span')
  // await page.click('.AppletStylePopup > .siebui-popup-btm > .siebui-popup-button > #s_4_1_67_0_Ctrl > span')
  // await page.waitForSelector('tbody #s_1_2_40_0_icon')
  // await page.click('tbody #s_1_2_40_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-250 #ui-id-450')
  // await page.click('div > #\_sweview > #ui-id-250 #ui-id-450')
  // await page.waitForSelector('tbody #s_1_2_41_0_icon')
  // await page.click('tbody #s_1_2_41_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-251 #ui-id-456')
  // await page.click('div > #\_sweview > #ui-id-251 #ui-id-456')
  // await page.waitForSelector('tbody #s_1_2_42_0_icon')
  // await page.click('tbody #s_1_2_42_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-252 #ui-id-463')
  // await page.click('div > #\_sweview > #ui-id-252 #ui-id-463')
  // await page.waitForSelector('tbody #s_1_2_49_0_icon')
  // await page.click('tbody #s_1_2_49_0_icon')
  // await page.waitForSelector('div > #\_sweview > #ui-id-253 #ui-id-469')
  // await page.click('div > #\_sweview > #ui-id-253 #ui-id-469')

 
    
  }

  automate();
};
