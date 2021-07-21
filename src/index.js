/* eslint-disable react/jsx-props-no-spreading */
/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/scss/argon-dashboard-react.scss";
import "./assets/css/custom.css";

import App from "./layouts/App";
import firebase from "firebase/app";

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
