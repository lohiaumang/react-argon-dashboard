const { localeData } = require("moment");

module.exports = function (appWindow, browser) {
  const path = require("path");
  const fs = require("fs");
  const { ipcMain: ipc, BrowserWindow } = require("electron");
 // const ipc = electron.ipcRenderer;
  const pie = require("puppeteer-in-electron");
  const erp = require("./puppeteer-scripts/erp");
  const vahan = require("./puppeteer-scripts/vahan");
  const insurance = require("../insurance");
  const insuranceLinks = require("../insurance-links");
  var firebase = require("firebase/app");
  require("firebase/auth");
  require("firebase/functions");
  require("firebase/firestore");
  let page;

  const firebaseConfig = {
    apiKey: "AIzaSyC-Tb0Xfay1bTSZNfAfM3EeBJjPqwvhKBM",
    authDomain: "autoauto-97af8.firebaseapp.com",
    databaseURL: "https://autoauto-97af8-default-rtdb.firebaseio.com",
    projectId: "autoauto-97af8",
    storageBucket: "autoauto-97af8.appspot.com",
    messagingSenderId: "820359446551",
    appId: "1:820359446551:web:548a78cbb34d4805839c52",
    measurementId: "G-G3NJR57E7H",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }



  ipc.on("toMain", async (event, args) => {
    let { type = "", data = {} } = args;

    const getCredentials = () => {
      let credentials;

      try {
        credentials =
          JSON.parse(
            fs.readFileSync(
              path.join(__dirname, "../dataStore/credentials.json")
            )
          ) || null;
      } catch (err) {
        credentials = null;
      }

      return credentials;
    };

    switch (type) {
      case "CREATE_DEALER": {
        const functions = firebase.app().functions("asia-south1");
        const createUserFirestore = functions.httpsCallable("createUserIndia");
        createUserFirestore(data)
          .then((resp) => {
            // console.log("User created!", JSON.stringify(resp.data));
            const uid = resp.data.uid || "";
            delete data.password;
            fs.writeFileSync(
              path.join(__dirname, "../dataStore/user-info.json"),
              JSON.stringify({
                ...data,
                uid,
              })
            );
            appWindow.webContents.send("fromMain", {
              type: "CREATE_DEALER_SUCCESS",
              resp,
            });
          })
          .catch((err) => {
            console.log("User creation failed!", err);
            appWindow.webContents.send("fromMain", {
              type: "CREATE_DEALER_FAILURE",
              err,
            });
          });
        break;
      }
      case "GET_DEALER": {
        let userData;
        try {
          userData =
            JSON.parse(
              fs.readFileSync(
                path.join(__dirname, "../dataStore/user-info.json")
              )
            ) || null;
        } catch (err) {
          userData = null;
        }

        if (userData === null || userData.uid !== data.uid) {
          firebase
            .firestore()
            .collection("users")
            .doc(data.uid)
            .onSnapshot((doc) => {
              if (doc.exists) {
                const info = doc.data();
                if (info) {
                  // SET_USER
                  let data = {
                    name: info.name,
                    phoneNumber: info.phoneNumber.slice(3),
                    email: info.email,
                    gst: info.gst,
                    pan: info.pan,
                    address: info.address,
                    temporaryCertificate: info.temporaryCertificate,
                    uid: info.uid,
                  };
                  userData = data;
                  appWindow.webContents.send("fromMain", {
                    type: "GET_DEALER_FAILURE",
                    userData,
                  });
                }
              }
            });
        }
        if (userData && userData.uid === data.uid) {
          appWindow.webContents.send("fromMain", {
            type: "GET_DEALER_SUCCESS",
            userData,
          });
        }
        break;
      }
      case "SET_DEALER": {
        try {
          fs.writeFileSync(
            path.join(__dirname, "../dataStore/user-info.json"),
            JSON.stringify(data)
          );
          appWindow.webContents.send("fromMain", {
            type: "SET_DEALER_SUCCESS",
          });
        } catch (err) {
          appWindow.webContents.send("fromMain", {
            type: "SET_DEALER_FAILURE",
          });
        }
        break;
      }
      case "CREATE_USER": {
        const functions = firebase.app().functions("asia-south1");
        const createUserDataFirestore = functions.httpsCallable(
          "createUserdataIndia"
        );
        //  console.log("Step", step++, data);
        createUserDataFirestore(data)
          .then((resp) => {
            // console.log("User created!", JSON.stringify(resp.data));
            // console.log("Step", step++, resp.data);
            appWindow.webContents.send("fromMain", {
              type: "CREATE_USER_SUCCESS",
              resp,
            });
          })
          .catch((err) => {
            console.log("User creation failed!", err);
            appWindow.webContents.send("fromMain", {
              type: "CREATE_USER_FAILURE",
              err,
            });
          });
        break;
      }
      case "DELETE_USER": {
        const functions = firebase.app().functions("asia-south1");
        const deleteUserDataFirestore = functions.httpsCallable(
          "deleteUserDataIndia"
        );
        //  console.log("Step", step++, data);
        deleteUserDataFirestore(data)
          .then((resp) => {
            appWindow.webContents.send("fromMain", {
              type: "DELETE_USER_SUCCESS",
              resp,
            });
          })
          .catch((err) => {
            appWindow.webContents.send("fromMain", {
              type: "DELETE_USER_FAILURE",
              err,
            });
          });
        break;
      }
      //Creeate userid and password for automation
      case "SET_CREDENTIALS": {
        const credentials = data.config;
        fs.writeFileSync(
          path.join(__dirname, "../dataStore/credentials.json"),
          JSON.stringify({
            credentials,
          })
        );
        break;
      }
      //get useid and password
      case "GET_CREDENTIALS": {
        const userData = getCredentials();

        if (userData) {
          appWindow.webContents.send("fromMain", {
            type: "GET_CREDENTIALS_SUCCESS",
            userData,
          });
        } else {
          appWindow.webContents.send("fromMain", {
            type: "GET_CREDENTIALS_FAILURE",
          });
        }
        break;
      }

      // Create ERP sale entry
      case "CREATE_INVOICE": {
        // data = args[0];
        erpWindow = new BrowserWindow({
          title: "AutoAuto ERP",
          height: 950,
          width: 1200,
          // parent: appWindow,
          // TODO: Might want to change this to false
          frame: true,
        });

        await erpWindow.loadURL(
          "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/?SWECmd=Login&SWECM=S&SRN=&SWEHo=hirise.honda2wheelersindia.com"
        );

        page = await pie.getPage(browser, erpWindow);
        // const modelData = JSON.parse(
        //   fs.readFileSync(path.join(__dirname, "model-data.json"))
        // );
        // const dealerData = JSON.parse(
        //   fs.readFileSync(path.join(__dirname, "dealer-data.json"))
        // );

        // erpWindow.webContents.once("close", function () {
        //   // erpWindow.close();
        //   appWindow.webContents.send("fromMain", { type: "REMOVE_OVERLAY" });
        //   appWindow.reload();
        // });
        // TODOTODO
        const { credentials } = getCredentials();

        if (credentials) {
          data = {
            ...data,
            credentials: credentials["ERP"],
          };
        }

        erp(page, data, appWindow);
        erpWindow.webContents.once("close", function () {
          appWindow.webContents.send("fromMain", {
            type: "INVOICE_CREATED",
            data: data,
            // data:"INSURANCE_CREATED",
          });
        });

        break;
      }

      // Code to create insurance proposal
      case "CREATE_INSURANCE": {
        // data = args[0];
        const insuranceCompany = data.insuranceCompany;
        // console.log(
        //   // JSON.stringify(data),
        //   insuranceCompany,
        //   insuranceLinks[insuranceCompany].loginPageUrl,
        //   insuranceLinks[insuranceCompany].preloadScript,
        //   "Insurance Data Get!"
        // );
        insuranceWindow = new BrowserWindow({
          title: "autoAuto Insurance",
          height: 750,
          width: 700,
          // TODO: Might want to change this to false
          frame: true,
          resizable: false,
        });

        // insuranceWindow.webContents.openDevTools();
        await insuranceWindow.loadURL(
          insuranceLinks[insuranceCompany].loginPageUrl
        );

        // insuranceWindow.webContents.on("dom-ready", function (event) {
        //   const currUrl = insuranceWindow.webContents.getURL();
        //   const isLoginPage =
        //     currUrl.includes(
        //       "https://ipartner.icicilombard.com/WebPages/Login.aspx"
        //     ) || currUrl.includes("https://pie.hdfcergo.com//Login/");
        //   if (isLoginPage) {
        //     insuranceWindow.webContents.send("prompt-for-login");
        //     // appWindow.webContents.send("update-progress-bar", [
        //     //   "10%",
        //     //   "insurance",
        //     // ]);
        //   }
        // });

        // insuranceWindow.webContents.send("prompt-for-login", [
        //   insuranceLinks[insuranceCompany].loginPageUrl,
        // ]);
        // const modelData = JSON.parse(fs.readFileSync(path.join(__dirname, 'model-data.json')));
        // const dealerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dealer-data.json')));

        const insuranceConfig = await firebase
          .firestore()
          .collection("insuranceConfig")
          .doc("config")
          .get();

        const priceConfig = await firebase
          .firestore()
          .collection("priceConfig")
          .doc("config")
          .get();

        if (insuranceConfig.exists && priceConfig.exists) {
          const insuranceDetails = insuranceConfig.data();
          const priceDetails = priceConfig.data();
          const { credentials } = getCredentials();
          if (credentials) {
            data = {
              ...data,
              credentials: credentials[insuranceCompany],
              insuranceDetails: {
                modelName:
                  insuranceDetails[data.vehicleInfo.modelName][
                    `${insuranceCompany.toLowerCase()}ModelName`
                  ],
                userRate:
                  insuranceDetails[data.vehicleInfo.modelName]["userRate"],
              },
              priceDetails: priceDetails[data.vehicleInfo.modelName],
            };
          }

          page = await pie.getPage(browser, insuranceWindow);
          insurance(page, data, insuranceCompany, appWindow);
        }

        // insuranceWindow.webContents.on("did-navigate", function (event, url) {
        //   if (
        //     url.includes(
        //       "https://ipartner.icicilombard.com/WebPages/Portfolio/UserPolicies.aspx"
        //     )
        //   ) {
        //     page.waitForFunction(
        //       'document.querySelector("#ctl00_ContentPlaceHolder1_GridID0_ctl02_ctl00").textContent !== ""'
        //     );
        //     data["Policy No"] = page.$eval(
        //       "#ctl00_ContentPlaceHolder1_GridID0_ctl02_ctl00",
        //       (el) => el.textContent
        //     );
        //   } else if (
        //     url.includes("https://pie.hdfcergo.com/en-US/Dashboard/Details")
        //   ) {
        //     page.waitForFunction(
        //       `document.querySelector("td[data-title='Prop./Pol. No']").textContent !== ""`
        //     );
        //     data["Policy No"] = page.$eval(
        //       "td[data-title='Prop./Pol. No']",
        //       (el) => el.textContent
        //     );
        //   }
        // });

        insuranceWindow.webContents.once("close", function () {
          appWindow.webContents.send("fromMain", {
            type: "INSURANCE_CREATED",
            data: data,
            // data:"INSURANCE_CREATED",
          });
        });

        // ipc.once("close-insurance-window", function () {
        //   insuranceWindow.destroy();
        //   appWindow.webContents.send("remove-overlay");
        // });
        //console.log(JSON.stringify(data), "Insurance Data Get!");
        break;
      }

      // Code to create vahan application
      case "CREATE_REGISTRATION": {
        // data = {
        //   ...data,
        //   ...args[0],
        // };

        // const dealerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dealer-data.json')));

        vahanWindow = new BrowserWindow({
          title: "autoAuto Vahan",
          height: 786,
          width: 1440,
          // TODO: Might want to change this to false
          frame: true,
          webPreferences: {
            preload: path.join(__dirname, "./js/vahan.js"),
            backgroundThrottling: false,
          },
        });

        await vahanWindow.loadURL(
          "https://vahan.parivahan.gov.in/vahan/vahan/ui/login/login.xhtml"
        );
        //vahanWindow.webContents.send("start-vahan");
        page = await pie.getPage(browser, vahanWindow);

        const { credentials } = getCredentials();

        const priceConfig = await firebase
          .firestore()
          .collection("priceConfig")
          .doc("config")
          .get();

        if (priceConfig.exists && credentials) {
          const priceDetails = priceConfig.data();
          data = {
            ...data,
            credentials: credentials["VAHAN"],
            priceDetails: priceDetails[data.vehicleInfo.modelName],
          };
        }

        vahan(page, data, appWindow);

        // vahanWindow.webContents.on('vahan-done', function () {
        //   console.log("store...............");
        //  });
      //   vahanWindow.webContents.once('asynchronous-message', function (evt, message) {
      //     console.log(message); // Returns: {'SAVED': 'File Saved'}
      // });


      // vahanWindow.api.once("fromMain", (statusData) => {
      //   switch (statusData.type) {
      //     case "vahan-done": {
      //      console.log(statusData);
      //      console.log(statusData.type);
      //      console.log(statusData.data);
    
      //       break;
      //     }
      //   }
      // });

      vahanWindow.webContents.once("vahan-done", function () {
          // vahanWindow.webContents.
          console.log("vahan hit");
          vahanWindow.webContents.once("close", function () {
            appWindow.webContents.send("fromMain", {
              type: "DONE",
              data: data.id,
              // data:"INSURANCE_CREATED",
            });
          });
        });

        vahanWindow.webContents.once("close", function () {
          console.log("HERE\n\n\n");
          appWindow.webContents.send("fromMain", {
            type: "RESET",
            data: data.id,
            // data:"INSURANCE_CREATED",
          });
        });

        // vahanWindow.webContents.on("new-window", function (event, url) {
        //   event.preventDefault();
        //   vahanWindow.webContents.send("navigate-to-url", [url]);
        // });
        break;
      }

      default: {
        console.log("default", args);
      }
    }
  });
};
