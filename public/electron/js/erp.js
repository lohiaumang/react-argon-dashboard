const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  alert: (message) => {
    console.log(message);

    return ipcRenderer.sendSync("toErp", {
      type: "alert",
      message,
    });
  },
});
