module.exports = function vahan(page, data, win) {
  const electron = require("electron");
  const ipc = electron.ipcRenderer;
  // const path = require("path");
  // const fetch = require("node-fetch");
  // const _ = require("get-safe");
  // Imports the Google Cloud client library
  // const vision = require("@google-cloud/vision");
  //console.log(data);

  const timeout = 10000000;
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  // Extract invoice date

  let deliveryDate = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");
  let invoiceDateArray = deliveryDate.split(" ")[0].split("/");

  if (invoiceDateArray[2].length < 4) {
    invoiceDateArray[2] = `20${invoiceDateArray[2]}`;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const invoiceDate = new Date(
    invoiceDateArray[2],
    new Number(invoiceDateArray[1]) - 1,
    invoiceDateArray[0]
  );

  // function fetch_retry(url, options, n) {
  //   return new Promise(function (resolve, reject) {
  //     fetch(url, options)
  //       .then((res) => res.json()) // <--- Much cleaner!
  //       .catch(function (error) {
  //         if (n === 1) return reject(error);
  //         fetch_retry(url, options, n - 1)
  //           .then(resolve)
  //           .catch(reject);
  //       })
  //       .then(resolve);
  //   });
  // }

  async function waitForRandom() {
    await page.waitForTimeout((Math.random() + 1) * 1000);
  }

  function randomTypeDelay() {
    return 0;
    // Incase we need a delay vvv
    // return Math.random() * 100;
  }

  const {
    credentials: { username, password, otp },
  } = data;

  const automate = async function () {
    try {
      if (username && password && otp) {
        ipc.send("vahan-done");

        await page.waitForNavigation();
        await page.waitForSelector("#user_id", { visible: true });
        await waitForRandom();
        await page.type("#user_id", username, {
          delay: randomTypeDelay(),
        });
        // let captcha = await page.$('#loginPanel img.bottom-space');

        // while(captcha) {
        //   const captchaLocation = await captcha.boxModel();
        //   await page.screenshot({
        //     path: path.join(__dirname, "../assets/captcha/captchaImage.png"),
        //     clip: {
        //       x: captchaLocation.content[0].x,
        //       y: captchaLocation.content[0].y,
        //       width: captchaLocation.width,
        //       height: captchaLocation.height
        //     }
        //   });

        //   const client = new vision.ImageAnnotatorClient();
        //   const fileName = path.join(__dirname, "../assets/captcha/captchaImage.png");
        //   const [result] = await client.textDetection(fileName);
        //   const detections = result.textAnnotations;

        //   await page.waitForSelector("#loginPanel img.bottom-space ~ input", { visible: true });
        //   await page.type("#loginPanel img.bottom-space ~ input", detections[0].description);
        //   await page.waitForSelector("button[type='submit']", { visible: true });
        //   await page.click("button[type='submit']");
        //   await waitForRandom();
        //   captcha = await page.$('#loginPanel img.bottom-space');
        // }

        await page.waitForSelector("#passwordID", { visible: true });
        await waitForRandom();
        await page.type("#passwordID", password, {
          delay: randomTypeDelay(),
        });
        await waitForRandom();
        await page.click("#submit_form");
        await page.waitForSelector("#otp_text", { visible: true });
        await waitForRandom();
        await page.type("#otp_text", otp, {
          delay: randomTypeDelay(),
        });
        await waitForRandom();
        await page.click("#login");
      }

      await page.waitForNavigation();
      await page.waitForSelector("#actionList_label", { visible: true });
      await waitForRandom();
      await page.click("#actionList_label");
      await waitForRandom();
      await page.waitForSelector("#actionList_6", { visible: true });
      await page.click("#actionList_6");
      await waitForRandom();
      await page.click("#pending_action");

      //win.webContents.send("update-progress-bar", ["10%", "vahan"]);

      await page.waitForSelector("#chasi_no_new_entry", { visible: true });
      await waitForRandom();
      await page.type("#chasi_no_new_entry", data.vehicleInfo.frameNumber, {
        delay: randomTypeDelay(),
      });
      await waitForRandom();
      await page.type(
        "#eng_no_new_entry",
        data.vehicleInfo.engineNumber.substr(
          data.vehicleInfo.engineNumber.length - 5
        ),
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.click("#get_dtls_btn");

      //win.webContents.send("update-progress-bar", ["20%", "vahan"]);

      await page.waitForSelector("#workbench_tabview\\:purchase_dt_input", {
        visible: true,
      });
      await page.focus("#workbench_tabview\\:purchase_dt_input");
      await page.waitForSelector("#ui-datepicker-div", { visible: true });
      await page.waitForSelector(".ui-datepicker-month");
      let monthOptions = await page.$$eval(
        ".ui-datepicker-month > option",
        (options) =>
          options.map((option) => ({
            value: option.value,
            name: option.textContent,
          }))
      );
      let month = monthOptions.find(
        (monthOption) => months[invoiceDate.getMonth()] === monthOption.name
      );
      await page.select(".ui-datepicker-month", month.value);
      await page.waitForSelector(".ui-datepicker-year");
      let yearOptions = await page.$$eval(
        ".ui-datepicker-year > option",
        (options) =>
          options.map((option) => ({
            value: option.value,
            name: option.textContent,
          }))
      );
      let year = yearOptions.find(
        (yearOption) => invoiceDate.getFullYear().toString() === yearOption.name
      );
      await page.select(".ui-datepicker-year", year.value);
      await page.waitForSelector("#ui-datepicker-div tbody", { visible: true });

      let dates = await page.$$eval(
        "#ui-datepicker-div tbody td a",
        (options) => options.map((option) => option.textContent)
      );
      let dateIndex = dates.findIndex(
        (date) => date === invoiceDate.getDate().toString()
      );
      await page.evaluate(
        (dateIndex) =>
          document
            .querySelectorAll(`#ui-datepicker-div tbody td a`)
            [dateIndex].click(),
        dateIndex
      );
      await page.waitForSelector("#ui-datepicker-div", { hidden: true });

      await page.waitForSelector("#workbench_tabview\\:tf_owner_name", {
        visible: true,
      });
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_owner_name",
        `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_owner_cd_label");
      await page.waitForSelector("#workbench_tabview\\:tf_owner_cd_11", {
        visible: true,
      });
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_owner_cd_11");
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_f_name",
        data.customerInfo.swdo,
        {
          delay: randomTypeDelay(),
        }
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:ownerCatg_label");
      await page.waitForSelector("#workbench_tabview\\:ownerCatg_2", {
        visible: true,
      });
      await waitForRandom();
      await page.click("#workbench_tabview\\:ownerCatg_2");
      await waitForRandom();
      await page.$eval(
        "#workbench_tabview\\:tf_mobNo",
        (el) => (el.value = "")
      );
      await page.type(
        "#workbench_tabview\\:tf_mobNo",
        data.customerInfo.phoneNo,
        {
          delay: randomTypeDelay(),
        }
      );
      await waitForRandom();

      //win.webContents.send("update-progress-bar", ["30%", "vahan"]);

      await page.type(
        "#workbench_tabview\\:tf_c_add1",
        data.customerInfo.currLineOne.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await page.type(
        "#workbench_tabview\\:tf_c_add2",
        data.customerInfo.currCity.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_c_add3",
        data.customerInfo.currPS.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_c_state_label");
      await waitForRandom();
      await page.click(
        `#workbench_tabview\\:tf_c_state_items > li[data-label='${data.customerInfo.currState}']`
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_c_district_label");
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_c_district_filter",
        data.customerInfo.currDistrict,
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.waitForSelector(
        "#workbench_tabview\\:tf_c_district_items > li:not([style='display: none;'])",
        { visible: true }
      );
      await waitForRandom();
      await page.click(
        "#workbench_tabview\\:tf_c_district_items > li:not([style='display: none;'])"
      );
      await waitForRandom();
      await page.$eval(
        "#workbench_tabview\\:tf_c_pincode",
        (el) => (el.value = "")
      );
      await page.type(
        "#workbench_tabview\\:tf_c_pincode",
        data.customerInfo.currPostal,
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_p_add1",
        data.customerInfo.permLineOne.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await page.type(
        "#workbench_tabview\\:tf_p_add2",
        data.customerInfo.permCity.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_p_add3",
        data.customerInfo.permPS.substring(0, 36),
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_p_state");
      await waitForRandom();
      await page.click(
        `#workbench_tabview\\:tf_p_state_items > li[data-label='${data.customerInfo.permState}']`
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:tf_p_district");
      await waitForRandom();
      await page.type(
        "#workbench_tabview\\:tf_p_district_filter",
        data.customerInfo.permDistrict,
        { delay: randomTypeDelay() }
      );
      await waitForRandom();
      await page.waitForSelector(
        "#workbench_tabview\\:tf_p_district_items > li:not([style='display: none;'])",
        { visible: true }
      );
      await waitForRandom();
      await page.click(
        "#workbench_tabview\\:tf_p_district_items > li:not([style='display: none;'])"
      );
      await waitForRandom();
      await page.$eval(
        "#workbench_tabview\\:tf_p_pincode",
        (el) => (el.value = "")
      );
      await page.type(
        "#workbench_tabview\\:tf_p_pincode",
        data.customerInfo.permPostal,
        { delay: randomTypeDelay() }
      );
      await waitForRandom();

      // win.webContents.send("update-progress-bar", ["40%", "vahan"]);

      await page.click("#workbench_tabview\\:partial_vh_class");
      await page.waitForSelector(
        "#workbench_tabview\\:partial_vh_class_items > li[data-label='M-Cycle/Scooter']",
        { visible: true }
      );
      await waitForRandom();
      await page.click(
        "#workbench_tabview\\:partial_vh_class_items > li[data-label='M-Cycle/Scooter']"
      );
      await waitForRandom();
      await page.waitForSelector("#workbench_tabview\\:partial_vh_catg", {
        visible: true,
      });
      await page.click("#workbench_tabview\\:partial_vh_catg");
      await waitForRandom();
      await page.waitForSelector(
        "#workbench_tabview\\:partial_vh_catg_items > li[data-label='TWO WHEELER(NT)']",
        { visible: true }
      );
      await page.click(
        "#workbench_tabview\\:partial_vh_catg_items > li[data-label='TWO WHEELER(NT)']"
      );
      await waitForRandom();
      await page.click("#workbench_tabview\\:ownerBeanPartial");
      await waitForRandom();
      await page.waitForSelector(
        "#op_showPartialGenApplNo .ui-dialog-content.ui-widget-content > .center-position > button",
        { visible: true }
      );
      await waitForRandom();
      await page.click(
        "#op_showPartialGenApplNo .ui-dialog-content.ui-widget-content > .center-position > button"
      );
      await waitForRandom();

      // win.webContents.send("update-progress-bar", ["50%", "vahan"]);

      // Enter vehicle details
      await page.waitForSelector("a[href='#workbench_tabview:veh_info_tab']", {
        visible: true,
      });
      await waitForRandom();
      await page.click("a[href='#workbench_tabview:veh_info_tab']");
      await waitForRandom();
      await page.click("#workbench_tabview\\:tableTaxMode\\:0\\:taxModeType");
      await waitForRandom();
      await page.waitForSelector(
        "#workbench_tabview\\:tableTaxMode\\:0\\:taxModeType_1",
        { visible: true }
      );
      await page.click("#workbench_tabview\\:tableTaxMode\\:0\\:taxModeType_1");
      await waitForRandom();
      await page.click("#workbench_tabview\\:tableTaxMode\\:1\\:taxModeType");
      await waitForRandom();
      await page.waitForSelector(
        "#workbench_tabview\\:tableTaxMode\\:1\\:taxModeType_1",
        { visible: true }
      );
      await page.click("#workbench_tabview\\:tableTaxMode\\:1\\:taxModeType_1");
      await waitForRandom();
      await page.type("#workbench_tabview\\:sale_amt", data.priceDetails.price);

      // win.webContents.send("update-progress-bar", ["70%", "vahan"]);

      // Enter insurance details
      await page.click("a[href='#workbench_tabview\\:HypothecationOwner']");
      await waitForRandom();
      // await page.click("#workbench_tabview\\:ins_type");
      // await waitForRandom();
      // await page.waitForSelector("#workbench_tabview\\:ins_type_4");
      // await page.click("#workbench_tabview\\:ins_type_4");
      // await waitForRandom();
      // await page.click("#workbench_tabview\\:ins_cd");
      // await page.waitForSelector("#workbench_tabview\\:ins_cd_filter");
      // await page.type(
      //   "#workbench_tabview\\:ins_cd_filter",
      //   data.additionalInfo.insuranceName,
      //   { delay: randomTypeDelay() }
      // );
      // await waitForRandom();
      // await page.click(
      //   "#workbench_tabview\\:ins_cd_items > li:not([style='display: none;'])"
      // );
      // await page.type(
      //   "#workbench_tabview\\:policy_no",
      //   data["Policy No"] || "9898989898989898", //todo policy no
      //   { delay: randomTypeDelay() }
      // );
      // await waitForRandom();
      // await page.waitForSelector("#workbench_tabview\\:ins_from_input", {
      //   visible: true,
      // });
      // await page.focus("#workbench_tabview\\:ins_from_input");
      // await page.waitForSelector("#ui-datepicker-div", { visible: true });
      // await page.waitForSelector(".ui-datepicker-month");
      // monthOptions = await page.$$eval(
      //   ".ui-datepicker-month > option",
      //   (options) =>
      //     options.map((option) => ({
      //       value: option.value,
      //       name: option.textContent,
      //     }))
      // );
      // month = monthOptions.find(
      //   (monthOption) => months[invoiceDate.getMonth()] === monthOption.name
      // );
      // await page.select(".ui-datepicker-month", month.value);
      // await page.waitForSelector(".ui-datepicker-year");
      // yearOptions = await page.$$eval(
      //   ".ui-datepicker-year > option",
      //   (options) =>
      //     options.map((option) => ({
      //       value: option.value,
      //       name: option.textContent,
      //     }))
      // );
      // year = yearOptions.find(
      //   (yearOption) => invoiceDate.getFullYear().toString() === yearOption.name
      // );
      // await page.select(".ui-datepicker-year", year.value);
      // await page.waitForSelector("#ui-datepicker-div tbody", { visible: true });
      // dates = await page.$$eval("#ui-datepicker-div tbody td a", (options) =>
      //   options.map((option) => option.textContent)
      // );
      // dateIndex = dates.findIndex(
      //   (date) => date === invoiceDate.getDate().toString()
      // );
      // await page.evaluate(
      //   (dateIndex) =>
      //     document
      //       .querySelectorAll(`#ui-datepicker-div tbody td a`)
      //       [dateIndex].click(),
      //   dateIndex
      // );
      // await page.waitForSelector("#ui-datepicker-div", { hidden: true });
      // await waitForRandom();
      // await page.click("#workbench_tabview\\:ins_year");
      // await waitForRandom();
      // await page.waitForSelector("#workbench_tabview\\:ins_year_5", {
      //   visible: true,
      // });
      // await waitForRandom();
      // await page.click("#workbench_tabview\\:ins_year_5");
      // await waitForRandom();
      // await page.$eval("#workbench_tabview\\:idv", (el) => (el.value = ""));
      // await page.type("#workbench_tabview\\:idv", data["IDV"] || "", {//todo idv
      //   delay: randomTypeDelay(),
      // });

      // Enter hypothecation details
      if (data.additionalInfo.hasOwnProperty("financier")) {
        //win.webContents.send("update-progress-bar", ["80%", "vahan"]);
        await page.click("#workbench_tabview\\:isHypo");
        await waitForRandom();
        await page.waitForSelector("#workbench_tabview\\:hpa_hp_type", {
          visible: true,
        });
        await waitForRandom();
        await page.click("#workbench_tabview\\:hpa_hp_type");
        await waitForRandom();
        await page.waitForSelector("#workbench_tabview\\:hpa_hp_type_2", {
          visible: true,
        });
        await page.click("#workbench_tabview\\:hpa_hp_type_2");
        await waitForRandom();
        await page.type(
          "#workbench_tabview\\:hpa_fncr_name",
          data.additionalInfo.financier,
          { delay: randomTypeDelay() }
        );
        await waitForRandom();
        await page.type(
          "#workbench_tabview\\:hpa_fncr_add1",
          data.customerInfo.currCity,
          {
            delay: randomTypeDelay(),
          }
        );

        await page.click("#workbench_tabview\\:hpa_fncr_state");
        await waitForRandom();
        await page.waitForSelector(
          "#workbench_tabview\\:hpa_fncr_state_filter",
          { visible: true }
        );
        await page.type(
          "#workbench_tabview\\:hpa_fncr_state_filter",
          data.customerInfo.currState,
          { delay: randomTypeDelay() }
        );
        await waitForRandom();
        await page.waitForSelector(
          "#workbench_tabview\\:hpa_fncr_state_items > li:not([style='display: none;'])",
          { visible: true }
        );
        await page.click(
          "#workbench_tabview\\:hpa_fncr_state_items > li:not([style='display: none;'])"
        );
        await waitForRandom();
        await page.click("#workbench_tabview\\:hpa_fncr_district");
        await waitForRandom();
        await page.waitForSelector(
          "#workbench_tabview\\:hpa_fncr_district_filter",
          { visible: true }
        );
        await page.type(
          "#workbench_tabview\\:hpa_fncr_district_filter",
          data.customerInfo.currDistrict,
          { delay: randomTypeDelay() }
        );
        await waitForRandom();
        await page.waitForSelector(
          "#workbench_tabview\\:hpa_fncr_district_items > li:not([style='display: none;'])",
          { visible: true }
        );
        await page.click(
          "#workbench_tabview\\:hpa_fncr_district_items > li:not([style='display: none;'])"
        );
        await waitForRandom();
        await page.type(
          "#workbench_tabview\\:hpa_fncr_pincode",
          data.customerInfo.currPostal,
          { delay: randomTypeDelay() }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  automate();
};
