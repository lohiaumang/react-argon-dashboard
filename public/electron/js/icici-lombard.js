// Electron imports
const electron = require('electron');
const ipc = electron.ipcRenderer;

// // Prevents jquery loading error
// window.nodeRequire = require;
// delete window.require;
// delete window.exports;
// delete window.module;

// const nomineeRelationValue = {
//   "Aunty": "29",
//   "Brother": "6",
//   "Brother in law": "9",
//   "Daughter": "8",
//   "Daughter in law": "10",
//   "Employee": "24",
//   "Employee Son": "26",
//   "Employee Spouse": "25",
//   "Father": "2",
//   "Father in law": "12",
//   "Grand Daughter": "13",
//   "Grand Father": "14",
//   "Grand Mother": "15",
//   "Grand Son": "16",
//   "Maternal Aunt": "27",
//   "Maternal Uncle": "17",
//   "Mother": "1",
//   "Mother in law": "18",
//   "Nephew": "19",
//   "Niece": "20",
//   "Paternal Aunt": "28",
//   "Paternal Uncle": "21",
//   "Self": "4",
//   "Sister": "7",
//   "Sister in law": "22",
//   "Son": "3",
//   "Son in law": "23",
//   "Spouse": "5",
//   "Uncle": "38",
//   "Other": "-1"
// };
// let step, data, exShowroom;

// PROMPT TO LOGIN
ipc.on("INSURENCE-CREATE", (event,innsurenceCusID) => {
  console.log(innsurenceCusID,"stet 1")
  
});
ipc.on("INSURENCE-CREATE", function (event, innsurenceCusID) {
  // event.preventDefault();
  // insuranceWindow.webContents.send("navigate-to-url", [url]);
  console.log(innsurenceCusID,"step 2")
 });

// ipc.on("prompt-for-login", (event) => {
//   const $ = require('jquery');

//   $(".login").get(0).style.height = "520px";
//   const buttonContainer = $("#login2_btnLogin").parent();
//   buttonContainer.css({ "flex-flow": "column", "align-items": "center" });
//   buttonContainer.append('<br/><button id="autoAutoCancel" class="btn btn-primary w-300 font-family-bold btn-login">Cancel</button>');
//   buttonContainer.children().get(0).style["border-top-right-radius"] = "20px";
//   buttonContainer.children().get(0).style["border-bottom-right-radius"] = "20px";
//   buttonContainer.children().get(2).style["border-top-left-radius"] = "20px";
//   buttonContainer.children().get(2).style["border-bottom-left-radius"] = "20px";
//   $("#autoAutoCancel").click(() => {
//     event.sender.send("close-insurance-window");
//   });
//   $("body").append("<div id='snackbar'>Please login and we'll take care of the rest.</div>")
//   $("#snackbar").css({
//     "min-width": "250px",
//     "margin-left": "-173px",
//     "background-color": "#333",
//     "color": "#fff",
//     "text-align": "center",
//     "border-radius": "2px",
//     "padding": "16px",
//     "position": "fixed",
//     "z-index": "1",
//     "left": "50%",
//     "bottom": "-50px"
//   });
//   $("#snackbar").animate({
//     "bottom": "30px"
//   }, 200, "swing", () => {
//     setTimeout(function () {
//       $("#snackbar").animate({
//         "bottom": "-50px"
//       }, 200, "swing", () => {
//         $("#snackbar").remove();
//       });
//     }, 3000);
//   });
// });