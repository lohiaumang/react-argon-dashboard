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
import React, { useState } from "react";
import { NavLink as NavLinkRRD } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  NavLink,
  Row,
} from "reactstrap";
import Loading from "../../components/Share/Loading";

interface SignInError {
  a: string | null;
  code: string;
  message: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<SignInError | null>(null);

  const signIn = (ev: React.SyntheticEvent): void => {
    ev.preventDefault();

    setLoading(true);
    if (username && password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(username!, password!)
        .then((userCredential) => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setSignInError(err);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            <div className="text-muted text-center mt-2 mb-3">
              <p className="h3">Sign In</p>
              <small>Enter your credentials to get started</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={signIn}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value!)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value!)}
                  />
                </InputGroup>
              </FormGroup>
              {signInError && (
                <small className="text-danger">{signInError.message}</small>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  {loading ? <Loading /> : "Sign in"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          {/* <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col> */}
          <Col className="text-center">
            <small>
              <NavLink
                to={"/auth/create-account"}
                tag={NavLinkRRD}
                activeClassName="active"
              >
                Create new account
              </NavLink>
            </small>
            {/* <a className="text-light" href="/auth/create-account">
            </a> */}
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
