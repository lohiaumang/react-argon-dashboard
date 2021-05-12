module.exports = function (appWindow) {
  const path = require("path");
  const fs = require("fs");
  const { ipcMain: ipc } = require("electron");
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
        try {
          const userData =
            JSON.parse(
              fs.readFileSync(
                path.join(__dirname, "../dataStore/user-info.json")
              )
            ) || null;
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
        } catch (err) {
          appWindow.webContents.send("fromMain", {
            type: "GET_DEALER_FAILURE",
          });
        }
      }
      case "SET_DEALER": {
        try {
          fs.writeFileSync(
            path.join(__dirname, "../dataStore/user-info.json"),
            JSON.stringify(data)
          );
          appWindow.webContents.send("fromMain", {
            type: "GET_DEALER_SUCCESS",
            userData,
          });
        } catch (err) {
          appWindow.webContents.send("fromMain", {
            type: "SET_DEALER_FAILURE",
          });
        }
      }
      default: {
        console.log("default");
      }
    }
  });
};
