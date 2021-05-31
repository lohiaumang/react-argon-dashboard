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
import React, { useState, useEffect,useContext } from "react";

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
  Nav,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import SmallLoading from "../../components/Share/SmallLoading";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
export interface SignUpError {
  code: string;
  message: string;
}
export interface SignUpSuccess {
  code: string;
  message: string;
}
export interface DeleteSuccess {
  code: string;
  message: string;
}

declare global {
  interface Window {
    api: any;
  }
}
interface UserInfo {
  name: string;
  email: string;
  role: string;
  uid: string;
}

const UserManagement: React.FC = () => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [role, setRole] = useState<string>();
  const [signUpError, setSignUpError] = useState<SignUpError>();
  const [signUpSuccess, setSignUpSuccess] = useState<SignUpSuccess>();
  const [deleteSuccess, setDeleteSuccess] = useState<DeleteSuccess>();
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Deleteloading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (signUpError) {
      setTimeout(() => setSignUpError(undefined), 1500);
    }
  }, [signUpError]);

  useEffect(() => {
    if (signUpSuccess) {
      setTimeout(() => setSignUpSuccess(undefined), 1500);
    }
  }, [signUpSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      setTimeout(() => setDeleteSuccess(undefined), 1500);
    }
  }, [deleteSuccess]);

  //get user data
  const currentUser = firebase.auth().currentUser;
  // const pageSize = 10;
  const getUserData = (uid: string) => {
    useEffect(() => {
      firebase
        .firestore()
        .collection("users")
        .where("createdBy", "==", uid)
        .where("role", "in", ["salesman", "office"])
        .onSnapshot(function (querySnapshot) {
          setUserData(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              role: doc.data().role,
            }))
          );
        });
    }, []);
  };

  if (currentUser && currentUser.uid) {
    getUserData(currentUser.uid);
  }
  // const pageCount = userData? Math.ceil(userData.length/pageSize):0;
  //  if(pageCount ===1) return null;
  //  const pages= _.range(1, pageCount+1);

  // const handleClick=(id: any)=>{
  //   firebase.firestore().collection('users').doc(id).delete();
  // }

  const deleteUser = (uid: any) => {
    debugger;
    setDeleteLoading(true);
    if (uid) {
      const user = {
        uid,
      };

      if (window && window.api) {
        window.api.receive("fromMain", (data: any) => {
          switch (data.type) {
            case "DELETE_USER_SUCCESS": {
              setDeleteLoading(false);
              setDeleteSuccess({
                code: "FIREBASE_ERROR",
                message: "User Delete Successfully.",
              });
              break;
            }
            case "DELETE_USER_FAILURE": {
              debugger;
              setDeleteLoading(false);
              setDeleteSuccess({
                code: "FIREBASE_ERROR",
                message: data.err.message!,
              });
              break;
            }
          }
        });
        window.api.send("toMain", {
          type: "DELETE_USER",
          data: user,
        });
      }
    }
  };

  const userCreate = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoading(true);
    if (currentUser) {
      const user = {
        name,
        email,
        password,
        role,
        createdBy: currentUser.uid,
      };

      if (window && window.api) {
        window.api.receive("fromMain", (data: any) => {
          switch (data.type) {
            case "CREATE_USER_SUCCESS": {
              setLoading(false);
              setSignUpSuccess({
                code: "FIREBASE_ERROR",
                message: data.resp.data.result,
              });
              setPassword("");
              setName("");
              setEmail("");
              setRole("");
              break;
            }
            case "CREATE_USER_FAILURE": {
              debugger;
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
                    <h3 className="mb-0">User Management</h3>
                    {signUpError && (
                      <small className="text-danger">
                        {signUpError.message}
                      </small>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={userCreate}>
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
                        onClick={() => {
                          setPassword("");
                          setName("");
                          setEmail("");
                          setRole("");
                        }}
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
                        {loading ? <SmallLoading /> : "Create"}
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
                            placeholder="janedoe@example.com"
                            type="email"
                            title="Email should be in the format abc@xyz.def"
                            required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value!)}
                            pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
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
                            value={role}
                            onChange={(ev) => setRole(ev.target.value!)}
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
                {userData.length > 0 && (
                  <>
                    <h6 className="heading-small text-muted mb-4">All users</h6>
                    {deleteSuccess && (
                      <small className="text-success">
                        {deleteSuccess.message}
                      </small>
                    )}
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Role</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.map((curElem: any) => {
                          return (
                            <tr key={curElem.id}>
                              <th scope="row">{curElem.name}</th>
                              <td>{curElem.email}</td>
                              <td>{curElem.role}</td>
                              <td className="text-right">
                                <Button
                                  className="small-button-width"
                                  color="danger"
                                  size="sm"
                                  onClick={() => deleteUser(curElem.id)}
                                >
                                  {/* {Deleteloading ? <Loading /> : "Delete"} */}
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </>
                )}
                {/* <Nav className="d-flex justify-content-center">
                    <ul className="pagination">
                      {
                        pages.map((page)=>{
                          <li className="page-link">{page}</li>
                        })
                      }
                      
                    </ul>
                  </Nav> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {signUpSuccess && (
        <div className="position-fixed bottom-0 right-0 w-100 d-flex justify-content-center">
          <Alert color="primary">{signUpSuccess.message}</Alert>
        </div>
      )}
    </>
  );
};

export default withFadeIn(UserManagement);
