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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Label,
  Alert,
} from "reactstrap";
import firebase from "firebase/app";
import Loading from "../../components/Share/Loading";

export interface SignUpError {
  code: string;
  message: string;
}

declare global {
  interface Window {
    api: any;
  }
}

const CreateAccount: React.FC = () => {
  const [name, setName] = useState<string>("Auto Auto");
  const [email, setEmail] = useState<string>("auto@auto.com");
  const [phoneNumber, setPhoneNumber] = useState<string>("9999955555");
  const [password, setPassword] = useState<string>("Qwerty@123");
  const [confirmPassword, setConfirmPassword] = useState<string>("Qwerty@123");
  const [gst, setGst] = useState<string>("18AABCU9603R1ZM");
  const [pan, setPan] = useState<string>("AABCU9603R");
  const [address, setAddress] = useState<string>("Home");
  const [temporaryCertificate, setTemporaryCertificate] = useState<string>(
    "Registration"
  );
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [termsAndCondition, setTermsAndCondition] = useState<boolean>(true);
  const [signUpError, setSignUpError] = useState<SignUpError>();
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      termsAndCondition &&
      signUpError &&
      signUpError.code === "TERMS_AND_CONDITIONS"
    ) {
      setSignUpError(undefined);
    }
  }, [termsAndCondition]);

  useEffect(() => {
    if (signUpSuccess) {
      setSignUpError(undefined);
    }
  }, [signUpSuccess]);

  const signUp = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!termsAndCondition) {
      setSignUpError({
        code: "TERMS_AND_CONDITIONS",
        message: "Please accept the terms and conditions",
      });
      return;
    } else if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    const user = {
      name,
      phoneNumber: `+91${phoneNumber}`,
      email,
      password,
      gst,
      pan,
      address,
      temporaryCertificate,
      termsAndCondition,
      role: "dealer",
    };

    if (window && window.api) {
      window.api.send("toMain", {
        type: "CREATE_USER",
        data: user,
      });
      window.api.receive("fromMain", (data: any) => {
        console.log("User Created!", data);
      });
    }
  };

  return (
    <>
      <Col lg="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            <div className="text-muted text-center mt-2 mb-3">
              <p className="h3">Sign Up</p>
              <small>
                We require some details about your delearship to better service
                your needs and create proper documents for your use.Sign up
                below and get started!
              </small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={signUp}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    required
                    placeholder="Dealership name"
                    type="text"
                    value={name}
                    onChange={(ev) => setName(ev.target.value!)}
                  />
                </InputGroup>
              </FormGroup>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value!)}
                        pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                        title="Email should be in the format abc@xyz.def"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-mobile-button" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Phone number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(ev) => setPhoneNumber(ev.target.value!)}
                        pattern="^\d{10}$"
                        title="Phone number should exactly contain 10 digits"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value!)}
                        pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                        title="Password should contain uppercase letter, lowercase letter, number, and special chatacter"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Confirm password"
                        type="password"
                        value={confirmPassword}
                        onChange={(ev) => {
                          setConfirmPassword(ev.target.value!);
                          setPasswordMatch(password === ev.target.value!);
                        }}
                      />
                    </InputGroup>
                    {!passwordMatch && (
                      <small className="text-danger">
                        Please make sure your passwords match
                      </small>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-single-copy-04" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="GST"
                        type="text"
                        value={gst}
                        onChange={(ev) => setGst(ev.target.value!)}
                        pattern="^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}$"
                        title="GST number should be valid and 15 digits long"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-money-coins" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="PAN"
                        type="text"
                        value={pan}
                        onChange={(ev) => setPan(ev.target.value!)}
                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                        title="PAN number should be valid and 10 digits long"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    required
                    placeholder="Address"
                    type="text"
                    value={address}
                    onChange={(ev) => setAddress(ev.target.value!)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-paper-diploma" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    required
                    placeholder="Temporary registration"
                    type="text"
                    value={temporaryCertificate}
                    onChange={(ev) => setTemporaryCertificate(ev.target.value!)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={termsAndCondition}
                    onChange={(ev) => {
                      setTermsAndCondition(ev.target.checked!);
                    }}
                  />{" "}
                  I agree to these <a href="#">terms and conditions</a>
                </Label>
              </FormGroup>
              {signUpError && (
                <small className="text-danger">{signUpError.message}</small>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  {loading ? <Loading /> : "Sign Up"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-center" xs="12">
            <small>Already have an account? </small>
            <a className="text-light" href="/login">
              <small>Sign In</small>
            </a>
          </Col>
        </Row>
      </Col>
      <Alert
        className="position-fixed bottom-0 start-50 translate-middle-x"
        color="primary"
        isOpen={signUpSuccess}
      >
        User created successfully!
      </Alert>
    </>
  );
};

export default CreateAccount;
