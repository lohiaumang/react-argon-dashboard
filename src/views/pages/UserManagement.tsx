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
import firebase from "firebase/app";
import "firebase/auth";
export interface SignUpError {
  code: string;
  message: string;
}
export interface SignUpSuccess {
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


const UserManagement:React.FC=()=> {
  const [name, setName] = useState<string>("Rahul");
  const [email, setEmail] = useState<string>("rahul@gmail.com");
  const [password, setPassword] = useState<string>("Qwerty@123");
  const [role, setRole] = useState<string>("salesman");
  const [signUpError, setSignUpError] = useState<SignUpError>();
  const [signUpSuccess, setSignUpSuccess] = useState<SignUpSuccess>();
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
console.log(userData)
  useEffect(() => {
    if (signUpSuccess) {
      setTimeout(() => setSignUpError(undefined), 1500);
    }
  }, [signUpSuccess]);


  //get user data
const currentUser = firebase.auth().currentUser;

const getUserData=(uid: string)=>{
  useEffect(()=>{
  firebase.firestore().collection('users')
  .where('createdBy', '==', uid)
  .where('role', 'in', ['salesman', 'office'])
  .onSnapshot
  (function(querySnapshot){
 setUserData(
   querySnapshot.docs.map((doc)=>({
     id:doc.id,
     name:doc.data().name,
     email:doc.data().email,
     role:doc.data().role,
   }))
   );
  });
},[])
}
if (currentUser && currentUser.uid) {
  getUserData(currentUser.uid);
}

  // const getUserData = (uid: string) => {
  //   useEffect(()=>{
  //    const usersRef = firebase.firestore().collection('users')
  //    usersRef
  //        .where('createdBy', '==', uid)
  //        .where('role', 'in', ['salesman', 'office'])
  //        .get()
  //        .then(querySnapshot => {
  //            querySnapshot.forEach(doc => {
  //                const info = doc.data()
  //                console.log(info)
  //                 setUserData(info);
  //            })
            
  //        })
  //    },[])
  //  };
    


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
                message: data.resp.result!,
                
              });
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
                      {signUpError && (
                <small className="text-danger">{signUpError.message}</small>
              )}
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
                          {loading ? <Loading /> : "Create"}
                         
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
                    {userData.map((curElem:any)=>{
                      return(
                        <tr>
                        <th scope="row">{curElem.name}</th>
                        <td>{curElem.email}</td>
                        <td>{curElem.role}</td>
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
                      )

                    })}
                      
                    </tbody>
                  </Table>
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
  }

export default withFadeIn(UserManagement);
