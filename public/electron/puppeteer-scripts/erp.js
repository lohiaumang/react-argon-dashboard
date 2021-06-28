module.exports = function erp(
  page,
  { data, modelData, dealerData },
  mainWindow
) {
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
    await page.type("#s_swepi_2", "Hirise_2286");
    const captcha = await page.$eval("#captchaCode", (el) =>
      el.textContent.replace(/\s+/g, "")
    );
    await page.type("#s_captcha", captcha);
    await page.click("#s_swepi_22");
    await navigationPromise;
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

    await page.waitForSelector("#s_sctrl > #s_sctrl_tabScreen #ui-id-130");
    await page.click("#s_sctrl > #s_sctrl_tabScreen #ui-id-130");

    // await page.waitForSelector(".siebui-busy", { hidden: true });

    //await page.waitForSelector(".siebui-busy", { hidden: false });
    await page.waitForSelector("table > tbody > tr > .siebui-form-data > .s_2_1_19_0");
    await page.click("table > tbody > tr > .siebui-form-data > .s_2_1_19_0");
    await page.type("table > tbody > tr > .siebui-form-data > .s_2_1_19_0","rahul");
    await page.type("table > tbody > tr > .siebui-form-data > .s_2_1_2_0","kumar");
    await page.type("table > tbody > tr > .siebui-form-data > .s_2_1_18_0","kumar");
    await page.type("table > tbody > tr > .siebui-form-data > .s_2_1_0_0","8882148890");
    await page.waitForSelector("table #s_2_1_1_0_icon");
    await page.click("table #s_2_1_1_0_icon");
    await page.waitForSelector("div > #_sweview > #ui-id-178 #ui-id-183");
    await page.click("div > #_sweview > #ui-id-178 #ui-id-183");
    await page.waitForSelector("table #s_2_1_3_0_icon");
    await page.click("table #s_2_1_3_0_icon");
    await page.waitForSelector("div > #_sweview > #ui-id-179 #ui-id-187");
    await page.click("div > #_sweview > #ui-id-179 #ui-id-187");
  }

  automate();
};
