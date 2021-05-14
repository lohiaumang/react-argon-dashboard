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
import React from "react";

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
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";

class Profile extends React.PureComponent {
  render() {
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
                      <h3 className="mb-0">User Management</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col xs="8">
                        <h6 className="heading-small text-muted mb-4">
                          Create Users
                        </h6>
                      </Col>
                      <Col className="text-right" xs="4">
                        <Button
                          className="small-button-width"
                          color={"danger"}
                          onClick={() => {}}
                          disabled={false}
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="small-button-width"
                          color={"success"}
                          type="submit"
                          size="sm"
                          disabled={false}
                        >
                          Create
                        </Button>
                      </Col>
                    </Row>
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
                              placeholder="janedoe@example.com"
                              type="email"
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
                            >
                              <option>Select</option>
                              <option value="salesman">Salesman</option>
                              <option value="office">Office staff</option>
                            </Input>
                          </FormGroup>
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
                          <Button
                            className="small-button-width"
                            color="danger"
                            size="sm"
                          >
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
      </>
    );
  }
}

export default withFadeIn(Profile);
