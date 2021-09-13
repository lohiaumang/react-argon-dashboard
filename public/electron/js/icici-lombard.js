// Electron imports
const electron = require('electron');
const ipc = electron.ipcRenderer;
ipc.on("INSURENCE-CREATE", (event,innsurenceCusID) => {
  console.log(innsurenceCusID,"stet 1")
  
});
ipc.on("INSURENCE-CREATE", function (event, innsurenceCusID) {
  console.log(innsurenceCusID,"step 2")
 });

