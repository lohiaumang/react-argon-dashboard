module.exports = function erp(page, data, mainWindow, erpWindow, systemConfig) {
  const { click, typeText } = require("./helper");
  const { enquiryType, customerCategory } = require("../enums");

  const {
    credentials: { username, password },
  } = data;

  let timeout = systemConfig.erpTimeOut;

  //const navigationPromise = page.waitForNavigation();

  // function catchRequests(page, reqs = 0) {
  //   const started = () => (reqs = reqs + 1);
  //   const ended = () => (reqs = reqs - 1);
  //   page.on("request", started);
  //   page.on("requestfailed", ended);
  //   page.on("requestfinished", ended);
  //   return async (timeout = 5000, success = false) => {
  //     while (true) {
  //       if (reqs < 1) break;
  //       await new Promise((yay) => setTimeout(yay, 100));
  //       if ((timeout = timeout - 100) < 0) {
  //         throw new Error("Timeout");
  //       }
  //     }
  //     page.off("request", started);
  //     page.off("requestfailed", ended);
  //     page.off("requestfinished", ended);
  //   };
  // }

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

  async function automate() {
    let done = false;
    let hsnCode = "";
    let invoiceNo = "";

    erpWindow.on("close", async (e) => {
      e.preventDefault();
      let tOutId = setTimeout(() => erpWindow.destroy(), 3000);

      let url = "";
      const loginUrl =
        "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/?SWECmd=Login&SWECM=S&SRN=&SWEHo=hirise.honda2wheelersindia.com";

      try {
        url = (await page.evaluate(() => window.location.href)) || "";
      } catch (err) {
        console.log("Unable to get current url: ", err);
        erpWindow.destroy();
        clearTimeout(tOutId);
      }

      if (url && !url.startsWith(loginUrl)) {
        try {
          await page.waitForSelector("#tb_0");
          await page.click("#tb_0");
          await page.waitForSelector("button[title='Logout']");
          await page.click("button[title='Logout']");
        } catch (err) {
          console.log("Unable to log out: ", err);
          erpWindow.destroy();
          clearTimeout(tOutId);
        }
      }

      erpWindow.destroy();
      clearTimeout(tOutId);

      mainWindow.webContents.send("fromMain", {
        type: done ? "INVOICE_CREATED" : "DO_CREATED",
        data: { hsnCode, invoiceNo },
      });
    });

    // Wait for navigation.

    try {
      await page.waitForSelector("#s_swepi_2");
      await page.click("#s_swepi_2");
      if (username && password) {
        await typeText(page, "#s_swepi_1", username);
        await typeText(page, "#s_swepi_2", password);

        const captcha = await page.$eval("#captchaCode", (el) =>
          el.textContent.replace(/\s+/g, "")
        );

        await typeText(page, "#s_captcha", captcha);
        // await page.waitForNavigation();
        await click(page, "#s_swepi_22");
      }
      await waitForNetworkIdle(page, timeout, 0);

      await page.waitForSelector("div[title='First Level View Bar']", {
        visible: true,
      });
      const customerTabs = await page.$$eval(
        "div[title='First Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );
      const customerButton = customerTabs.find((item) =>
        item.name.includes("Customer")
      );
      await page.waitForSelector(`#${customerButton.id}`, { visible: true });
      await page.$eval(`#${customerButton.id}`, (el) => el.click());
      await waitForNetworkIdle(page, timeout, 0);
      await typeText(
        page,
        'input[name="s_5_1_12_0"]',
        data.customerInfo.firstName
      );
      await typeText(
        page,
        'input[name="s_5_1_8_0"]',
        data.customerInfo.lastName
      );
      await typeText(
        page,
        'input[name="s_5_1_0_0"]',
        data.customerInfo.phoneNo
      );
      await waitForNetworkIdle(page, timeout, 0);
      await click(page, 'button[name="s_5_1_10_0"]');
      await waitForNetworkIdle(page, timeout, 0);

      await page.waitForSelector('select[title="Visibility"]', {
        visible: true,
      });

      const cName = await page.evaluate(
        () => document.querySelector("input[aria-label='First Name']").value
      );
      console.log(cName, "print cName");
      if (!cName) {
        console.log(cName, "print customer name");
        await page.waitForSelector("div[title='Second Level View Bar']", {
          visible: true,
        });
        const homeTabs = await page.$$eval(
          "div[title='Second Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
          (tabs) =>
            tabs.map((tab) => {
              return {
                name: tab.textContent,
                id: tab.id,
              };
            })
        );
        const homeButton = homeTabs.find((item) =>
          item.name.includes("Customer Home")
        );
        await page.$eval(`#${homeButton.id}`, (el) => el.click());
        await waitForNetworkIdle(page, timeout, 0);
        // await page.waitForResponse(
        //   "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/?SWECmd=GetViewLayout&SWEView=Contact%20Screen%20Homepage%20View&SWEVI=&SWEVLC=1-NYJWBA7_Siebel+eDealer_1%7c1552926410%7c1627462847_0_23073__L&SWEApplet=undefined&LayoutIdentifier="
        // );

        await page.waitForSelector(
          'form[name="SWEForm2_0"] input[aria-label="First Name"]',
          { visible: true }
        );

        await typeText(
          page,
          'form[name="SWEForm2_0"] input[aria-label="First Name"]',
          data.customerInfo.firstName
        );

        await page.waitForSelector(
          'form[name="SWEForm2_0"] input[aria-label="Last Name"]',
          { visible: true }
        );

        await typeText(
          page,
          'form[name="SWEForm2_0"] input[aria-label="Last Name"]',
          data.customerInfo.lastName
        );

        await page.waitForSelector('input[name="s_2_1_0_0"]', {
          visible: true,
        });

        await typeText(
          page,
          'input[name="s_2_1_0_0"]',
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
        const collingTypeButton = callingType.find(
          (item) => item.name === "No"
        ); //todo
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
        await click(page, 'button[title="Add:Add & Go"]');

        await typeText(
          page,
          'input[aria-label="Relative Name"]',
          data.customerInfo.swdo
        );
        await typeText(
          page,
          'input[aria-label="Date Of Birth"]',
          data.customerInfo.dob
        );
        await typeText(
          page,
          'input[aria-label="Address 1"]',
          data.customerInfo.currLineOne
        );
        await typeText(
          page,
          'input[aria-label="Address 2"]',
          data.customerInfo.currLineTwo + ", " + data.customerInfo.currPS
        );

        //select state
        await click(page, 'input[aria-label="State"] + span');
        await page.waitForSelector(
          "ul[role='combobox']:not([style*='display: none'])",
          { visible: true }
        );
        let state = await page.$$eval(
          "ul[role='combobox']:not([style*='display: none']) > li > div",
          (listItems) =>
            listItems.map((item) => {
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
        await page.waitForSelector(`#${stateButton.id}`, { visible: true });
        await page.$eval(`#${stateButton.id}`, (el) => el.click());

        await typeText(
          page,
          'input[aria-label="Zip/Pin Code"]',
          data.customerInfo.currPostal
        );

        await typeText(
          page,
          'input[aria-label="Email"]',
          data.customerInfo.email
        );
        await click(page, 'table[summary="View All Contacts"] td[title] a');
      } else {
        await waitForNetworkIdle(page, timeout, 0);
        await click(page, 'select[name="s_vis_div"]');
        await page.select(
          'select[name="s_vis_div"]',
          "All Contacts across My Organization"
        );
        await page.click(
          'select[name="s_vis_div"]',
          "All Contacts across My Organization"
        );

        await waitForNetworkIdle(page, timeout, 0);

        await page.waitForSelector(
          "div[title='Contacts List Applet'] .AppletHIListBorder",
          { visible: true }
        );

        const userExists = await page.evaluate(
          () =>
            !!document.querySelector(
              'table[summary="View All Contacts"] td[title] a',
              {
                waitUntil: "networkidle2",
              }
            )
        );
        // TODO: USER CHECK
        // await waitForNetworkIdle(page, timeout, 0);
        if (userExists) {
          await click(page, 'table[summary="View All Contacts"] td[title] a');

          await waitForNetworkIdle(page, timeout, 0);
          const fillData = async (selector, value) => {
            console.log(selector, value);
            if (selector && value) {
              await page.waitForFunction(
                (selector) => !!document.querySelector(selector),
                {},
                selector
              );
              await page.waitForFunction(
                (selector) => !document.querySelector(selector).disabled,
                {},
                selector
              );
              await page.evaluate(
                (selector) => (document.querySelector(selector).value = ""),
                selector
              );
              await typeText(page, selector, value);
            }
          };
          await waitForNetworkIdle(page, timeout, 0);
          await fillData(
            'input[aria-label="First Name"]',
            data.customerInfo.firstName
          );

          await fillData(
            'input[aria-label="Last Name"]',
            data.customerInfo.lastName
          );

          await fillData(
            'input[aria-label="Relative Name"]',
            data.customerInfo.swdo
          );

          // Gender vvvvvv
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
          // Gender ^^^^^^

          await fillData(
            'input[aria-label="Date Of Birth"]',
            data.customerInfo.dob
          );

          await fillData(
            'input[aria-label="Address 1"]',
            data.customerInfo.currLineOne
          );

          await fillData(
            'input[aria-label="Address 2"]',
            data.customerInfo.currLineTwo + ", " + data.customerInfo.currPS
          );

          await fillData(
            'input[aria-label="State"]',
            data.customerInfo.currState.slice(0, 2).toUpperCase()
          );

          await fillData(
            'input[aria-label="Zip/Pin Code"]',
            data.customerInfo.currPostal
          );

          await fillData('input[aria-label="Email', data.customerInfo.email);
        }
      }
      // TODO: ENQUIRY EXIST CHECK
      const enquiryExists = await page.evaluate(
        () => !!document.querySelector('table[summary="Enquiries"] td a')
      );

      if (enquiryExists) {
        await click(page, 'table[summary="Enquiries"] td a');
      } else {
        await waitForNetworkIdle(page, timeout, 0);
        await click(page, 'button[title="Enquiries:New"]');

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
          item.name
            .toUpperCase()
            .includes(data.customerInfo.source.toUpperCase())
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
        console.log(data.additionalInfo.financier);
        const purchaseType = !!data.additionalInfo.financier //("HDFC")
          ? "Finance"
          : "Cash";

        purchaseTypeButton = purchaseTypes.find(
          (item) => item.name.toUpperCase() === purchaseType.toUpperCase()
        );
        await click(page, `#${purchaseTypeButton.id}`);

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

        //Select Finencer
        if (data.additionalInfo.financier) {
          // await click(page, 'span[aria-label="Selection Field"]');
          // await click(page, 'button[aria-label="Pick Financier:Query"]');
          // await typeText(page, 'input[aria-labelledby="s_6_l_Name "]', data.additionalInfo.financier);
          // await click(page, 'button[aria-label="Pick Financier:Go"]');
          // await click(page, 'button[aria-label="Pick Financier:OK"]');
          await typeText(
            page,
            'input[aria-label="Financier"]',
            data.additionalInfo.financier
          );

          //Model Variant
          await click(page, 'input[aria-label="Counter/Non-Counter"]+span');
          await page.waitForSelector(
            "ul[role='combobox']:not([style*='display: none'])",
            { visible: true }
          );
          let saleType = await page.$$eval(
            "ul[role='combobox']:not([style*='display: none']) > li > div",
            (listItems) =>
              listItems.map((item) => ({
                name: item.textContent,
                id: item.id,
              }))
          );
          const saleTypeButton = saleType.find(
            (item) => item.name === "Counter Sale"
          );
          await click(page, `#${saleTypeButton.id}`);
        }

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
        const firstName = data.user.name.split(" ");
        await typeText(
          page,
          "input[name='Last_Name']",
          firstName[0].toUpperCase()
        );
        await click(page, '#s_3_l > tbody > tr > td[id="1_s_3_l_First_Name"] ');

        await typeText(
          page,
          '#s_3_l > tbody > tr > td[id="1_s_3_l_First_Name"] > input[name="First_Name"]',
          firstName[1].toUpperCase()
        );
        await click(
          page,
          'table > tbody > tr > .siebui-popup-action > .siebui-popup-button > button[aria-label="Pick Assigned To:Go"]'
        );
        await click(
          page,
          'table > tbody > tr > td > .siebui-popup-button > button[aria-label="Pick Assigned To:Query"]'
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

        await page.waitForSelector("td[role='gridcell'] > a", {
          visible: true,
        });
        await page.$eval("td[role='gridcell'] > a", (el) => el.click());
      }

      await waitForNetworkIdle(page, timeout, 0);

      await page.waitForSelector("div[title='Third Level View Bar']", {
        visible: true,
      });

      const allTabs = await page.$$eval(
        "div[title='Third Level View Bar'] a",
        (tabs) =>
          tabs.map((tab) => {
            return {
              name: tab.textContent,
              id: tab.id,
            };
          })
      );

      console.log(JSON.stringify(allTabs));
      const expressBookingButton = allTabs.find((item) =>
        item.name.includes("Express Booking")
      );
      await page.$eval(`#${expressBookingButton.id}`, (el) => el.click());
      await page.waitForNavigation();
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
      console.log(deliveryDate);

      await page.waitForSelector('input[name="s_1_1_38_0"]', {
        visible: true,
      });

      const dDate = await page.evaluate(
        () => document.querySelector('input[name="s_1_1_38_0"]').value
      );
      if (!dDate) {
        await typeText(page, 'input[name="s_1_1_38_0"]', deliveryDate);
      }
      //todo
      // await page.waitForResponse(
      //   "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/"
      // );
      await waitForNetworkIdle(page, timeout, 0);
      await page.waitForSelector(
        ".AppletButtons.siebui-applet-buttons > button",
        {
          visible: true,
        }
      );

      await click(page, ".AppletButtons.siebui-applet-buttons > button"); //get price clcik
      await page.waitForFunction(
        () =>
          document.querySelector('input[aria-label="Balance Payment"]')
            .value !== "Rs.0.00"
      );

      let price = await page.evaluate(
        () =>
          document.querySelector('input[aria-label="Balance Payment"]').value
      );

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

      await click(
        page,
        '#s_2_l > tbody > tr[role="row"] > td[aria-labelledby="s_2_l_altCalc"]',
        { visible: true }
      );
      await typeText(
        page,
        'input[aria-labelledby="s_2_l_Transaction_Amount s_2_l_altCalc"]',
        price
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
      await click(
        page,
        '.siebui-btn-grp-applet > button[aria-label="Payment Lines:New"]'
      );
      await click(
        page,
        'div > button[aria-label="Line Items:Vehicle Allotment"]'
      );
      await page.waitForSelector("td[id='1_s_1_l_TMI_HSN']");
      //Here get hsn code
      await page.waitForFunction(
        () => !!document.querySelector('td[id="1_s_1_l_TMI_HSN"]').textContent
      );
      hsnCode = await page.evaluate(
        () => document.querySelector('td[id="1_s_1_l_TMI_HSN"]').textContent
      );
      await click(page, 'div > button[aria-label="Vehicles:New"]');
      // await page.waitForTimeout(3000);
      // let hsnCode = await page.evaluate(
      //   () => document.querySelector('td[id="1_s_1_l_TMI_HSN"]').textContent
      // );
      await click(
        page,
        '#s_3_l > tbody > tr[role="row"] > td[data-labelledby=" s_3_l_Serial_Number s_3_l_altpick"]',
        { visible: true }
      );
      if (data.vehicleInfo.frameNumber) {
        await typeText(
          page,
          'input[aria-labelledby=" s_3_l_Serial_Number s_3_l_altpick"]',
          data.vehicleInfo.frameNumber
        ); //todo not fill
        await click(page, 'div > button[aria-label="Vehicles:New"]');
        await page.goBack();

        //Invoice Click

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
        //Invoice End

        await page.waitForFunction(
          () =>
            !!document.querySelector("input[name='TMI_Invoice_Number']").value,
          { timeout: 360000 }
        );

        invoiceNo = await page.evaluate(
          () => document.querySelector("input[name='TMI_Invoice_Number']").value
        );
      }
      // await page.goBack();

      // await page.waitForSelector("div[title='Third Level View Bar']", {
      //   visible: true,
      // });
      // const invoiceTabs = await page.$$eval(
      //   "div[title='Third Level View Bar'] .ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab > a",
      //   (tabs) =>
      //     tabs.map((tab) => {
      //       return {
      //         name: tab.textContent,
      //         id: tab.id,
      //       };
      //     })
      // );
      // const invoiceButton = invoiceTabs.find((item) =>
      //   item.name.includes("Invoice")
      // );
      // await page.$eval(`#${invoiceButton.id}`, (el) => el.click());

      // await click(
      //   page,
      //   'div > button[aria-label="Sales Invoice:Generate Invoice"]'
      // );
      // //date 10-07-2021
      // await click(
      //   page,
      //   'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="1_s_2_l_TMI_Ref_Number s_2_l_TMI_Invoice_Key_No "]'
      // );
      // await typeText(page, 'input[name="TMI_Invoice_Key_No"]', "7078"); //todo add key no mobile app and db
      // await click(
      //   page,
      //   'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Faktur_Number "]'
      // );
      // await typeText(
      //   page,
      //   'input[name="TMI_Faktur_Number"]',
      //   "M7C1P6588237C13"
      // ); //todo add battery number mobile app and db
      // await click(
      //   page,
      //   'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Booklet_Number "]'
      // );
      // await typeText(page, 'input[name="TMI_Booklet_Number"]', "0"); //todo add Booklet number mobile app and db
      // await click(
      //   page,
      //   'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_Riding_Trainer_Flag s_2_l_altCombo"]'
      // ); //todo add riding number mobile app and db
      // await page.waitForSelector(
      //   "ul[role='combobox']:not([style*='display: none'])",
      //   { visible: true }
      // );
      // let ridingType = await page.$$eval(
      //   "ul[role='combobox']:not([style*='display: none']) > li > div",
      //   (listItems) =>
      //     listItems.map((item) => {
      //       return {
      //         name: item.textContent,
      //         id: item.id,
      //       };
      //     })
      // );
      // const ridingTypeButton = ridingType.find((item) => item.name === "N");

      // await page.waitForSelector(`#${ridingTypeButton.id}`, { visible: true });
      // await page.$eval(`#${ridingTypeButton.id}`, (el) => el.click());
      // await click(
      //   page,
      //   'table[summary="Sales Invoice"] > tbody > tr[role="row"] > td[data-labelledby="s_2_l_TMI_PDSA_Flag s_2_l_altCombo"]'
      // ); //todo add pdsaGiven  mobile app and db
      // await page.waitForSelector(
      //   "ul[role='combobox']:not([style*='display: none'])",
      //   { visible: true }
      // );
      // let pdsaGiven = await page.$$eval(
      //   "ul[role='combobox']:not([style*='display: none']) > li > div",
      //   (listItems) =>
      //     listItems.map((item) => {
      //       return {
      //         name: item.textContent,
      //         id: item.id,
      //       };
      //     })
      // );
      // const pdsaGivenpdsaGiven = pdsaGiven.find((item) => item.name === "N");

      // await page.waitForSelector(`#${pdsaGivenpdsaGiven.id}`, {
      //   visible: true,
      // });
      // await page.$eval(`#${pdsaGivenpdsaGiven.id}`, (el) => el.click());
      // await page.waitForSelector("td[role='gridcell'] > a", { visible: true });
      // await page.$eval("td[role='gridcell'] > a", (el) => el.click());
      // await click(page, 'div > button[data-display="Permanent Invoice"]');
      // await browser.close();
      done = true;
    } catch (err) {
      console.log(err);
    }
  }

  automate();
};
