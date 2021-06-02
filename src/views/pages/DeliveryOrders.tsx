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
      firebase
        .firestore()
        .collection("deliveryOrders")
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

  useEffect(() => {
    if (selected !== undefined) {
      setDeliveryId (deliveryOrders[selected].customerId);
    }
  }, [selected]);


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
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
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
             
              {/* <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex={0}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter> */}
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
