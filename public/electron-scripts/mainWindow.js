module.exports = function (mainWindow) {
  const path = require("path");
  const fs = require("fs");
  const { ipcMain: ipc } = require("electron");
  var firebase = require("firebase/app");

  require("firebase/functions");

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
    console.log(args);
    const { type = "", data = {} } = args;

    // fs.writeFileSync(
    //   path.join(__dirname, "../dataStore/user-info.json"),
    //   JSON.stringify(userInfo)
    // );

    switch (type) {
      case "CREATE_USER": {
        console.log("create user");
        console.log(JSON.stringify(data));
        const functions = firebase.app().functions("asia-south1");
        const createUserFirestore = functions.httpsCallable("createUserIndia");
        createUserFirestore(data)
          .then((resp) => {
            console.log("User created!", resp.data.result, resp.data);
            mainWindow.webContents.send("fromMain", {
              type: "CREATE_USER_SUCCESS",
              resp,
            });
          })
          .catch((err) => {
            console.log("User cration failed!", err);
            mainWindow.webContents.send("fromMain", {
              type: "CREATE_USER_FAILURE",
              err,
            });
          });
        break;
      }
      default: {
        console.log("default");
      }
    }
  });

  ipc.on("get-user", (event) => {
    event.returnValue = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../dataStore/user-info.json"))
    );
  });
};
