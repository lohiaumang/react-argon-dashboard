const { localeData } = require("moment");

module.exports = function (appWindow, browser) {
  const path = require("path");
  const fs = require("fs");
  const { ipcMain: ipc, BrowserWindow } = require("electron");
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

  firebase.initializeApp(firebaseConfig);

  ipc.on("toMain", async (event, args) => {
    let { type = "", data = {} } = args;

    switch (type) {
      case "CREATE_DEALER": {
        const functions = firebase.app().functions("asia-south1");
        const createUserFirestore = functions.httpsCallable("createUserIndia");
        createUserFirestore(data)
          .then((resp) => {
            console.log("User created!", JSON.stringify(resp.data));
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
        if (userData == null) {
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
            console.log("User created!", JSON.stringify(resp.data));
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
        let userData;
        try {
          userData =
            JSON.parse(
              fs.readFileSync(
                path.join(__dirname, "../dataStore/credentials.json")
              )
            ) || null;
        } catch (err) {
          userData = null;
        }
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
        credentials =
          JSON.parse(
            fs.readFileSync(
              path.join(__dirname, "../dataStore/credentials.json")
            )
          ) || null;

        if (credentials) {
          data = {
            ...data,
            credential: credentials["ERP"],
          };
        }

        erp(page, data, appWindow);

        break;
      }

      // Code to create insurance proposal
      case "CREATE_INSURANCE": {
        // data = args[0];
        const insuranceCompany = data.insuranceCompany;
        console.log(JSON.stringify(data), "Insurance Data Get!");
        insuranceWindow = new BrowserWindow({
          title: "autoAuto Insurance",
          height: 750,
          width: 700,
          parent: appWindow,
          // TODO: Might want to change this to false
          frame: true,
          webPreferences: {
            preload: path.join(
              __dirname,
              insuranceLinks[insuranceCompany].preloadScript
            ),
          },
        });

        // insuranceWindow.webContents.openDevTools();
        insuranceWindow.loadURL(insuranceLinks[insuranceCompany].loginPageUrl);

        insuranceWindow.webContents.on("dom-ready", function (event) {
          const currUrl = insuranceWindow.webContents.getURL();
          const isLoginPage =
            currUrl.includes(
              "https://ipartner.icicilombard.com/WebPages/Login.aspx"
            ) || currUrl.includes("https://pie.hdfcergo.com//Login/");
          if (isLoginPage) {
            insuranceWindow.webContents.send("prompt-for-login");
            appWindow.webContents.send("update-progress-bar", [
              "10%",
              "insurance",
            ]);
          }
        });

        insuranceWindow.webContents.send("prompt-for-login");
        page = await pie.getPage(browser, insuranceWindow);
        // const modelData = JSON.parse(fs.readFileSync(path.join(__dirname, 'model-data.json')));
        // const dealerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dealer-data.json')));

        insurance(page, data, insuranceCompany, appWindow);

        insuranceWindow.webContents.on("did-navigate", function (event, url) {
          if (
            url.includes(
              "https://ipartner.icicilombard.com/WebPages/Portfolio/UserPolicies.aspx"
            )
          ) {
            page.waitForFunction(
              'document.querySelector("#ctl00_ContentPlaceHolder1_GridID0_ctl02_ctl00").textContent !== ""'
            );
            data["Policy No"] = page.$eval(
              "#ctl00_ContentPlaceHolder1_GridID0_ctl02_ctl00",
              (el) => el.textContent
            );
          } else if (
            url.includes("https://pie.hdfcergo.com/en-US/Dashboard/Details")
          ) {
            page.waitForFunction(
              `document.querySelector("td[data-title='Prop./Pol. No']").textContent !== ""`
            );
            data["Policy No"] = page.$eval(
              "td[data-title='Prop./Pol. No']",
              (el) => el.textContent
            );
          }
        });

        insuranceWindow.webContents.once("close", function () {
          // insuranceWindow.close();
          appWindow.webContents.send("remove-overlay");
          appWindow.reload();
        });

        ipc.once("close-insurance-window", function () {
          insuranceWindow.destroy();
          appWindow.webContents.send("remove-overlay");
        });
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
          // webPreferences: {
          //   preload: path.join(__dirname, "./js/vahan.js"),
          //   backgroundThrottling: false,
          // },
        });

        vahanWindow.loadURL(
          "https://vahan.parivahan.gov.in/vahan/vahan/ui/login/login.xhtml"
        );
        vahanWindow.webContents.send("start-vahan");
        page = await pie.getPage(browser, vahanWindow);

        vahan(page, data, appWindow);

        vahanWindow.webContents.once("close", function () {
          appWindow.webContents.send("fromMain", { type: "REMOVE_OVERLAY" });
          appWindow.reload();
        });

        vahanWindow.webContents.on("new-window", function (event, url) {
          event.preventDefault();
          vahanWindow.webContents.send("navigate-to-url", [url]);
        });
        break;
      }
      default: {
        console.log("default", args);
      }
    }
  });
};
