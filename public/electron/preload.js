const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, args) => func(args));
    }
  },

  printComponent: async (url, callback) => {
    let response = await ipcRenderer.invoke("printComponent", url);
    callback(response);
  },

  previewComponent: async (url, callback) => {
    let response = await ipcRenderer.invoke("previewComponent", url);
    callback(response);
  },

  clear: () => {
    ipcRenderer.removeAllListeners();
  },
});
