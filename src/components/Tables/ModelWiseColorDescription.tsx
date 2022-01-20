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
import Papa from "papaparse";

// reactstrap components
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Table,
  Collapse,
  InputGroup,
  InputGroupAddon,
  Alert,
} from "reactstrap";
import Loading from "../Share/Loading";
import SmallLoading from "../Share/SmallLoading";
import firebase from "firebase/app";
import "firebase/firestore";
import { UserContext } from "../../Context";

interface ConfigRow {
  [key: string]: string;
}
export interface Config {
  [key: string]: ConfigRow;
}

const ModelWiseColorDescription: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [currConfig, setCurrConfig] = useState<Config>({});
  const [tempModelColorInput, setTempModelColorInput] = useState<any>({});
  const [success, setSuccess] = useState<{ message: string }>();
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(undefined), 1500);
    }
  }, [success]);

  useEffect(() => {
    setLoading(true);
    // const dealerId = user.createdBy || user.uid || "";
    const modelWiseColorConfigRef = firebase
      .firestore()
      .collection("modelWiseColorDescription")
      .doc("modelWiseColorConfig");

    modelWiseColorConfigRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let modelWiseColorDescription: any = doc.data();
          setCurrConfig(modelWiseColorDescription);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const camelCaseToReadable = (text: string): string => {
    return (
      text
        // insert a space before all caps
        .replace(/([A-Z])/g, " $1")
        // uppercase the first character
        .replace(/^./, function (str) {
          return str.toUpperCase();
        })
    );
  };
  const addRow = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (newKey) {
      const tempCurrConfig: any = currConfig;
      tempCurrConfig[newKey] = {};

      setNewKey("");
      setCurrConfig(tempCurrConfig);
    }
  };

  const removeRow = (key: string, modelName: any) => {
    const tempCurrConfig: any = { ...currConfig };
    delete tempCurrConfig[modelName][key];
    setCurrConfig(tempCurrConfig);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setUserInfoLoading(true);
    // const dealerId = user.createdBy || user.uid || "";
    firebase
      .firestore()
      .collection("modelWiseColorDescription")
      .doc("modelWiseColorConfig")
      .set(currConfig);
    setSuccess({
      message: "Update successful",
    });
    setUserInfoLoading(false);
  };

  const handleAddFields = () => {
    if (tempModelColorInput) {
      let tempCurrConfig: any = { ...currConfig };
      Object.keys(tempModelColorInput).map((model) => {
        const { modelColorDescription, mtoc } = tempModelColorInput[model];
        tempCurrConfig[model] = tempCurrConfig[model]
          ? tempCurrConfig[model]
          : {};
        tempCurrConfig[model][modelColorDescription] = mtoc;
        let modelWiseColorDescription = tempModelColorInput;
        modelWiseColorDescription[model] = {};
        setTempModelColorInput(modelWiseColorDescription);
      });

      setCurrConfig(tempCurrConfig);
      setTempModelColorInput("");
    }
  };

  const addModelWiseColorDescription = (
    event: React.ChangeEvent<HTMLInputElement>,
    modelName: string,
    key: string
  ) => {
    let temp: any = { ...tempModelColorInput };
    temp[modelName] = temp[modelName] ? temp[modelName] : {};
    temp[modelName][key] = event.target.value;
    setTempModelColorInput(temp);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row></Row>
      <Row>
        <Col xs="8">
          <h6 className="heading-small text-muted my-2">
            Model Wise Color Description
          </h6>
        </Col>
        {success && (
          <div className="position-fixed bottom-2 right-0 w-100 d-flex justify-content-center">
            <Alert color="primary">{success.message}</Alert>
          </div>
        )}
        <Col className="text-right" xs="4">
          {!isOpen ? (
            <Button
              className="small-button-width my-2"
              color={"primary"}
              onClick={() => {
                setIsOpen(true);
              }}
              size="sm"
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className="small-button-width my-2"
                color={"danger"}
                onClick={(e) => {
                  setIsOpen(false);
                }}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                className="small-button-width my-2"
                color={"success"}
                type="submit"
                size="sm"
                onClick={handleSubmit}
              >
                {userInfoLoading ? <SmallLoading /> : "Save"}
              </Button>
            </>
          )}
        </Col>
      </Row>
      <Collapse isOpen={isOpen}>
        {loading ? (
          <>
            <div className="w-100 d-flex justify-content-center">
              <Loading />
            </div>
            <hr className="my-4" />
          </>
        ) : (
          currConfig && (
            <>
              <Table className="align-items-center table-flush table">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Model Name</th>
                    <th scope="col">Colour Description</th>
                    <th>MTOC</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(currConfig).map((modelName: string) => {
                    let modelColorList = Object.keys(currConfig[modelName]);

                    return (
                      <>
                        {!!modelColorList.length &&
                          modelColorList.map((item, index) => (
                            <tr>
                              {!!index ? (
                                <th></th>
                              ) : (
                                <th scope="row">{modelName}</th>
                              )}
                              <td>
                                <small>{item}</small>
                              </td>
                              <td>
                                <small>{currConfig[modelName][item]}</small>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => removeRow(item, modelName)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        <tr>
                          {!!modelColorList.length ? (
                            <th />
                          ) : (
                            <th>{modelName}</th>
                          )}
                          <td>
                            <Input
                              name="itemName"
                              label="Item name"
                              value={
                                (tempModelColorInput[modelName] &&
                                  tempModelColorInput[modelName]
                                    .modelColorDescription) ||
                                ""
                              }
                              onChange={(ev) =>
                                addModelWiseColorDescription(
                                  ev,
                                  modelName,
                                  "modelColorDescription"
                                )
                              }
                            />
                          </td>
                          <td>
                            <Input
                              name="mtoc"
                              label="mtoc"
                              value={
                                (tempModelColorInput[modelName] &&
                                  tempModelColorInput[modelName].mtoc) ||
                                ""
                              }
                              onChange={(ev) =>
                                addModelWiseColorDescription(
                                  ev,
                                  modelName,
                                  "mtoc"
                                )
                              }
                            />
                          </td>
                          <td>
                            <Button
                              className="small-button-width my-2"
                              color={"success"}
                              size="sm"
                              onClick={handleAddFields}
                            >
                              Add
                            </Button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
              <hr className="my-4" />
            </>
          )
        )}
        <Row>
          <Col sm={{ size: 6, offset: 3 }} className="text-center">
            <InputGroup>
              <Input
                value={newKey || ""}
                onChange={(ev) => setNewKey(ev.target.value!.toUpperCase())}
              />
              <InputGroupAddon addonType="append">
                <Button color="primary" onClick={addRow}>
                  Add row
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
      </Collapse>
    </Form>
  );
};

export default ModelWiseColorDescription;
