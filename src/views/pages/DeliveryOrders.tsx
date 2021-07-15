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
import React, { useState, useEffect, useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  Input,
  ButtonDropdown,
  UncontrolledTooltip,
  FormGroup,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import DeliveryOrderTable, {
  DeliveryOrder,
  UserInfo,
} from "../../components/Tables/DeliveryOrderTable";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import SmallLoading from "../../components/Share/SmallLoading";
import Loading from "../../components/Share/Loading";
import { UserContext } from "../../Context";
import firebase from "firebase/app";
import "firebase/firestore";
import { rejects } from "assert";

declare global {
  interface Window {
    api: any;
  }
}

const DeliveryOrders: React.FC = () => {
  const user: any = useContext(UserContext);
  const deliveryOrderTableRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [selected, setSelected] = useState<number>();
  const [showDO, setShowDO] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [dropdownButton, setDropdownButton] = useState(false);
  const db = firebase.firestore();
  const fs = require("fs");
  const currentUser = firebase.auth().currentUser;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phoneNumber: "",
    email: "",
    gst: "",
    pan: "",
    address: "",
    temporaryCertificate: "",
    uid: "",
  });
  let credentials: any;
  const toggle = () => setDropdownButton((prevState) => !prevState);

  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      setLoadingPage(true);
      const dealerId = user.createdBy || user.uid || "";
      db.collection("deliveryOrders")
        .where("dealerId", "==", dealerId)
        .where("active", "==", true)
        .onSnapshot(function (querySnapshot) {
          const dOs: any = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setDeliveryOrders(dOs);
          setLoadingPage(false);
        });
      window.api.receive("fromMain", (statusData: any) => {
        //console.log(statusData);
        switch (statusData.type) {
          case "DO_CREATED": {
            updateStatus(statusData);
            break;
          }
          case "INVOICE_CREATED": {
            updateStatus(statusData);
            break;
          }
          case "INSURANCE_CREATED": {
            updateStatus(statusData);
            break;
          }
          case "DONE": {
            updateStatus(statusData);
            break;
          }
        }
      });
    }
  }, []);

  const getActionButton = () => {
    if (selected !== undefined) {
      switch (deliveryOrders[selected].status) {
        case "PENDING": {
          return (
            <>
              <Button
                className="small-button-width my-2"
                color={"primary"}
                onClick={createDO}
                size="sm"
              >
                {loading ? <SmallLoading /> : "Create DO"}
              </Button>
            </>
          );
        }
        case "DO_CREATED": {
          return (
            <>
              <Button
                className="small-button-width my-2"
                color={"primary"}
                onClick={createInvoice}
                size="sm"
              >
                {loading ? <SmallLoading /> : "Create Invoice"}
              </Button>
            </>
          );
        }
        case "INVOICE_CREATED": {
          return (
            <ButtonDropdown isOpen={dropdownButton} toggle={toggle}>
              <>
                <DropdownToggle caret size="sm" color={"primary"}>
                  {loading ? <SmallLoading /> : "Create Insurance"}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      createInsurance("HDFC");
                    }}
                  >
                    HDFC
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      createInsurance("ICICI");
                    }}
                  >
                    ICICI
                  </DropdownItem>
                </DropdownMenu>
              </>
            </ButtonDropdown>
          );
        }
        case "INSURANCE_CREATED": {
          return (
            <>
              <Button
                className="small-button-width my-2"
                color={"primary"}
                onClick={createRegistration}
                size="sm"
              >
                {loading ? <SmallLoading /> : "Create Registration"}
              </Button>
            </>
          );
        }
      }
    }
  };

  const toggleSelected = (index: number) => {
    if (selected === index) {
      setSelected(undefined);
    } else {
      setSelected(index);
    }
  };
  let selectedDoId: any;
  const deleteDeliveryOrder = () => {
    if (selected !== undefined) {
      const tempOrders = deliveryOrders;
      selectedDoId = deliveryOrders[selected].id;
      tempOrders.splice(selected, 1);

      setSelected(undefined);
      setDeliveryOrders(tempOrders);
      db.collection("deliveryOrders").doc(selectedDoId).set(
        {
          active: false,
        },
        { merge: true }
      );
    }
  };

  //update status
  const updateStatus = (data: any) => {
    console.log(data);
    db.collection("deliveryOrders").doc(data.data).set(
      {
        status: data.type,
      },
      { merge: true }
    );
  };

  // TODO: Make fetching data if it does not exist common
  const fetchDeliveryOrder = () => {
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any, additionalInfo: any, vehicleInfo: any;
      if (order.customerInfo && order.vehicleInfo && order.additionalInfo) {
        return new Promise<boolean>((resolve) => {
          resolve(true);
        });
      } else {
        return new Promise<boolean>((resolve, reject) => {
          db.collection("customers")
            .doc(order.customerId)
            .get()
            .then((doc) => {
              if (doc.exists) {
                customerInfo = doc.data();
                db.collection("vehicles")
                  .doc(order.vehicleId)
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      vehicleInfo = doc.data();
                      db.collection("additionals")
                        .doc(order.additionalId)
                        .get()
                        .then((doc) => {
                          if (doc.exists) {
                            additionalInfo = doc.data();
                            const fullDetails = {
                              ...deliveryOrders[selected],
                              userInfo,
                              customerInfo,
                              vehicleInfo,
                              additionalInfo,
                            };
                            const tempOrders = deliveryOrders;
                            tempOrders[selected] = fullDetails;
                            setDeliveryOrders(tempOrders);
                            resolve(true);
                          }
                        })
                        .catch((error) => reject(error));
                    }
                  })
                  .catch((error) => reject(error));
              }
            })
            .catch((error) => reject(error));
        });
      }
    }
  }; // -> should return true or false promise

  //get userid and password
  const getCredentials = async () => {
    window.api.send("toMain", {
      type: "GET_CREDENTIALS",
    });

    await window.api.receive("fromMain", (data: any) => {
      switch (data.type) {
        case "GET_CREDENTIALS_SUCCESS": {
          credentials = data.userData.credentials;
          //  const credential = credentials["ERP"];
          //   console.log( credential);
          return;
        }
        case "GET_CREDENTIALS_FAILURE": {
          return;
        }
      }
    });
  };

  const getSetUserData = (uid: string) => {
    if (uid && window && window.api) {
      window.api.receive("fromMain", (data: any) => {
        switch (data.type) {
          case "GET_DEALER_SUCCESS": {
            setUserInfo(data.userData);
            break;
          }
          case "GET_DEALER_FAILURE": {
            setUserInfo(data.userData);
            window.api.send("toMain", {
              type: "SET_DEALER",
              data: data.userData,
            });
            break;
          }
        }
      });
      window.api.send("toMain", {
        type: "GET_DEALER",
        data: {
          uid,
        },
      });
    }
  };

  if (!userInfo.uid && currentUser && currentUser.uid) {
    getSetUserData(currentUser.uid);
  }

  // //create DO
  // const doStatus = async () => {
  //   window.api.send("fromMain", {
  //     type: "DO_CREATED",
  //     data:  selectedDoId,
  //     // data:"INSURANCE_CREATED",
  //   });
  // };

  const createDO = async () => {
    try {
      setLoading(true);
      const status: any = await fetchDeliveryOrder();
      if (status) {
        setShowDO(!showDO);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create invoice
  const createInvoice = async (statusData: any) => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        await getCredentials();
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INVOICE",
            data: { ...deliveryOrders[selected], credentials },
          });
          if (statusData.type) {
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create insurance
  const createInsurance = async (insuranceCompany: string) => {
    //console.log(data, "UserId Password!");
    //console.log(JSON.stringify(data), "UserId Password!");
    try {
      setLoading(true);
      if (selected !== undefined) {
        await getCredentials();
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INSURANCE",
            data: {
              ...deliveryOrders[selected],
              insuranceCompany,
              credentials,
            },
          });
          //console.log(JSON.stringify(uaerIDPassword), "Insurance Data Get!");
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create erp data
  const createRegistration = async (statusData:any) => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_REGISTRATION",
            data: deliveryOrders[selected],
          });
          if (statusData.type) {
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //print DO
  const printPage = useReactToPrint({
    content: () => deliveryOrderTableRef.current,
    copyStyles: true,
  });

  const createStaus = async () => {
    if (selected !== undefined) {
      window.api.send("toMain", {
        type: "DO_CREATED_STATUS",
        data: deliveryOrders[selected].id,
      });
    }
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {showDO && selected !== undefined && (
          <Modal
            isOpen={showDO}
            toggle={() => setShowDO(!showDO)}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <ModalHeader
              className="p-4"
              tag="h3"
              toggle={() => setShowDO(!showDO)}
            >
              Delivery Order
            </ModalHeader>
            <ModalBody className="px-4 py-0">
              <DeliveryOrderTable
                ref={deliveryOrderTableRef}
                deliveryOrder={deliveryOrders[selected]}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={printPage}>
                Print
              </Button>{" "}
              <Button color="secondary" onClick={() => setShowDO(!showDO)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                  <Col xs="6">
                    <h3 className="my-3">Delivery Orders</h3>
                  </Col>
                  {selected !== undefined && (
                    <Col
                      className="d-flex justify-content-end align-items-center"
                      xs="6"
                    >
                      <Button
                        className="small-button-width my-2"
                        color={"danger"}
                        onClick={deleteDeliveryOrder}
                        size="sm"
                      >
                        Delete
                      </Button>
                      {getActionButton()}
                    </Col>
                  )}
                </Row>
              </CardHeader>
              {loadingPage ? (
                <>
                  <div className="w-100 my-4 d-flex justify-content-center">
                    <Loading />
                  </div>
                </>
              ) : (
                <div>
                  {deliveryOrders.length > 0 ? (
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col" className="text-center">
                            Select
                          </th>
                          <th scope="col">Name</th>
                          <th scope="col">Model Name</th>
                          <th scope="col">Color</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryOrders.map((curElem: any, index: number) => (
                          <tr
                            key={curElem.id}
                            onClick={() => toggleSelected(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <td scope="row" className="text-center">
                              <Input
                                className="position-relative"
                                type="checkbox"
                                color="primary"
                                disabled={!!loading}
                                checked={index === selected}
                                style={{ cursor: "pointer" }}
                                onChange={() => toggleSelected(index)}
                              />
                            </td>
                            <td>{curElem.name}</td>
                            <td>{curElem.modelName}</td>
                            <td>{curElem.color}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <CardBody className="p-4">You are all done!</CardBody>
                  )}
                </div>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(React.memo(DeliveryOrders));
