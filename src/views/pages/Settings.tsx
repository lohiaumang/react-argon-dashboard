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
import ConfigTable, { Config } from "../../components/Tables/ConfigTable";

const Settings: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [insuranceConfig, setInsuranceConfig] = useState<any>({});
  const [priceConfig, setPriceConfig] = useState<any>({});
  const [otherPriceConfig, setOtherPriceConfig] = useState<any>({});
  const db = firebase.firestore();
console.log({priceConfig})
  useEffect(() => {
    const insuranceConfigRef = db.collection("insuranceConfig").doc("config");

    insuranceConfigRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setInsuranceConfig(doc.data());
        } else {
          setInsuranceConfig(null);
        }
      })
      .catch((err) => console.log(err));

    const priceConfigRef = db.collection("priceConfig").doc("config");
    priceConfigRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPriceConfig(doc.data());
          console.log(doc.data())
        } else {
          console.log("No price config set yet!");
        }
      })
      .catch((err) => console.log(err));

      const otherPriceConfigRef = db.collection("priceConfig").doc("joyHondaConfig");
      debugger
      otherPriceConfigRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setOtherPriceConfig(doc.data());
            console.log(doc.data())
          } else {
            console.log("No price config set yet!");
          }
        })
        .catch((err) => console.log(err));
  }, []);

  const saveInsuranceConfig = (config: Config) => {
    db.collection("insuranceConfig").doc("config").set(config);
  };
  const savePriceConfig = (config: Config) => {
    db.collection("priceConfig").doc("config").set(config);
  };
  const saveOtherPriceConfig = (config: Config) => {
    db.collection("priceConfig").doc("joyHondaConfig").set(config);
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
                  onSave={saveInsuranceConfig}
                  title="Insurance Details"
                  headers={["hdfcModelName", "iciciModelName", "userRate"]}
                  config={insuranceConfig}
                  formatDownloadLink={require("../../assets/docs/insuranceConfigFormat.csv")}
                />
                <ConfigTable
                  onSave={savePriceConfig}
                  title="Price Details"
                  headers={["price", "roadTaxWithRc", "insuranceDeclaredValue"]}
                  config={priceConfig}
                  formatDownloadLink={require("../../assets/docs/priceConfigFormat.csv")}
                />
                   <ConfigTable
                  onSave={saveOtherPriceConfig}
                  title="Add on Details"
                  headers={["extWarranty4Years", "extWarranty6Years", "hondaRoadSideAssistance","joyClub"]}
                  config={otherPriceConfig}
                  formatDownloadLink={require("../../assets/docs/priceOtherConfigFormat.csv")}
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
