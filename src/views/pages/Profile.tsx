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
import React, { useState, useEffect } from "react";

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
  Alert,
} from "reactstrap";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// core components
import UserHeader from "../../components/Headers/UserHeader";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import SmallLoading from "../../components/Share/SmallLoading";

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
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [passwordUpdateError, setPasswordUpdateError] = useState<{
    code: string;
    message: string;
  }>();
  const [userInfoUpdateError, setUserInfoUpdateError] = useState<{
    code: string;
    message: string;
  }>();
  const [success, setSuccess] = useState<{ message: string }>();
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordUpdateError({
        code: "PASSWORD_MISMATCH",
        message: "Please make sure your passwords match",
      });
    } else {
      setPasswordUpdateError(undefined);
    }
  }, [confirmPassword]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(undefined), 1500);
    }
  }, [success]);

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

  const changePassword = (ev: React.SyntheticEvent) => {
    setPasswordLoading(true);
    ev.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    if (currentUser && password) {
      currentUser
        .updatePassword(password)
        .then(() => {
          setPassword("");
          setConfirmPassword("");
          setSuccess({
            message: "Password updated successfully",
          });
          setPassword("");
          setConfirmPassword("");
          setPasswordLoading(false);
        })
        .catch((err) => {
          setPasswordUpdateError(err);
          setPasswordLoading(false);
        });
    }
  };

  const saveProfileChanges = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    setUserInfoLoading(true);
    if (currentUser) {
      const userDocRef = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);

      userDocRef
        .update(userInfo)
        .then(function () {
          window.api.send("toMain", {
            type: "SET_DEALER",
            data: userInfo,
          });
          setSuccess({
            message: "User information updated successfully",
          });
          setDisabled(true);
          setUserInfoLoading(false);
        })
        .catch(function (error) {
          setUserInfoUpdateError(error);
          setUserInfoLoading(false);
        });
    }
  };

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
                </Row>
              </CardHeader>
              {/*THEIRS*/}
              <CardBody>
                <Form onSubmit={saveProfileChanges}>
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        User information
                      </h6>
                    </Col>
                    <Col className="text-right" xs="4">
                      {disabled ? (
                        <Button
                          className="small-button-width"
                          color={"primary"}
                          onClick={() => setDisabled(false)}
                          size="sm"
                        >
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="small-button-width"
                            color={"danger"}
                            onClick={(e) => {
                              const uid = currentUser ? currentUser.uid : "";
                              getSetUserData(uid);
                              setDisabled(true);
                            }}
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="small-button-width"
                            color={"success"}
                            type="submit"
                            size="sm"
                          >
                            {userInfoLoading ? <SmallLoading /> : "Save"}
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
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
                            id="input-dealership-name"
                            value={userInfo.name}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                name: ev.target.value!,
                              })
                            }
                            placeholder="Dealership name"
                            type="text"
                            disabled={disabled || userInfoLoading}
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
                            id="input-email"
                            value={userInfo.email}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                email: ev.target.value!,
                              })
                            }
                            placeholder="abc@xyz.def"
                            type="email"
                            disabled={disabled || userInfoLoading}
                            pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                            title="Email should be in the format abc@xyz.def"
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
                            id="input-phone-number"
                            value={userInfo.phoneNumber}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                phoneNumber: ev.target.value!,
                              })
                            }
                            placeholder="9999999999"
                            type="tel"
                            disabled={disabled || userInfoLoading}
                            pattern="^\d{10}$"
                            title="Phone number should exactly contain 10 digits"
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
                            id="input-gst"
                            value={userInfo.gst}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                gst: ev.target.value!,
                              })
                            }
                            placeholder="12AAAAA0000A1Z5"
                            type="text"
                            disabled={disabled || userInfoLoading}
                            pattern="^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}$"
                            title="GST number should be valid and 15 digits long"
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
                            id="input-pan-number"
                            value={userInfo.pan}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                pan: ev.target.value!,
                              })
                            }
                            placeholder="AAAAA0000A"
                            type="text"
                            disabled={disabled || userInfoLoading}
                            pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                            title="PAN number should be valid and 10 digits long"
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
                            id="input-address"
                            value={userInfo.address}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                address: ev.target.value!,
                              })
                            }
                            placeholder="House No. 2, Street No. 44, Example lane, City, State - Zipcode"
                            type="text"
                            disabled={disabled || userInfoLoading}
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
                            id="input-temporary-registration"
                            value={userInfo.temporaryCertificate}
                            onChange={(ev) =>
                              setUserInfo({
                                ...userInfo,
                                temporaryCertificate: ev.target.value!,
                              })
                            }
                            placeholder="AB01CD235 UPTO 11/11/2011 XYZ AB 123456"
                            type="text"
                            disabled={disabled || userInfoLoading}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {userInfoUpdateError && (
                      <small className="text-danger">
                        {userInfoUpdateError.message}
                      </small>
                    )}
                  </div>
                  <hr className="my-4" />
                </Form>
                <Form onSubmit={changePassword}>
                  {/* Change password */}
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Change Password
                      </h6>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        className="small-button-width"
                        color={"danger"}
                        onClick={() => {
                          setPassword("");
                          setConfirmPassword("");
                        }}
                        disabled={
                          !(password || confirmPassword) || userInfoLoading
                        }
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="small-button-width"
                        color={"success"}
                        type="submit"
                        size="sm"
                        disabled={
                          !(password || confirmPassword) || userInfoLoading
                        }
                      >
                        {passwordLoading ? <SmallLoading /> : "Save"}
                      </Button>
                    </Col>
                  </Row>
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
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value!)}
                            pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                            title="Password should contain uppercase letter, lowercase letter, number, and special chatacter"
                            disabled={passwordLoading}
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
                            value={confirmPassword}
                            onChange={(ev) =>
                              setConfirmPassword(ev.target.value!)
                            }
                            pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                            title="Password should contain uppercase letter, lowercase letter, number, and special chatacter"
                            disabled={passwordLoading}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {passwordUpdateError && (
                      <small className="text-danger">
                        {passwordUpdateError.message}
                      </small>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {success && (
        <div className="position-fixed bottom-0 right-0 w-100 d-flex justify-content-center">
          <Alert color="primary">{success.message}</Alert>
        </div>
      )}
    </>
  );
};

export default withFadeIn(Profile);
