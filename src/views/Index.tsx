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
//import "firebase/firestore";

import Header from "../components/Headers/Header";
import MonthWiseDelevery from "../../src/components/Tables/MonthWiseDelevery";
import { UserContext } from "../Context";
import { result } from "lodash";
import WeekWiseDelevery from "../components/Tables/WeekWiseDelevery";

//import modelData from "../model-data";

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
  const [pendingData, setPendingData] = useState<any>([]);
  const [tatalSaleValue, settatalSaleValue] = useState<any>([]);
  const [user]: any = useContext(UserContext);
  const [weekWiseSale, setWeekWiseSale] = useState<any>([]);
  // const [deliveryOrders, setDeliveryOrders] = useState<any>([]);
  const weekWiseRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  const dataCount = dateWiseData.length;
  console.log(dateWiseData);

  const currentUser: any = firebase.auth().currentUser;
  // const pageSize = 10;

  useEffect(() => {
    firebase
      .firestore()
      .collection("deliveryOrders")
      .where("dealerId", "==", currentUser.uid)
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
    // firebase
    //   .firestore()
    //   .collection("deliveryOrders")
    //   .where("dealerId", "==", currentUser.uid)
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((eventDoc) => {
    //       setPendingData(eventDoc.data());

    //     });
    //   });
    // const currentdate:any = new Date();
    // var oneJan:any = new Date(currentdate.getFullYear(),0,1);
    // var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    // var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    // console.log(`The week number of the current date (${currentdate}) is ${result}.`);

    // const today:any = new Date();
    // const firstDayOfYear:any = new Date(today.getFullYear(), 0, 1);
    // const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    // let currenteel= Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    // console.log(currenteel);

    //   function ISO8601_week_no(dt:any) 
    // {

    const dt = new Date();
    let weekNumber: any;
    const tdt: any = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    weekNumber = 1 + Math.ceil((firstThursday - tdt) / 604800000);
    // }
    const dealerId = user.createdBy || user.uid || "";
    const docRef = firebase
      .firestore()
      .collection("byWeek")
      .doc(dealerId);
    docRef.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        tempData = tempData[weekNumber]
        // tempData.weekNumber;
        console.log(tempData, "get week wise data");
        setWeekWiseSale(tempData);
      }
    });

  }, []);

  console.log(pendingData, "Pending Data");
  ////////////////////////
  // useEffect(() => {
  //
  //   let data: any = {};
  //   firebase
  //     .firestore()
  //     .collection("additionals")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((additionalsDoc) => {
  //         let additionalsDocData = additionalsDoc.data();
  //         if (data[additionalsDoc.id] == undefined) {
  //           data[additionalsDoc.id] = additionalsDocData;
  //         }
  //       });
  //       let countEvents = 0;
  //       Object.keys(data).forEach((additionalsDocId) => {
  //         firebase
  //           .firestore()
  //           .collection("deliveryOrders")
  //           .where("additionalId", "==", additionalsDocId)
  //           .get()
  //           .then((snapshot) => {
  //             snapshot.forEach((eventDoc) => {
  //               var eventDocData = eventDoc.data();

  //               //Check if array exists, if not create it
  //               if (data[eventDocData.userId] == undefined) {
  //                 data[eventDocData.userId] = [];
  //               }

  //               data[eventDocData.userId].push(eventDocData);
  //             });

  //             if (countEvents == Object.keys(data).length) {
  //               //Lookup for events in every user has finished
  //             }
  //           });
  //       });
  //     });
  // }, []);

  // let totalSaleValue = 0;
  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection("additionals")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         totalSaleValue += Number(doc.data()["price"]);

  //         settatalSaleValue(totalSaleValue);
  //       });
  //     });
  // }, []);
  //console.log(totalSaleValue);

  /////////////////////////////
  //month wise data
  // if (currentUser && currentUser.uid) {
  //   getUserData(currentUser.uid);
  // }

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
                    <h3 className="text-white mb-0">₹{tatalSaleValue}</h3>
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
                ref={weekWiseRef}
                monthWiseDeliveryOrder={monthWiseData}
              />
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Week Wise Sale Details</h3>
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
              <WeekWiseDelevery
                ref={weekWiseRef}
                weekWiseData={weekWiseSale}
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

export default Index;
