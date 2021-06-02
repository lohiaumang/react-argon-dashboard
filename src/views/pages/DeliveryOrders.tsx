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
  UncontrolledTooltip,
  FormGroup,
  Button,
  Col,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import { UserContext } from "../../Context";
import firebase from "firebase/app";
import "firebase/firestore";

const DeliveryOrders: React.FC = () => {
  const user: any = useContext(UserContext);
  const [deliveryOrders, setDeliveryOrders] = useState<any>([]);
  const [selected, setSelected] = useState<number>();
  const db = firebase.firestore();

  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      const dealerId = user.createdBy || user.uid || "";
      db.collection("deliveryOrders")
        .where("dealerId", "==", dealerId)
        .where("active", "==", "true")
        .onSnapshot(function (querySnapshot) {
          const dOs = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setDeliveryOrders(dOs);
        });
    }
  }, []);

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
    if (selected === index) {
      setSelected(undefined);
    } else {
      setSelected(index);
    }
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                  <Col xs="8">
                    <h3 className="my-3">Delivery Order</h3>
                  </Col>
                  {selected !== undefined && (
                    <Col
                      className="d-flex justify-content-end align-items-center"
                      xs="4"
                    >
                      <Button
                        className="small-button-width my-2"
                        color={"danger"}
                        onClick={() => {}}
                        size="sm"
                      >
                        Delete
                      </Button>
                      <Button
                        className="small-button-width my-2"
                        color={"primary"}
                        onClick={handleFileInErp}
                        size="sm"
                      >
                        File in ERP
                      </Button>
                    </Col>
                  )}
                </Row>
              </CardHeader>
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
                      <tr key={curElem.id}>
                        <td scope="row" className="text-center">
                          <Input
                            className="position-relative"
                            type="checkbox"
                            color="primary"
                            checked={index === selected}
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
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(React.memo(DeliveryOrders));
