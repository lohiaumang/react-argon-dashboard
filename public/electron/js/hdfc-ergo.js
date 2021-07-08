// Electron imports
const electron = require("electron");
const ipc = electron.ipcRenderer;

// Prevents jquery loading error
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

// PROMPT TO LOGIN
ipc.on("prompt-for-login", (event, [url]) => {
  const $ = require("jquery");

  window.location.href = url;
});
