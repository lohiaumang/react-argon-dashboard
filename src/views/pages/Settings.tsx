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
  Table,
  Alert,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
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

const Settings: React.FC = () => {
  const [name, setName] = useState<string>("Rahul");
  const [userEmail, setEmail] = useState<string>("rahul@gmail.com");
  const [password, setPassword] = useState<string>("Qwerty@123");
  const [role, setRole] = useState<string>("Saler");
  const [signUpError, setSignUpError] = useState<SignUpError>();
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (signUpError) {
      setSignUpError(undefined);
    }
  }, [signUpError]);

  useEffect(() => {
    if (signUpSuccess) {
      setSignUpError(undefined);
    }
  }, [signUpSuccess]);

  const userCreate = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    debugger;
    setLoading(true);

    const user = {
      name,
      userEmail,
      password,
      role,
    };

    if (window && window.api) {
      window.api.receive("fromMain", (data: any) => {
        switch (data.type) {
          case "CREATE_USER_SUCCESS": {
            setLoading(false);
            break;
          }
          case "CREATE_USER_FAILURE": {
            setLoading(false);
            setSignUpError({
              code: "FIREBASE_ERROR",
              message: data.err.message!,
            });
            break;
          }
        }
      });
      window.api.send("toMain", {
        type: "CREATE_USER",
        data: user,
      });
    }
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Admin Settings</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={userCreate}>
                  <h6 className="heading-small text-muted mb-4">
                    Create users
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Jane Doe"
                            type="text"
                            required
                            value={name}
                            onChange={(ev) => setName(ev.target.value!)}
                          />
                        </FormGroup>
                      </Col>
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
                            placeholder="bharat@example.com"
                            type="email"
                            required
                            value={userEmail}
                            onChange={(ev) => setEmail(ev.target.value!)}
                            pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                            title="Email should be in the format abc@xyz.def"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
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
                            required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value!)}
                            pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                            title="Password should contain uppercase letter, lowercase letter, number, and special chatacter"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-role"
                          >
                            Role
                          </label>
                          <Input
                            type="select"
                            name="select-role"
                            id="input-role"
                            required
                            placeholder="Role"
                            value={""}
                            onChange={(ev) => setRole(ev.target.value!)}
                          >
                            <option>Select</option>
                            <option value="salesman">Salesman</option>
                            <option value="office">Office staff</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {signUpError && (
                          <small className="text-danger">
                            {signUpError.message}
                          </small>
                        )}
                        <div className="float-right">
                          <Button color="danger">Cancel</Button>
                          <Button color="primary" type="submit">
                            {loading ? <Loading /> : "Create"}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
                <h6 className="heading-small text-muted mb-4">All users</h6>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Jane Doe</th>
                      <td>janedoe@email.com</td>
                      <td>Salesman</td>
                      <td className="text-right">
                        <Button color="danger" size="sm">
                          {/* <i className="fa fa-times fa-lg" /> */}
                          Delete
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
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

export default withFadeIn(Settings);
