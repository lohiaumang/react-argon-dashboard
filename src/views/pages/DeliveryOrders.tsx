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
} from "../../components/Tables/DeliveryOrderTable";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import SmallLoading from "../../components/Share/SmallLoading";
import Loading from "../../components/Share/Loading";
import { UserContext } from "../../Context";
import firebase from "firebase/app";
import "firebase/firestore";

const DeliveryOrders: React.FC = () => {
  const user: any = useContext(UserContext);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [selected, setSelected] = useState<number>();
  const [showDO, setShowDO] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [dropdownButton, setDropdownButton] = useState(false);
  const db = firebase.firestore();

  const toggle = () => setDropdownButton(prevState => !prevState);

 
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
    }
  }, []);
  console.log({ deliveryOrders })

  const handleFileInErp = () => {
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any, additionalInfo: any, vehicleInfo: any;

      if (order.customerInfo && order.vehicleInfo && order.additionalInfo) {
        window.api.send("toMain", {
          type: "FILE_IN_ERP",
          data: order,
        });
      } else {
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
                            customerInfo: customerInfo,
                            vehicleInfo: vehicleInfo,
                            additionalInfo: additionalInfo,
                          };
                          const tempOrders = deliveryOrders;
                          tempOrders[selected] = fullDetails;
                          setDeliveryOrders(tempOrders);
                          window.api.send("toMain", {
                            type: "FILE_IN_ERP",
                            data: fullDetails,
                          });
                        }
                      });
                  }
                });
            }
          });
      }
    }
  };

  const toggleSelected = (index: number) => {
    debugger
    if (selected === index) {
      setSelected(undefined);
    } else {
      setSelected(index);
    }
  };

  const deleteDeliveryOrder = () => {
    debugger
    if (selected !== undefined) {
      const tempOrders = deliveryOrders;
      const selectedDoId = deliveryOrders[selected].id;
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

  const createDO = () => {
    debugger
    setLoading(true);
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any, additionalInfo: any, vehicleInfo: any;

      if (order.customerInfo && order.vehicleInfo && order.additionalInfo) {
        // setShowDO(!showDO);
        setLoading(false);
      } else {
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
                            customerInfo: customerInfo,
                            vehicleInfo: vehicleInfo,
                            additionalInfo: additionalInfo,
                          };
                          const tempOrders = deliveryOrders;
                          tempOrders[selected] = fullDetails;
                          setDeliveryOrders(tempOrders);
                          // setShowDO(!showDO);
                          setLoading(false);
                        }
                      });
                  }
                });
            }
          });
      }
    }
  };

  const inovoice = () => {
    debugger
    setLoading(true);
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any, additionalInfo: any, vehicleInfo: any;
      if (order.customerInfo && order.vehicleInfo && order.additionalInfo) {
        setShowDO(!showDO);
        setLoading(false);
      }
    }
  };

  const printPage = () => {
    window.print();
  };

  const getActionButton = () => {
    if (selected || selected===0) {
      debugger
      switch (deliveryOrders[selected].status) {
        case "PENDING": {
          return <>Create DO</>
        }
        case "DO_CREATED": {
          return <>
            <DropdownToggle caret size="sm" color={"primary"}>
              Create Insurance
          </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={()=> hdfc()}>HDFC</DropdownItem>
              <DropdownItem onClick={()=> icici()}>ICICI</DropdownItem>
            </DropdownMenu>
          </>
        }
        case "INVOICE_CREATED": {
          return <>Invoice Generator </>
        }
        case "ERP": {
          return <>Create ERP </>
        }
      }
    }
  }
 const icici =()=>{
   debugger
   alert("icici");
 }

 const hdfc =()=>{
  debugger
  alert("hdfc");
}

  const getFunction = () => {
    if (selected || selected===0) {
      debugger
      switch (deliveryOrders[selected].status) {
        case "PENDING": {
          return createDO()
        }
        case "DO_CREATED": {
          return <>Create Insurance</>
        }
        case "INVOICE_CREATED": {
          return inovoice()
        }
        case "ERP": {
          return handleFileInErp()
        }
      }
    }
  }

  // const setHidden = () => {
  //   console.log(document.body.style.overflow);
  //   if (document.body.style.overflow !== "hidden") {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "scroll";
  //   }
  // };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {showDO && selected !== undefined && (
          <Modal isOpen={showDO} toggle={getFunction} backdrop="static" keyboard={false} size="lg">
            <ModalHeader className="p-4" tag="h3" toggle={getFunction}>
              Delivery Order
            </ModalHeader>
            <ModalBody className="px-4 py-0">
              <DeliveryOrderTable deliveryOrder={deliveryOrders[selected]} />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={printPage}>
                Print
              </Button>{" "}
              <Button color="secondary" onClick={getFunction}>
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
                  {selected !== undefined && deliveryOrders[selected].status !== "DO_CREATED" && (
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
                      {/* <Button
                        className="small-button-width my-2"
                        color={"primary"}
                        onClick={handleFileInErp}
                        size="sm"
                      >
                        File in ERP
                      </Button> */}
                      <Button
                        className="small-button-width my-2"
                        color={"primary"}
                        onClick={getFunction}
                        size="sm"
                      >
                        {loading ? <SmallLoading /> : getActionButton()}
                      </Button>

                    </Col>
                  )}
                  {selected !== undefined && deliveryOrders[selected].status === "DO_CREATED" && (
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
                      <ButtonDropdown isOpen={dropdownButton} toggle={toggle}>
                        {loading ? <SmallLoading /> : getActionButton()}
                      </ButtonDropdown>
                    </Col>
                  )}
                </Row>
              </CardHeader>
              {loadingPage ? (
                <>
                  <div className="w-100 d-flex justify-content-center">
                    <Loading />
                  </div>
                  <hr className="my-4" />
                </>
              ) : (
                <div>
                  {deliveryOrders.length > 0 ? (
                    <Table className="align-items-center table-flush" responsive>
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
