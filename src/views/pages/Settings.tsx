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
import React, { useState, useEffect, useContext } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
import firebase from "firebase/app";
import "firebase/firestore";
// core components
import Header from "../../components/Headers/Header";
import ConfigTable, { Config } from "../../components/Tables/ConfigTable";
import AccessoriesConfig from "../../components/Tables/AccessoriesConfig";
import ModelDescription from "../../components/Tables/ModelWiseColorDescription";
import InventoryTable from "../../components/Tables/InventoryTable";
import { UserContext } from "../../Context";
import { useCancellablePromise } from "../../hooks/useCancellablePromise";

const Settings: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [insuranceConfig, setInsuranceConfig] = useState<any>({});
  const [priceConfig, setPriceConfig] = useState<any>({});
  const [otherPriceConfig, setOtherPriceConfig] = useState<any>({});
  const [credentialConfig, setCredentialConfig] = useState<any>({});
  const [financerConfig, setFinancerConfig] = useState<any>({});
  const [success, setSuccess] = useState<{ message: string }>();
  const db = firebase.firestore();
  const [user] = useContext(UserContext);
  const { cancellablePromise } = useCancellablePromise();
  // const currentUser = firebase.auth().currentUser;
  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(undefined), 1500);
    }
  }, [success]);
  useEffect(() => {
    const dealerId = user.createdBy || user.uid || "";
    const insuranceConfigRef = db.collection("insuranceConfig").doc(dealerId);

    cancellablePromise(insuranceConfigRef.get())
      .then((doc: any) => {
        if (doc.exists) {
          setInsuranceConfig(doc.data());
        } else {
          setInsuranceConfig(null);
        }
      })
      .catch((err) => console.log(err));

    const priceConfigRef = db.collection("priceConfig").doc(dealerId);
    cancellablePromise(priceConfigRef.get())
      .then((doc: any) => {
        if (doc.exists) {
          setPriceConfig(doc.data());
        } else {
          setPriceConfig(null);
          console.log("No price config set yet!");
        }
      })
      .catch((err) => console.log(err));

    const otherPriceConfigRef = db.collection("joyHondaConfig").doc(dealerId);
    cancellablePromise(otherPriceConfigRef.get())
      .then((doc: any) => {
        if (doc.exists) {
          setOtherPriceConfig(doc.data());
        } else {
          setOtherPriceConfig(null);
          console.log("No price config set yet!");
        }
      })
      .catch((err) => console.log(err));

    const financeConfigRef = db.collection("financer").doc(dealerId);
    cancellablePromise(financeConfigRef.get())
      .then((doc: any) => {
        if (doc.exists) {
          setFinancerConfig(doc.data());
        } else {
          setFinancerConfig(null);
          console.log("No finance config set yet!");
        }
      })
      .catch((err) => console.log(err));

    getCredentialsConfig();
    return () => {
      window.api.clear();
    };
  }, []);

  //get userid and password
  const getCredentialsConfig = () => {
    window.api.receive("fromMain", (data: any) => {
      switch (data.type) {
        case "GET_CREDENTIALS_SUCCESS": {
          setCredentialConfig(data.userData.credentials);
          return;
        }
        case "GET_CREDENTIALS_FAILURE": {
          setCredentialConfig(null);
          return;
        }
      }
    });
    window.api.send("toMain", {
      type: "GET_CREDENTIALS",
    });
  };

  //TODO subdelear create then check code run or not
  const saveInsuranceConfig = (config: Config) => {
    const dealerId = user.createdBy || user.uid || "";
    db.collection("insuranceConfig").doc(dealerId).set(config);
    setSuccess({
      message: "Update successful",
    });
  };

  const savePriceConfig = (config: Config) => {
    const dealerId = user.createdBy || user.uid || "";
    db.collection("priceConfig").doc(dealerId).set(config);
    setSuccess({
      message: "Update successful",
    });
  };
  //end TODO
  const saveOtherPriceConfig = (config: Config) => {
    const dealerId = user.createdBy || user.uid || "";
    db.collection("joyHondaConfig").doc(dealerId).set(config);
    setSuccess({
      message: "Update successful",
    });
  };
  const saveFinanceConfig = (config: Config) => {
    const dealerId = user.createdBy || user.uid || "";
    db.collection("financer").doc(dealerId).set(config);
    setSuccess({
      message: "Update successful",
    });
  };

  //set userid and password
  const saveCredentialsConfig = (config: Config) => {
    try {
      if (config) {
        window.api.send("toMain", {
          type: "SET_CREDENTIALS",
          data: {
            config,
          },
        });
      }
      setSuccess({
        message: "Update successful",
      });
    } catch (err) {
      console.log(err);
    }
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
                <Row>
                  {success && (
                    <div className="position-fixed bottom-2 right-0 w-100 d-flex justify-content-center">
                      <Alert color="primary">{success.message}</Alert>
                    </div>
                  )}
                </Row>
              </CardHeader>
              <CardBody>
                <ConfigTable
                  onSave={saveInsuranceConfig}
                  title="Insurance Details"
                  headers={[
                    "modelName",
                    "hdfcModelName",
                    "iciciModelName",
                    "userRate",
                  ]}
                  config={insuranceConfig}
                  formatDownloadLink={require("../../assets/docs/insuranceConfigFormat.csv")}
                />
                <ConfigTable
                  onSave={savePriceConfig}
                  title="Price Details"
                  headers={[
                    "modelName",
                    "price",
                    "roadTaxWithRc",
                    "insuranceDeclaredValue",
                  ]}
                  config={priceConfig}
                  formatDownloadLink={require("../../assets/docs/priceConfigFormat.csv")}
                />
                <ConfigTable
                  onSave={saveOtherPriceConfig}
                  title="Other Details"
                  headers={[
                    "modelName",
                    "extWarrantyFourYears",
                    "extWarrantySixYears",
                    "roadsideAssistance",
                    "joyClub",
                  ]}
                  config={otherPriceConfig}
                  formatDownloadLink={require("../../assets/docs/priceOtherConfigFormat.csv")}
                />
                <ConfigTable
                  onSave={saveCredentialsConfig}
                  title="Credential Details"
                  headers={["name", "username", "password", "otp"]}
                  config={credentialConfig}
                  formatDownloadLink={require("../../assets/docs/credentialConfigFormat.csv")}
                />

                <ConfigTable
                  onSave={saveFinanceConfig}
                  title="Financer Details"
                  headers={[
                    "bankName",
                    "executive 1",
                    "executive 2",
                    "executive 3",
                  ]}
                  config={financerConfig}
                  formatDownloadLink={require("../../assets/docs/financerConfigFormat.csv")}
                />
                <AccessoriesConfig />
                {/* <ModelDescription /> */}
                <InventoryTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;
