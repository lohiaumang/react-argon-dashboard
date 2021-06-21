// Electron imports
const electron = require('electron');
const ipc = electron.ipcRenderer;

// Prevents jquery loading error
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

// PROMPT TO LOGIN
ipc.on("prompt-for-login", (event) => {
  const $ = require('jquery');
  // function preventReload(ev) {
  //   ev.returnValue = true;
  // }
  // window.addEventListener('beforeunload', preventReload);
  $("button[type='submit']").parent().append("<button id='autoAutoCancel' class='btn btn-signIn ng-binding'>Cancel</button><br></br>");
  // $("button[name='login']").click(() => {
  //   window.removeEventListener("beforeunload", preventReload);
  // });
  $("button[name='login']").click();
  $("#autoAutoCancel").click(() => {
    event.sender.send("close-insurance-window");
  });
  $("body").append("<div id='snackbar'>Please login and we'll take care of the rest.</div>");
  $("#snackbar").css({
    "min-width": "250px",
    "margin-left": "-125px",
    "background-color": "#333",
    "color": "#fff",
    "text-align": "center",
    "border-radius": "2px",
    "padding": "16px",
    "position": "fixed",
    "z-index": "1",
    "left": "50%",
    "bottom": "-50px"
  });
  $("#snackbar").animate({
    "bottom": "30px"
  }, 200, "swing", () => {
    setTimeout(function () {
      $("#snackbar").animate({
        "bottom": "-50px"
      }, 200, "swing", () => {
        $("#snackbar").remove();
      });
    }, 3000);
  });
});
