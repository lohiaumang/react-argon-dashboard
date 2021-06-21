module.exports = function erp(
  page,
  { data, modelData, dealerData },
  mainWindow
) {
  const path = require("path");
  const fetch = require("node-fetch");
  const _ = require("get-safe");

  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  async function automate() {
    await page.waitForSelector("#s_swepi_1", { visible: true });
    await page.type("#s_swepi_1", dealerData.erpUsername);
    await page.type("#s_swepi_2", dealerData.erpPassword);
    const captcha = await page.$eval("#captchaCode", (el) =>
      el.textContent.replace(/\s+/g, "")
    );
    await page.type("#s_captcha", captcha);
    await page.click("#s_swepi_22");
    await page.waitForSelector("#s_sctrl_tabScreen > ul > li > a", {
      visible: true,
    });
    const tabButtons = await page.$$eval(
      "#s_sctrl_tabScreen > ul > li > a",
      (options) =>
        options.map((option) => ({
          name: option.innerText,
          id: option.id,
        }))
    );
    const customerButton = tabButtons.find(
      (button) => button.name === "Customer"
    );
    await page.waitForSelector(".siebui-busy", { hidden: true });
    await page.click(`#${customerButton.id}`);
  }

  automate();
};
