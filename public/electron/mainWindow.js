module.exports = function (appWindow, browser, page) {
  const path = require("path");
  const fs = require("fs");
  const { ipcMain: ipc, BrowserWindow } = require("electron");
  const pie = require("puppeteer-in-electron");
  const erp = require("./puppeteer-scripts/erp");
  const vahan = require("./puppeteer-scripts/vahan");
  var firebase = require("firebase/app");
  require("firebase/auth");
  require("firebase/functions");
  require("firebase/firestore");

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

  ipc.on("toMain", (event, args) => {
    const { type = "", data = {} } = args;

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
        if (userData && userData.uid === data.uid) {
          appWindow.webContents.send("fromMain", {
            type: "GET_DEALER_SUCCESS",
            userData,
          });
        } else {
          appWindow.webContents.send("fromMain", {
            type: "GET_DEALER_FAILURE",
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
        debugger;
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

      // case "CREATE_INVOICE": {
      //   const functions = firebase.app().functions("asia-south1");
      //   const deleteUserDataFirestore = functions.httpsCallable(
      //     "deleteUserDataIndia"
      //   );
      //   //  console.log("Step", step++, data);
      //   deleteUserDataFirestore(data)
      //     .then((resp) => {
      //       appWindow.webContents.send("fromMain", {
      //         type: "DELETE_USER_SUCCESS",
      //         resp,
      //       });
      //     })
      //     .catch((err) => {
      //       appWindow.webContents.send("fromMain", {
      //         type: "DELETE_USER_FAILURE",
      //         err,
      //       });
      //     });
      //   break;
      // }

      case "CREATE_INVOICE": {
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

        vahanWindow.loadURL(
          "https://vahan.parivahan.gov.in/vahan/vahan/ui/login/login.xhtml"
        );
        vahanWindow.webContents.send("start-vahan");
        page = pie.getPage(browser, vahanWindow);

        vahan(appWindow, data, page);

        vahanWindow.webContents.once("close", function () {
          appWindow.webContents.send("toMain");
          appWindow.reload();
        });

        vahanWindow.webContents.on("new-window", function (event, url) {
          event.preventDefault();
          vahanWindow.webContents.send("navigate-to-url", [url]);
        });

        break;
      }
      case "CREATE_INSURANCE": {
        console.log(JSON.stringify(data), "Insurance Data Get!");
        break;
      }
      case "CREATE_REGISTRATION": {
        // Create ERP sale entry

        // data = args[0];
        erpWindow = new BrowserWindow({
          title: "autoAuto ERP",
          height: 750,
          width: 700,
          parent: appWindow,
          // TODO: Might want to change this to false
          frame: true,
        });

        erpWindow.loadURL(
          "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/?SWECmd=Login&SWECM=S&SRN=&SWEHo=hirise.honda2wheelersindia.com"
        );

        page = pie.getPage(browser, erpWindow);
        // const modelData = JSON.parse(
        //   fs.readFileSync(path.join(__dirname, "model-data.json"))
        // );
        // const dealerData = JSON.parse(
        //   fs.readFileSync(path.join(__dirname, "dealer-data.json"))
        // );

        erpWindow.webContents.once("close", function () {
          // erpWindow.close();
          appWindow.webContents.send("toMain");
          appWindow.reload();
        });

        erp(appWindow, data, page);

        break;
      }
      default: {
        console.log("default", args);
      }
    }
  });
};
