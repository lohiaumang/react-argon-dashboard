/* eslint-disable jsx-a11y/label-has-associated-control */
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
import React, { useState, useRef } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from "reactstrap";
import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
// core components
import UserHeader from "../../components/Headers/UserHeader";
import { withFadeIn } from "../../components/HOC/withFadeIn";

declare global {
  interface Window {
    api: any;
  }
}

interface UserInfo {
  name: string;
  phoneNumber: string;
  email: string;
  gst: string;
  pan: string;
  address: string;
  temporaryCertificate: string;
  uid: string;
}

const Profile: React.FC = () => {
  const currentUser = firebase.auth().currentUser;
  const formRef = useRef(null);
  const [disabled, setDisabled] = useState<boolean>(true);
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

  if (window && window.api) {
    window.api.receive("fromMain", (data: any) => {
      switch (data.type) {
        case "GET_DEALER_SUCCESS": {
          console.log("User fetch succeeded");
          setUserInfo(data.userData);
          break;
        }
        case "GET_DEALER_FAILURE": {
          console.log("User fetch failed");
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser!.uid!)
            .onSnapshot((doc) => {
              if (doc.exists) {
                const userInfo = doc.data();

                if (userInfo) {
                  // SET_USER
                  setUserInfo({
                    name: userInfo.name,
                    phoneNumber: userInfo.phoneNumber,
                    email: userInfo.email,
                    gst: userInfo.gst,
                    pan: userInfo.pan,
                    address: userInfo.address,
                    temporaryCertificate: userInfo.temporaryCertificate,
                    uid: userInfo.uid,
                  });
                }
              }
            });
          break;
        }
      }
    });
    if (!userInfo.email && currentUser && currentUser.email) {
      window.api.send("toMain", {
        type: "GET_DEALER",
        data: {
          uid: currentUser.uid,
        },
      });
    }
  }

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {disabled ? (
                      <Button
                        color={"primary"}
                        onClick={() => setDisabled(false)}
                        size="sm"
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          color={"danger"}
                          onClick={(e) => {
                            if (formRef) {
                              console.log(formRef.current);
                            }
                            setDisabled(true);
                          }}
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          color={"success"}
                          onClick={(e) => e.preventDefault()}
                          size="sm"
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              {/*THEIRS*/}
              <CardBody>
                <Form ref={formRef}>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-dealership-name"
                          >
                            Dealership name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.name}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                name: ev.target.value!,
                              })
                            }
                            id="input-dealership-name"
                            placeholder="Dealership name"
                            type="text"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.email}
                            id="input-email"
                            placeholder="abc@xyz.def"
                            type="email"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone-number"
                          >
                            Phone number
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.phoneNumber}
                            id="input-phone-number"
                            placeholder="9999999999"
                            type="tel"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-gst"
                          >
                            GST
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.gst}
                            id="input-gst"
                            placeholder="12AAAAA0000A1Z5"
                            type="text"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-pan-number"
                          >
                            PAN
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.pan}
                            id="input-pan-number"
                            placeholder="AAAAA0000A"
                            type="text"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.address}
                            id="input-address"
                            placeholder="House No. 2, Street No. 44, Example lane, City, State - Zipcode"
                            type="text"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-temporary-registration"
                          >
                            Temporary Registration
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userInfo.temporaryCertificate}
                            id="input-temporary-registration"
                            placeholder="AB01CD235 UPTO 11/11/2011 XYZ AB 123456"
                            type="text"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Change Password
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder="*******"
                            type="password"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-confirm-password"
                          >
                            Confirm password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-confirm-password"
                            placeholder="*******"
                            type="password"
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withFadeIn(Profile);
