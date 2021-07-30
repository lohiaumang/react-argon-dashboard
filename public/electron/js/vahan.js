// Electron imports
const electron = require("electron");
const ipc = electron.ipcRenderer;

// Prevents jquery loading error
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
ipc.on("navigate-to-url", (event, [url]) => {
  window.location.href = url;
});
