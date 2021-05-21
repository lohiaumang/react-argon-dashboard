
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

const Bike: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [models, setModels] = useState<any>({});
  const db = firebase.firestore();

  useEffect(() => {
    const docRef = db.collection("price").doc("config");

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setModels(doc.data());
        } else {
          console.log("No insurance config set yet!");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (modelName: string, key: string, value: string) => {
    const tempModels = { ...models };
    tempModels[modelName][key] = value;
    setModels(tempModels);
  };

  const addRow = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (newKey) {
      const tempModels = { ...models };
      tempModels[newKey] = {};

      setNewKey("");
      setModels(tempModels);
    }
  };

  const removeRow = (key: string) => {
    const tempModels = { ...models };
    delete tempModels[key];
    setModels(tempModels);
  };

  const saveChanges = (ev: any) => {
    ev.preventDefault();

    // db.collection("insuranceConfig").doc("config").set();
  };

  return (
    <>
  
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
                <Form onSubmit={saveChanges}>
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Insurance Details
                      </h6>
                    </Col>
                    <Col className="text-right" xs="4">
                      {disabled ? (
                        <Button
                          className="small-button-width"
                          color={"primary"}
                          onClick={() => {
                            setDisabled(false);
                            setIsOpen(true);
                          }}
                          size="sm"
                        >
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="small-button-width"
                            color={"danger"}
                            onClick={(e) => {
                              // const uid = currentUser ? currentUser.uid : "";
                              // getSetUserData(uid);
                              setDisabled(true);
                              setIsOpen(false);
                            }}
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="small-button-width"
                            color={"success"}
                            type="submit"
                            size="sm"
                          >
                            {/* {userInfoLoading ? <SmallLoading /> : "Save"} */}
                            Save
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                  <Collapse isOpen={isOpen}>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Model Name</th>
                          <th scope="col">CC</th>
                          <th scope="col">Price</th>
                          <th scope="col">Road Tax With RC</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(models).map((key: string) => (
                          <tr key={key}>
                            <th scope="row">{key}</th>
                            <td>
                              <Input
                                required
                                disabled={disabled}
                                value={models[key].CC || ""}
                                onChange={(ev) =>
                                  handleChange(
                                    key,
                                    "CC",
                                    ev.target.value!
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Input
                                required
                                disabled={disabled}
                                value={models[key].price || ""}
                                onChange={(ev) =>
                                  handleChange(
                                    key,
                                    "price",
                                    ev.target.value!
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Input
                                required
                                disabled={disabled}
                                value={models[key].roadTaxWithRC || ""}
                                onChange={(ev) =>
                                  handleChange(
                                    key,
                                    "roadTaxWithRC",
                                    ev.target.value!
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => removeRow(key)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* <Row></Row>
                    <hr className="my-4" /> */}
                    <Row>
                      <Col sm={{ size: 6, offset: 3 }} className="text-center">
                        <Form onSubmit={addRow}>
                          <InputGroup>
                            <Input
                              value={newKey}
                              onChange={(ev) => setNewKey(ev.target.value!)}
                            />
                            <InputGroupAddon addonType="append">
                              <Button color="primary" type="submit">
                                Add row
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </Form>
                      </Col>
                    </Row>
                  </Collapse>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default (Bike);
