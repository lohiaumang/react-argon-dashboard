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
import React, { useState, useEffect } from "react";

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
  Collapse,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import firebase from "firebase/app";
import "firebase/firestore";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import modelData from "../../model-data";
import ConfigTable from "../../components/Tables/ConfigTable";

const Settings: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [insuranceConfig, setInsuranceConfig] = useState<any>({});
  const [priceceConfig, setPriceConfig] = useState<any>({});
  const db = firebase.firestore();

  useEffect(() => {
    const docRef = db.collection("insuranceConfig").doc("config");

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setInsuranceConfig(doc.data());
        } else {
          console.log("No insurance config set yet!");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Get price collection data
  useEffect(() => {
    const docRef = db.collection("price").doc("priceConfig");

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPriceConfig(doc.data());
        } else {
          console.log("No price config set yet!");
        }
      })
      .catch((err) => console.log(err));
  }, []);
 
  // const handleChange = (modelName: string, key: string, value: string) => {
  //   const tempInsuranceConfig = { ...insuranceConfig };
  //   tempInsuranceConfig[modelName][key] = value;
  //   setInsuranceConfig(tempModels);
  // };

  const saveInsuranceConfig = (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    // db.collection("insuranceConfig").doc("config").set();
  };
  const savePriceConfig = (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    // db.collection("insuranceConfig").doc("config").set();
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">App Settings</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <ConfigTable
                  onSubmit={saveInsuranceConfig}
                  title="Insurance Details"
                  headers={["hdfcModelName", "iciciModelName", "userRate"]}
                  config={insuranceConfig}
                  formatDownloadLink={require("../../assets/docs/insuranceConfigFormat.csv")}
                />

               <ConfigTable
                  onSubmit={savePriceConfig}
                  title="Price Details"
                  headers={["price", "roadTaxWithRc", "insuranceDepreciation"]}
                  config={priceceConfig}
                  formatDownloadLink={require("../../assets/docs/insuranceConfigFormat.csv")}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(Settings);
