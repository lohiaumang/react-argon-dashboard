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
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Table,
  Container,
  Row,
  Input,
  ButtonDropdown,
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
import InvoiceTable from "../../components/Tables/InvoiceTable";
import EditDo from "../../components/Tables/EditDo";
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

interface DeliveryOrders {
  [key: string]: DeliveryOrder;
}

const DeliveryOrders: React.FC = () => {
  const user: any = useContext(UserContext);
  const deliveryOrderTableRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrders>({});
  const [selected, setSelected] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [dropdownButton, setDropdownButton] = useState(false);
  const db = firebase.firestore();
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
  let priceDetails: any;
  let insuranceDetails: any;
  const [currentStatus, setCurrentStatus] = useState<string>();
  const toggle = () => setDropdownButton((prevState) => !prevState);

  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      setLoadingPage(true);
      const dealerId = user.createdBy || user.uid || "";
      db.collection("deliveryOrders")
        .where("dealerId", "==", dealerId)
        .where("active", "==", true)
        .get()
        .then((querySnapshot) => {
          let dOs: any = {};
          querySnapshot.docs.forEach((doc) => {
            dOs[doc.id] = {
              ...doc.data(),
              id: doc.id,
            };
          });
          setDeliveryOrders(dOs);
          setLoadingPage(false);
        });

      window.api.receive("fromMain", (statusData: any) => {
        switch (statusData.type) {
          case "INVOICE_CREATED": {
            setShowModal(!showModal);
            break;
          }
          case "DISABLE_LOADER": {
            setLoading(false);
            break;
          }
          case "DO_CREATED": {
            setLoading(false);
            break;
          }
          case "INSURANCE_CREATED": {
            setCurrentStatus(statusData.type);

            break;
          }
          case "DONE": {
            setCurrentStatus(statusData.type);

            break;
          }
          case "RESET": {
            setLoading(false);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (
      selected !== undefined &&
      currentStatus !== undefined &&
      deliveryOrders[selected].status !== currentStatus
    ) {
      setLoading(true);
      db.collection("deliveryOrders")
        .doc(selected)
        .set(
          {
            status: currentStatus,
          },
          { merge: true }
        )
        .then(() => {
          if (currentStatus === "DONE") {
            deleteDeliveryOrder();
          } else {
            let newDos: any = deliveryOrders;
            newDos[selected] = {
              ...deliveryOrders[selected],
              status: currentStatus,
            };
            setDeliveryOrders(newDos);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
  }, [currentStatus]);

  useEffect(() => {
    if (selected !== undefined) {
      setCurrentStatus(deliveryOrders[selected].status);
    }
  }, [selected]);

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
            <ButtonDropdown
              className="mr-2"
              isOpen={dropdownButton}
              toggle={toggle}
            >
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

  const toggleSelected = (id: string) => {
    if (id === selected) {
      setSelected(undefined);
    } else {
      setSelected(id);
    }
  };

  const deleteDeliveryOrder = () => {
    if (selected !== undefined) {
      const tempOrders = deliveryOrders;
      delete tempOrders[selected];

      setSelected(undefined);
      setDeliveryOrders(tempOrders);
      db.collection("deliveryOrders").doc(selected).set(
        {
          active: false,
        },
        { merge: true }
      );
    }
  };

  //fatch price config
  const priceConfig = async () => {
    if (selected !== undefined) {
      let doc = await firebase
        .firestore()
        .collection("priceConfig")
        .doc("config")
        .get();
      if (doc.exists) {
        let allPrices: any = doc.data();
        priceDetails = allPrices[deliveryOrders[selected].modelName];
      }
    }
  };

  //fatch insuranceconfig
  const insuranceConfig = async () => {
    if (selected !== undefined) {
      const doc = await firebase
        .firestore()
        .collection("insuranceConfig")
        .doc("config")
        .get();
      if (doc.exists) {
        insuranceDetails = doc.data();
      }
    }
  };



  // TODO: Make fetching data if it does not exist common
  const fetchDeliveryOrder = () => {
    debugger;
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any,
        additionalInfo: any,
        vehicleInfo: any,
        userinfo: any;
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
                            db.collection("users")
                              .doc(order.createdBy)
                              .get()
                              .then((doc) => {
                                if (doc.exists) {
                                  userinfo = doc.data();

                                  const fullDetails = {
                                    ...deliveryOrders[selected],
                                    userInfo,
                                    customerInfo,
                                    vehicleInfo,
                                    additionalInfo,
                                    userinfo,
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
              }
            })
            .catch((error) => reject(error));
        });
      }
    }
  }; // -> should return true or false promise

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

  const createDO = async () => {
    debugger;
    try {
      setLoading(true);
      const status: any = await fetchDeliveryOrder();
      if (status) {
        setShowModal(!showModal);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create invoice
  const createInvoice = async () => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INVOICE",
            data: deliveryOrders[selected],
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create insurance
  const createInsurance = async (insuranceCompany: string) => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        await insuranceConfig();
        await priceConfig();
        const status: any = await fetchDeliveryOrder();

        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INSURANCE",
            data: {
              ...deliveryOrders[selected],
              insuranceCompany,
              priceDetails,
              insuranceDetails,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create erp data
  const createRegistration = async () => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        await priceConfig();
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_REGISTRATION",
            data: {
              ...deliveryOrders[selected],
              priceDetails,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateDeliveryOrders = () => {
    if (user && (user.createdBy || user.uid)) {
      setLoadingPage(true);
      const dealerId = user.createdBy || user.uid || "";
      db.collection("deliveryOrders")
        .where("dealerId", "==", dealerId)
        .get()
        .then((querySnapshot) => {
          let dOs: any = deliveryOrders;
          querySnapshot.docChanges().forEach((change) => {
            if (!(change.doc.id in dOs) && change.doc.data().active) {
              dOs[change.doc.id] = {
                ...change.doc.data(),
                id: change.doc.id,
              };
            } else if (change.doc.id in dOs && !change.doc.data().active) {
              delete dOs[change.doc.id];
            } else if (change.doc.id in dOs && change.doc.data().active) {
              dOs[change.doc.id] = {
                ...dOs[change.doc.id],
                ...change.doc.data(),
              };
            }
          });
          setDeliveryOrders(dOs);
          setLoadingPage(false);
        });
    }
    if (selected !== undefined) {
      setCurrentStatus(deliveryOrders[selected].status);
    }
  };
//edit do
  const editDO =  async (ev: React.SyntheticEvent) => {
    debugger
    ev.stopPropagation();
   
    try {
      setLoading(true);
      const status: any = await fetchDeliveryOrder();
      if (status) {
        setShowModal(!showModal);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //print DO
  const printPage = useReactToPrint({
    content: () => deliveryOrderTableRef.current,
    copyStyles: true,
    onAfterPrint: () => {
      if (selected !== undefined) {
        setShowModal(false);
        if (currentStatus === "PENDING") {
          setCurrentStatus("DO_CREATED");
        } else {
          setCurrentStatus("INVOICE_CREATED");
        }
      }
    },
  });

  //close model onclick on close button
  const closeModal = async () => {
    setShowModal(!showModal);
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="overlay" onClick={(ev) => ev.preventDefault()}></div>
      )}

      <Header />
      {/* Page content */}
      <Container className="mt--7">
        {/* {showModal && getModal("DO" || "INVOICE")} */}
        {showModal && selected !== undefined && (
          <Modal
            isOpen={showModal}
            toggle={() => setShowModal(!showModal)}
            backdrop="static"
            keyboard={false}
            size="lg"
            onExit={() => closeModal()}
          >
            <ModalHeader
              className="p-4"
              tag="h3"
              toggle={() => setShowModal(!showModal)}
            >
              {deliveryOrders[selected].status === "PENDING"
                ? "Delivery Order"
                : "Invoice"}
            </ModalHeader>
            <ModalBody className="px-4 py-0">
              {deliveryOrders[selected].status === "PENDING" ? (
                <DeliveryOrderTable
                  ref={deliveryOrderTableRef}
                  deliveryOrder={deliveryOrders[selected]}
                />
              ) : (
                <InvoiceTable
                  ref={deliveryOrderTableRef}
                  deliveryOrder={deliveryOrders[selected]}
                />
              )}
              <EditDo 
               ref={deliveryOrderTableRef}
               deliveryOrder={deliveryOrders[selected]}/>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={printPage}>
                Print
              </Button>{" "}
              <Button color="secondary" onClick={() => closeModal()}>
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
                  <Col
                    className="d-flex justify-content-end align-items-center"
                    xs="6"
                  >
                    {!loadingPage && selected !== undefined && (
                      <>
                        <Button
                          className="small-button-width my-2"
                          color={"danger"}
                          disabled={loading}
                          onClick={deleteDeliveryOrder}
                          size="sm"
                        >
                          Delete
                        </Button>
                        {getActionButton()}
                      </>
                    )}
                    <Button
                      className="my-2"
                      color={"primary"}
                      disabled={loadingPage}
                      onClick={updateDeliveryOrders}
                      size="sm"
                    >
                      <i className="fas fa-sync-alt" />
                    </Button>
                  </Col>
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
                  {Object.values(deliveryOrders).length > 0 ? (
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
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(deliveryOrders).map(
                          (currElem: any, index: number) =>
                            currElem.active && (
                              <tr
                                key={currElem.id}
                                onClick={() => toggleSelected(currElem.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <td scope="row" className="text-center">
                                  <Input
                                    className="position-relative"
                                    type="checkbox"
                                    color="primary"
                                    disabled={!!loading}
                                    checked={currElem.id === selected}
                                    style={{ cursor: "pointer" }}
                                    onChange={() => toggleSelected(currElem.id)}
                                  />
                                </td>
                                <td>{currElem.name}</td>
                                <td>{currElem.modelName}</td>
                                <td>{currElem.color}</td>
                                <td>
                                  <Button
                                    className="small-button-width my-2"
                                    color={"danger"}
                                    disabled={loading}
                                    onClick={editDO}
                                    size="sm"
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            )
                        )}
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
