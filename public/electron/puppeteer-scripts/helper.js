module.exports = {
  click: async function (page, selector) {
    try {
      await page.waitForSelector(selector, { visible: true });
      await page.click(selector);
    } catch (error) {
      throw new Error(`Could not click on the selector - ${selector}`);
    }
  },

  typeText: async function (page, selector, text) {
    try {
      await page.waitForSelector(selector, { visible: true });
      await page.type(selector, text);
    } catch (error) {
      throw new Error(
        `Something went wrong, selector - ${selector}, and text - ${text} \n Error: ${eror}`
      );
    }
  },

  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (element) => element.textContent);
    } catch (error) {
      throw new Error(
        `Could not get text from selector ${selector} \n Error: ${eror}`
      );
    }
  },

  // getCount: async function (page, selector) {
  //   try {
  //     await page.waitForSelector(selector);
  //     return page.$$eval(selector, (element) => element.length);
  //   } catch (error) {
  //     throw new Error(Could not find the element " + { selector });
  //   }
  // },

  // waitForText: async function (page, selector, text) {
  //   try {
  //     await page.waitForSelector(selector);
  //     await page.waitForFunction(selector, (text) => {
  //       document.querySelector(selector).innerText.includes(text),
  //         {},
  //         selector,
  //         text;
  //     });
  //   } catch (error) {
  //     throw new Error("Could not find the element waitForText");
  //   }
  // },

  // shouldNotExist: async function (page, selector) {
  //   try {
  //     await page.waitForSelector(selector, { hiddern: true });
  //   } catch (error) {
  //     throw new Error("Could not find the element shouldNotExist");
  //   }
  // },
};
