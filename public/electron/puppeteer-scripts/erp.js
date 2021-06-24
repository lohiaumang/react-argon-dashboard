module.exports = function erp(page, data, mainWindow) {
  console.log(typeof page, Object.keys(data), typeof mainWindow);
  // const path = require("path");
  // const fetch = require("node-fetch");
  // const _ = require("get-safe");

  const timeout = 10000000;
  await page.setDefaultTimeout(timeout);
  await page.setDefaultNavigationTimeout(timeout);

  await page.waitForSelector("#s_swepi_1", { visible: true });
  await page.type("#s_swepi_1", data.credential.username);
  await page.type("#s_swepi_2", data.credential.password);
  //   const captcha = await page.$eval("#captchaCode", (el) =>
  //     el.textContent.replace(/\s+/g, "")
  //   );
  //   await page.type("#s_captcha", captcha);
  //   await page.click("#s_swepi_22");
  //   await page.waitForSelector("#s_sctrl_tabScreen > ul > li > a", {
  //     visible: true,
  //   });
  //   const tabButtons = await page.$$eval(
  //     "#s_sctrl_tabScreen > ul > li > a",
  //     (options) =>
  //       options.map((option) => ({
  //         name: option.innerText,
  //         id: option.id,
  //       }))
  //   );
  //   const customerButton = tabButtons.find(
  //     (button) => button.name === "Customer"
  //   );
  //   await page.waitForSelector(".siebui-busy", { hidden: true });
  //   await page.click(`#${customerButton.id}`);
  // }

  // automate();
};
