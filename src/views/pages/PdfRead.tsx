/* eslint-disable jsx-a11y/label-has-associated-control */
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
import React, { useRef, useState, useEffect, useContext } from "react";
// const pdfreader = require("pdfreader");
//var pdfreader = require("pdfreader");

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Alert,
  Nav,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";

//import WebViewer from "@pdftron/webviewer";

const PdfRead: React.FC = () => {
  // var rows: any = {}; // indexed by y-position

  // function printRows() {
  //   Object.keys(rows) // => array of y-positions (type: float)
  //     .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
  //     .forEach((y) => console.log((rows[y] || []).join("")));
  // }

  // new pdfreader.PdfReader().parseFileItems(
  //   "rahul.pdf",
  //   function (err: any, item: { page: any; text: any; y: string | number }) {
  //     if (!item || item.page) {
  //       // end of file, or page
  //       printRows();
  //       console.log("PAGE:", item.page);
  //       rows = {}; // clear rows for next page
  //     } else if (item.text) {
  //       // accumulate text items into rows object, per line
  //       (rows[item.y] = rows[item.y] || []).push(item.text);
  //     }
  //   }
  // );
  // const viewerDiv = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   WebViewer(
  //     {
  //       path: "lib",
  //       initialDoc:
  //         "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf",
  //     },
  //     viewerDiv.current as HTMLDivElement
  //   ).then((instannce) => {

  //   });
  // }, []);
  return (
    <>
      {/* <Header />
      <Container className="mt--7" fluid>
        <div className="webviewer" ref={viewerDiv}></div>
      </Container> */}
    </>
  );
};

export default PdfRead;
