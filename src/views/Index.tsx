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
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
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
import SalesManWiseSale from "../components/Tables/SalesManWiseSale";
import DashBoardStatus from "../components/Tables/DashBoardStatus";

const Index: React.FC = () => {
  const [user]: any = useContext(UserContext);
  const [weekWiseSale, setWeekWiseSale] = useState<any>([]);
  const [monthWiseSale, setMonthWiseSale] = useState<any>([]);
  const [salesManWiseSale, setSalesManWiseSale] = useState<any>([]);
  const [dashBoardStatus, setDashBoardStatus] = useState<any>([]);

  const weekWiseRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  // const dataCount = dateWiseData.length;


  const currentUser: any = firebase.auth().currentUser;
  // const pageSize = 10;

  useEffect(() => {

    //Get Week
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



    const dealerId = user.createdBy || user.uid || "";
    const docRef = firebase
      .firestore()
      .collection("byWeek")
      .doc(dealerId);
    docRef.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        tempData = tempData[weekNumber];
        console.log(tempData, "get week wise data");
        setWeekWiseSale(tempData);
      }
    });

    //Get Month
    const month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    const d = new Date();
    const currentMonth = month[d.getMonth()].toLowerCase();
    console.log(currentMonth)
    const docRef1 = firebase
      .firestore()
      .collection("byMonth")
      .doc(dealerId);
    docRef1.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        tempData = tempData[currentMonth];
        console.log(tempData, "get current month data");
        setMonthWiseSale(tempData);
      }
    });

    const docRef2 = firebase
      .firestore()
      .collection("bySalesMan")
      .doc(dealerId);
    docRef2.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        // tempData = tempData[weekNumber];
        console.log(tempData, "get week wise data");
        setSalesManWiseSale(tempData);
      }
    });


    const docRef3 = firebase
      .firestore()
      .collection("status")
      .doc(dealerId);
    docRef3.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        setDashBoardStatus(tempData);
      }
    });

  }, []);


  const weekTotalSale = () => {
    let totalsale: any = Object.keys(weekWiseSale);
    weekWiseSale[totalsale].totalsaleValue;
  }
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

  // const today = new Date();
  // const currentMonth = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate() - 30
  // );
  // const todayDate = new Date(today).getTime();
  // const monthDay = new Date(currentMonth).getTime();
  // const monthWiseData = dateWiseData.filter(
  //   (d: { createdOn: string | number | Date }) => {
  //     let time = new Date(d.createdOn).getTime();
  //     return monthDay < time && time < todayDate;
  //   }
  // );

  // const weekToday = new Date();
  // const currentWeek = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate() - 7
  // );
  // const weekDate = new Date(weekToday).getTime();
  // const weekDay = new Date(currentWeek).getTime();
  // const weekWiseData = dateWiseData.filter(
  //   (d: { createdOn: string | number | Date }) => {
  //     let time = new Date(d.createdOn).getTime();
  //     return weekDay < time && time < weekDate;
  //   }
  // );

  // monthUiseData();
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                    <h3 className="text-white mb-0">₹</h3>
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
                          onClick={(e) => weekTotalSale()}
                        >
                          <span className="d-none d-md-block">Week data</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <DashBoardStatus
          ref={weekWiseRef}
          dashBoardStatus={dashBoardStatus}
        />
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Month wise order details</h3>
                  </div>
                </Row>
              </CardHeader>
              <MonthWiseDelevery
                ref={weekWiseRef}
                monthWiseDeliveryOrder={monthWiseSale}
              />
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Week wise sale details</h3>
                  </div>
                </Row>
              </CardHeader>
              <WeekWiseDelevery
                ref={weekWiseRef}
                weekWiseData={weekWiseSale}
              />
            </Card>
          </Col>

          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">sales man wise sale details</h3>
                  </div>
                </Row>
              </CardHeader>
              <SalesManWiseSale
                ref={weekWiseRef}
                salesManWise={salesManWiseSale}
              />
            </Card>
          </Col>

        </Row>
      </Container>
    </>
  );
};

export default Index;
