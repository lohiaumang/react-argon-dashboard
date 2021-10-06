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
import Header from "../../components/Headers/Header";
const PdfRead: React.FC = () => {
  const [pdfDoc, setPdfDoc] = useState<string>();
  console.log(pdfDoc);
  return (
    <>
      <Header />

      <Row>
        <FormGroup>
          <label className="form-control-label" htmlFor="input-email">
            Select Doc
          </label>
          <Input
            className="form-control-alternative"
            id="input-email"
            placeholder="janedoe@example.com"
            type="file"
            title="Email should be in the format abc@xyz.def"
            required
            onChange={(ev) => setPdfDoc(ev.target.value!)}
            pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
          />
        </FormGroup>
      </Row>
    </>
  );
};

export default PdfRead;
