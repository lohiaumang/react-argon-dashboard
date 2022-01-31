const { ipcRenderer } = require("electron");

window.alert = (message) => ipcRenderer.send("fromErp", message); //console.log(message);
