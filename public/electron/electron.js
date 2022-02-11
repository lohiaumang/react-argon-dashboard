require("dotenv").config({ path: __dirname + "/.env" });
const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
const functions = require("./functions");
const isDev = require("electron-is-dev");

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
} // NEW!

let win, browser;

async function main() {
  await pie.initialize(app);
  browser = await pie.connect(app, puppeteer);

  app.whenReady().then(createWindow);
}

main();

function createWindow() {
  console.log(__dirname);
  win = new BrowserWindow({
    width: 1200,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../build/index.html")}`
  );

  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools({ mode: "detach" });
  // }

  functions(win, browser);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: "printableArea",
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: "Page header",
  footer: "Page footer",
};

//handle print
ipcMain.handle("printComponent", (event, url) => {
  let win = new BrowserWindow({ show: false });

  win.loadURL(url);

  win.webContents.on("did-finish-load", () => {
    win.webContents.print(printOptions, (success, failureReason) => {
      console.log("Print Initiated in Main...");
      if (!success) console.log(failureReason);
    });
  });
  return "shown print dialog";
});

//handle preview
ipcMain.handle("previewComponent", (event, url) => {
  let win = new BrowserWindow({
    title: "Preview",
    show: false,
    autoHideMenuBar: true,
  });
  win.loadURL(url);

  win.webContents.once("did-finish-load", () => {
    win.webContents
      .printToPDF(printOptions)
      .then((data) => {
        let buf = Buffer.from(data);
        var data = buf.toString("base64");
        let url = "data:application/pdf;base64," + data;

        win.webContents.on("ready-to-show", () => {
          win.show();
          win.setTitle("Preview");
        });

        win.webContents.on("closed", () => (win = null));
        win.loadURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return "shown preview window";
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
