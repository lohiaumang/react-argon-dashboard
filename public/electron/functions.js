module.exports = async function (mainWindow, browser) {
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

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  
  let systemConfig;
  let docRef = firebase
    .firestore()
    .collection("systemConfig")
    .doc("config");
  let doc = await docRef.get();

  if (doc.exists) {
    systemConfig = doc.data();
  }

 

  ipc.on("toMain", async (event, args) => {
    try {
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
          const createUserFirestore =
            functions.httpsCallable("createUserIndia");
          createUserFirestore(data)
            .then((resp) => {
              const uid = resp.data.uid || "";
              delete data.password;
              fs.writeFileSync(
                path.join(__dirname, "../dataStore/user-info.json"),
                JSON.stringify({
                  ...data,
                  uid,
                })
              );
              mainWindow.webContents.send("fromMain", {
                type: "CREATE_DEALER_SUCCESS",
                resp,
              });
            })
            .catch((err) => {
              console.log("User creation failed!", err);
              mainWindow.webContents.send("fromMain", {
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
              .onSnapshot(async (doc) => {
                if (doc.exists) {
                  const info = await doc.data();
                  if (info) {
                    // SET_USER
                    let data = {
                      name: info.name,
                      phoneNumber: info.phoneNumber
                        ? info.phoneNumber.slice(3)
                        : "",
                      email: info.email,
                      gst: info.gst,
                      pan: info.pan,
                      address: info.address,
                      temporaryCertificate: info.temporaryCertificate,
                      uid: info.uid,
                    };
                    userData = data;
                    mainWindow.webContents.send("fromMain", {
                      type: "GET_DEALER_FAILURE",
                      userData,
                    });
                  }
                }
              });
          }
          if (userData && userData.uid === data.uid) {
            mainWindow.webContents.send("fromMain", {
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
            mainWindow.webContents.send("fromMain", {
              type: "SET_DEALER_SUCCESS",
            });
          } catch (err) {
            mainWindow.webContents.send("fromMain", {
              type: "SET_DEALER_FAILURE",
            });
          }
          break;
        }
        case "CREATE_USER": {
          const functions = firebase.app().functions("asia-south1");
          const createUserDataFirestore = functions.httpsCallable(
            "createUserdataIndia1"
          );
          createUserDataFirestore(data)
            .then((resp) => {
              mainWindow.webContents.send("fromMain", {
                type: "CREATE_USER_SUCCESS",
                resp,
              });
            })
            .catch((err) => {
              console.log("User creation failed!", err);
              mainWindow.webContents.send("fromMain", {
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
          deleteUserDataFirestore(data)
            .then((resp) => {
              mainWindow.webContents.send("fromMain", {
                type: "DELETE_USER_SUCCESS",
                resp,
              });
            })
            .catch((err) => {
              mainWindow.webContents.send("fromMain", {
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
            mainWindow.webContents.send("fromMain", {
              type: "GET_CREDENTIALS_SUCCESS",
              userData,
            });
          } else {
            mainWindow.webContents.send("fromMain", {
              type: "GET_CREDENTIALS_FAILURE",
            });
          }
          break;
        }

        // Create ERP sale entry
        case "CREATE_INVOICE": {
          let erpWindow = new BrowserWindow({
            title: "AutoAuto ERP",
            height: 750,
            width: 1200,
            frame: true,
          });

          // erpWindow.webContents.openDevTools({ mode: "undocked" });

          await erpWindow.loadURL(
            "https://hirise.honda2wheelersindia.com/siebel/app/edealer/enu/?SWECmd=Login&SWECM=S&SRN=&SWEHo=hirise.honda2wheelersindia.com"
          );

          page = await pie.getPage(browser, erpWindow);

          const { credentials } = getCredentials();

          if (credentials) {
            data = {
              ...data,
              credentials: credentials["ERP"],
            };
          }
          // erpWindow.webContents.openDevTools();
          erp(page, data, mainWindow, erpWindow,systemConfig);

          // erpWindow.webContents.once("close", function () {
          //   mainWindow.webContents.send("fromMain", {
          //     type: "INVOICE_CREATED",
          //     data: data,
          //     // data:"INSURANCE_CREATED",
          //   });
          // });

          break;
        }

        // Code to create insurance proposal
        case "CREATE_INSURANCE": {
          const insuranceCompany = data.insuranceCompany;
          insuranceWindow = new BrowserWindow({
            title: "autoAuto Insurance",
            height: 750,
            width: 1200,
            frame: true,
            resizable: false,
          });
          await insuranceWindow.loadURL(
            insuranceLinks[insuranceCompany].loginPageUrl
          );

          // const insuranceConfig = await firebase
          //   .firestore()
          //   .collection("insuranceConfig")
          //   .doc("config")
          //   .get();

          // const priceConfig = await firebase
          //   .firestore()
          //   .collection("priceConfig")
          //   .doc("config")
          //   .get();

          if (data.insuranceDetails && data.priceDetails) {
            // const insuranceDetails = insuranceConfig.data();
            // const priceDetails = priceConfig.data();
            const { credentials } = getCredentials();
            if (credentials) {
              data = {
                ...data,
                credentials: credentials[insuranceCompany],
                insuranceDetails: {
                  modelName:
                    data.insuranceDetails[data.vehicleInfo.modelName][
                    `${insuranceCompany.toLowerCase()}ModelName`
                    ],
                  userRate:
                    data.insuranceDetails[data.vehicleInfo.modelName][
                    "userRate"
                    ],
                },
                // priceDetails: priceDetails[data.vehicleInfo.modelName],
              };
            }

            page = await pie.getPage(browser, insuranceWindow);
            insurance(
              page,
              data,
              insuranceCompany,
              mainWindow,
              insuranceWindow,
              systemConfig
            );
          }

          break;
        }
        // Code to create vahan application
        case "CREATE_REGISTRATION": {
          vahanWindow = new BrowserWindow({
            title: "autoAuto Vahan",
            height: 750,
            width: 1200,
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
          page = await pie.getPage(browser, vahanWindow);

          const { credentials } = getCredentials();

          if (credentials) {
            data = {
              ...data,
              credentials: credentials["VAHAN"],
            };
          }
          vahan(page, data, mainWindow, vahanWindow);
          break;
        }
        default: {
          console.log("default", args);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};
