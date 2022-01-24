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
import { useCancellablePromise } from "../../hooks/useCancellablePromise";
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

const AccessoriesConfig: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>();
  const [currConfig, setCurrConfig] = useState<Config>({});
  const [tempAccessories, setTempAccessories] = useState<any>({});
  const [success, setSuccess] = useState<{ message: string }>();
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [user] = useContext(UserContext);
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(undefined), 1500);
    }
  }, [success]);

  useEffect(() => {
    setLoading(true);
    const dealerId = user.createdBy || user.uid || "";
    const accessoriesConfigRef = firebase
      .firestore()
      .collection("accessories")
      .doc(dealerId);

    cancellablePromise(accessoriesConfigRef.get())
      .then((doc: any) => {
        if (doc.exists) {
          let accessories: any = doc.data();
          setCurrConfig(accessories);
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
    const dealerId = user.createdBy || user.uid || "";
    firebase
      .firestore()
      .collection("accessories")
      .doc(dealerId)
      .set(currConfig);
    setSuccess({
      message: "Update successful",
    });
    setUserInfoLoading(false);
  };

  // const handleChangeInput = (
  //   id: any,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const newInputFields = inputFields.map(
  //     (i: { [x: string]: string; id: any }) => {
  //       if (id === i.id) {
  //         i[event.target.name] = event.target.value;
  //       }
  //       return i;
  //     }
  //   );

  //   setInputFields(newInputFields);
  // };

  const handleAddFields = () => {
    if (tempAccessories) {
      let tempCurrConfig: any = { ...currConfig };
      Object.keys(tempAccessories).map((model) => {
        const { accessory, price } = tempAccessories[model];
        tempCurrConfig[model] = tempCurrConfig[model]
          ? tempCurrConfig[model]
          : {};
        tempCurrConfig[model][accessory] = price;
        let accessories = tempAccessories;
        accessories[model] = {};
        setTempAccessories(accessories);
      });

      setCurrConfig(tempCurrConfig);
      setTempAccessories("");
    }
  };

  // const handleRemoveFields = (id: any) => {b
  //   const values = [...inputFields];
  //   values.splice(
  //     values.findIndex((value) => value.id === id),
  //     1
  //   );
  //   setInputFields(values);
  // };

  const addAccessory = (
    event: React.ChangeEvent<HTMLInputElement>,
    modelName: string,
    key: string
  ) => {
    let temp: any = { ...tempAccessories };
    temp[modelName] = temp[modelName] ? temp[modelName] : {};
    temp[modelName][key] = event.target.value;
    setTempAccessories(temp);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row></Row>
      <Row>
        <Col xs="8">
          <h6 className="heading-small text-muted my-2">Accessories</h6>
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
                    <th scope="col">Item Name</th>
                    <th>Price</th>
                    <th></th>

                    {/* <th></th> */}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(currConfig).map((modelName: string) => {
                    let accessoriesList = Object.keys(currConfig[modelName]);

                    //  console.log(accessoriesList, !!accessoriesList.length);

                    return (
                      <React.Fragment key={modelName}>
                        {!!accessoriesList.length &&
                          accessoriesList.map((item, index) => (
                            <tr key={`${modelName}-${item}`}>
                              {!!index ? (
                                <th></th>
                              ) : (
                                <th scope="row">{modelName}</th>
                              )}
                              <td>
                                {/* <Input
                                  name="itemName"
                                  variant="filled"
                                  value={item || ""}
                                  // onChange={(event) =>
                                  //   handleChangeInput(item.id, event)
                                  // }
                                /> */}
                                <small>{item}</small>
                              </td>
                              <td>
                                <small>{currConfig[modelName][item]}</small>
                                {/* <Input
                                  name="price"
                                  label="price"
                                  variant="filled"
                                  value={currConfig[modelName][item] || ""}
                                  // onChange={(event) =>
                                  //   handleChangeInput(item.id, event)
                                  // }
                                /> */}
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  color="danger"
                                  // disabled={item.length === 1}
                                  onClick={() => removeRow(item, modelName)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        <tr>
                          {!!accessoriesList.length ? (
                            <th />
                          ) : (
                            <th>{modelName}</th>
                          )}
                          <td>
                            <Input
                              name="itemName"
                              label="Item name"
                              value={
                                (tempAccessories[modelName] &&
                                  tempAccessories[modelName].accessory) ||
                                ""
                              }
                              onChange={(ev) =>
                                addAccessory(ev, modelName, "accessory")
                              }
                            />
                          </td>
                          <td>
                            <Input
                              name="price"
                              label="Price"
                              value={
                                (tempAccessories[modelName] &&
                                  tempAccessories[modelName].price) ||
                                ""
                              }
                              onChange={(ev) =>
                                addAccessory(ev, modelName, "price")
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
                      </React.Fragment>
                    );
                  })}
                  {/* <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  //endIcon={<Icon>send</Icon>}
                  onClick={handleSubmit}
                >
                  Send
                </Button> */}
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
                //   placeholder={camelCaseToReadable(headers[0])}
                onChange={(ev) => setNewKey(ev.target.value!.toUpperCase())}
                //disabled={disabled}
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

export default AccessoriesConfig;
