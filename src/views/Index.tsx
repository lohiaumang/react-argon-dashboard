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
import ModelWiseDelevery from "../components/Tables/ModelWiseDelevery";
import SalesManWiseSale from "../components/Tables/SalesManWiseSale";
import DashBoardStatus from "../components/Tables/DashBoardStatus";

const Index: React.FC = () => {
  const [user]: any = useContext(UserContext);
  const [weekWiseSale, setWeekWiseSale] = useState<any>([]);
  const [modelWiseSale, setModelWiseSale] = useState<any>([]);
  const [monthWiseSale, setMonthWiseSale] = useState<any>([]);
  const [salesManWiseSale, setSalesManWiseSale] = useState<any>([]);
  const [dashBoardStatus, setDashBoardStatus] = useState<any>([]);
  const [currentSaleValue, setCurrentSaleValue] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("M");

  const weekWiseRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  // const dataCount = dateWiseData.length;

  const currentUser: any = firebase.auth().currentUser;
  // const pageSize = 10;

  useEffect(() => {
    let isCancelled = false;
    const dealerId = user.createdBy || user.uid || "";
    //Get Week
    const docRef = firebase.firestore().collection("byWeek").doc(dealerId);
    docRef.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        if (!isCancelled) {
          setWeekWiseSale(tempData);
        }
      }
    });

    //Get Month
    const docRef1 = firebase.firestore().collection("byMonth").doc(dealerId);
    docRef1.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        if (!isCancelled) {
          setMonthWiseSale(tempData);
        }
      }
    });

    //sales man wise
    const docRef2 = firebase.firestore().collection("bySalesMan").doc(dealerId);
    docRef2.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        if (!isCancelled) {
          setSalesManWiseSale(tempData);
        }
      }
    });
    //status count
    const docRef3 = firebase.firestore().collection("status").doc(dealerId);
    docRef3.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        if (!isCancelled) {
          setDashBoardStatus(tempData);
        }
      }
    });

    //modelWise
    const docRef4 = firebase.firestore().collection("byModel").doc(dealerId);
    docRef4.get().then((doc) => {
      if (doc.exists) {
        let tempData: any = doc.data();
        if (!isCancelled) {
          setModelWiseSale(tempData);
        }
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (selectedPeriod === "M" || !isCancelled) {
      monthTotalSale();
    } else if (selectedPeriod === "W") {
      weekTotalSale();
    }
    return () => {
      isCancelled = true;
    };
  }, [monthWiseSale, weekWiseSale, selectedPeriod]);

  const weekTotalSale = () => {
    let todaydate: any = new Date();
    let oneJan: any = new Date(todaydate.getFullYear(), 0, 1);
    let numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));
    let result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);
    if (weekWiseSale[result]) {
      setCurrentSaleValue(weekWiseSale[result].totalSaleValue);
    }
  };

  const monthTotalSale = () => {
    const dateObj = new Date();
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    if (monthWiseSale[monthName]) {
      setCurrentSaleValue(monthWiseSale[monthName].totalSaleValue);
    }
  };

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
                    <h3 className="text-white mb-0">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(currentSaleValue)}
                    </h3>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            //active: activeNav === 1,
                          })}
                          onClick={() => setSelectedPeriod("M")}
                          active={selectedPeriod === "M"}
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
                          onClick={() => setSelectedPeriod("W")}
                          active={selectedPeriod === "W"}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </Col>
        </Row>

        <DashBoardStatus ref={weekWiseRef} dashBoardStatus={dashBoardStatus} />
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">At a glance</h3>
                  </div>
                </Row>
              </CardHeader>
              <MonthWiseDelevery
                ref={weekWiseRef}
                monthWiseDeliveryOrder={monthWiseSale}
              />
              <WeekWiseDelevery ref={weekWiseRef} weekWiseData={weekWiseSale} />
              <ModelWiseDelevery
                ref={weekWiseRef}
                modelWiseData={modelWiseSale}
              />
              <SalesManWiseSale
                ref={weekWiseRef}
                salesManWise={salesManWiseSale}
              />
            </Card>
          </Col>
          {/* <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Week wise sale details</h3>
                  </div>
                </Row>
              </CardHeader>
              <WeekWiseDelevery ref={weekWiseRef} weekWiseData={weekWiseSale} />
            </Card>
          </Col>

          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Model wise sale details</h3>
                  </div>
                </Row>
              </CardHeader>
              <ModelWiseDelevery
                ref={weekWiseRef}
                modelWiseData={modelWiseSale}
              />
            </Card>
          </Col>

          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow weektable">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Sales man wise sale details</h3>
                  </div>
                </Row>
              </CardHeader>
              <SalesManWiseSale
                ref={weekWiseRef}
                salesManWise={salesManWiseSale}
              />
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

export default Index;
