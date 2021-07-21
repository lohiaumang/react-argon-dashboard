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
import React, { useState, useEffect, useRef, useContext } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import firebase from "firebase/app";
import "firebase/firestore";

import Header from "../components/Headers/Header";
import MonthWiseDelevery from "../../src/components/Tables/MonthWiseDelevery";
import { withFadeIn } from "../components/HOC/withFadeIn";
import modelData from "../model-data";

// class Index extends React.Component<
//   {},
//   { activeNav: number; chartExample1Data: string }
// > {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       activeNav: 1,
//       chartExample1Data: "data1",
//     };
//   }

//   toggleNavs = (e: React.MouseEvent, index: number) => {
//     e.preventDefault();
//     const { chartExample1Data } = this.state;
//     this.setState({
//       activeNav: index,
//       chartExample1Data: chartExample1Data === "data1" ? "data2" : "data1",
//     });
//     // this.chartReference.update();
//   };

//   render() {
//     const { activeNav, chartExample1Data } = this.state;
const Index: React.FC = () => {
  const [dateWiseData, setDateWiseData] = useState<any>([]);
  // const [deliveryOrders, setDeliveryOrders] = useState<any>([]);
  const monthWiseDeliveryOrderTableRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  const dataCount = dateWiseData.length;
  console.log(dateWiseData);

  const currentUser = firebase.auth().currentUser;
  // const pageSize = 10;
  const getUserData = (uid: string) => {
    useEffect(() => {
      firebase
        .firestore()          
        .collection("deliveryOrders")
        .where("dealerId", "==", uid)
        .where("active", "==", true)
        //.where("createdOn", ">=", currentweek)
        //.where("createdOn", "<", today)

        .onSnapshot(function (querySnapshot) {
          setDateWiseData(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              modelName: doc.data().modelName,
              color: doc.data().color,
              createdOn: doc.data().createdOn,
            }))
          );
        });
    }, []);
  };

  // const getUserData = (uid: string) => {
  //   let users: any = {};
  //   let loadedPosts: any = {};
  //   useEffect(() => {
  //     debugger;
  //     firebase
  //       .firestore()
  //       .collection("deliveryOrders")
  //       .where("dealerId", "==", uid)
  //       .where("active", "==", true)
  //       .get()
  //       .then((results) => {
  //         results.forEach((doc) => {
  //           users[doc.id] = doc.data();
  //         });
  //         const posts = firebase.firestore().collection("additionals");
  //         posts.get().then((docSnaps) => {
  //           docSnaps.forEach((doc) => {
  //             loadedPosts[doc.id] = doc.data();
  //             loadedPosts[doc.id].price = users[doc.data().name];
  //           });
  //         });
  //         console.log(loadedPosts);
  //         //.where("createdOn", ">=", currentweek)
  //         //.where("createdOn", "<", today)

  //         // .onSnapshot(function (querySnapshot) {
  //         //   setDateWiseData(
  //         //     querySnapshot.docs.map((doc) => ({
  //         //       id: doc.id,
  //         //       name: doc.data().name,
  //         //       modelName: doc.data().modelName,
  //         //       color: doc.data().color,
  //         //       createdOn: doc.data().createdOn,
  //         //     }))
  //         //   );
  //       });
  //   }, []);
  // };



  //month wise data
  if (currentUser && currentUser.uid) {
    getUserData(currentUser.uid);
  }

  const today = new Date();
  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 30
  );
  const todayDate = new Date(today).getTime();
  const monthDay = new Date(currentMonth).getTime();
  const monthWiseData = dateWiseData.filter(
    (d: { createdOn: string | number | Date }) => {
      let time = new Date(d.createdOn).getTime();
      return monthDay < time && time < todayDate;
    }
  );

  const weekToday = new Date();
  const currentWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const weekDate = new Date(weekToday).getTime();
  const weekDay = new Date(currentWeek).getTime();
  const weekWiseData = dateWiseData.filter(
    (d: { createdOn: string | number | Date }) => {
      let time = new Date(d.createdOn).getTime();
      return weekDay < time && time < weekDate;
    }
  );

  // monthUiseData();
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            //active: activeNav === 1,
                          })}
                          href="#pablo"
                          //onClick={(e) => monthUiseData(e, 1)}
                          // onClick={() => monthUiseData()}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            // active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          // onClick={(e) => this.toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                {/* <div className="chart">
                    <Line
                      data={chartExample1[chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div> */}
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                    <p>{dataCount}</p>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                {/* <div className="chart">
                    <Bar
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Month Wise Order Details</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div> */}
                </Row>
              </CardHeader>
              <MonthWiseDelevery
                ref={monthWiseDeliveryOrderTableRef}
                monthWiseDeliveryOrder={monthWiseData}
              />
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Week Wise Order Details</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div> */}
                </Row>
              </CardHeader>
              <MonthWiseDelevery
                ref={monthWiseDeliveryOrderTableRef}
                monthWiseDeliveryOrder={weekWiseData}
              />
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow socialtraffic">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(Index);
