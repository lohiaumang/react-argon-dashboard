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
  Button,
  Col,
  UncontrolledTooltip,
  FormGroup,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import { UserContext } from "../../Context";
import SmallLoading from "../../components/Share/SmallLoading";
import firebase from "firebase/app";
import "firebase/firestore";

const DeliveryOrders: React.FC = () => {
  const user: any = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [deliveryOrders, setDeliveryOrders] = useState<any>([]);
  const [deliveryOrdersData, setDeliveryOrdersData] = useState<any>([]);
  const [selected, setSelected] = useState<number>();
  const [dealerId, setDeliveryId] = useState<any>();
  console.log({dealerId})
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

  // const handleClick = () => {
  //   if (selected !== undefined) {
  //     setDeliveryId (deliveryOrders[selected].customerId);
  //   }
  // };


  const getCustomerData = (uid: any) => {
    debugger
    if (uid) {
      
      firebase
        .firestore()
        .collection("deliveryOrders")
        .where("customerId", "==", uid)
        .where("active", "==", "true")
        .onSnapshot(function (querySnapshot) {
          const dOs = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setDeliveryOrdersData(dOs);
           });
      // if (window && window.api) {
      //   window.api.receive("fromMain", (data: any) => {
      //     switch (data.type) {
      //       case "DELETE_USER_SUCCESS": {
            
      //         break;
      //       }
      //       case "DELETE_USER_FAILURE": {
            
             
      //         break;
      //       }
      //     }
      //   });
      //   window.api.send("toMain", {
      //     type: "DELETE_USER",
      //     data: user,
      //   });
      // }
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
                <h3 className="mb-0">Delivery Order </h3>
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
                            onChange={() => setSelected(index)}
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
            <Row>
            <Col className="text-right" xs="4">
              
                      <Button
                        className="small-button-width"
                        color={"success"}
                        onClick={() => getCustomerData(dealerId)}
                        disabled={false}
                        size="sm"
                      >
                        {loading ? <SmallLoading /> : "Erp"}
                      </Button>
                      <Button
                        className="small-button-width"
                        color={"success"}
                        type="submit"
                        size="sm"
                        disabled={false}
                      >
                        {loading ? <SmallLoading /> : "Create"}
                      </Button>
                    </Col>
                    </Row>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(React.memo(DeliveryOrders));
