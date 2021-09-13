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
import React, { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container, Row, Col, Alert } from "reactstrap";

// core components
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AuthFooter from "../components/Footers/AuthFooter";
import { UserContext } from "../Context";
import getRoutes from "../get-routes";

type Props = {
  location: {
    pathname: string;
  };
  signInError: string;
};

type RouteType = {
  path: string;
  name: string;
  icon: string;
  component: () => JSX.Element;
  layout: string;
  isNavigable: boolean;
}[];

const Auth: React.FC<Props> = (props) => {
  const [user] = useContext(UserContext);
  const routes: RouteType = getRoutes(user);

  useEffect(() => {
    document.body.classList.add("bg-default");

    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  const createRoutes = (layoutRoutes: RouteType) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={Math.random()}
          />
        );
      }
      return null;
    });
  };

  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <div className="header bg-gradient-info py-5 py-lg-6">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="text-white">Welcome!</h1>
                  <p className="text-lead text-light">
                    Please create an account or sign into an existing account to
                    get started.
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Switch>{createRoutes(routes)}</Switch>
          </Row>
        </Container>
        {!!props.signInError && (
          <div className="position-fixed bottom-0 right-0 w-100 d-flex justify-content-center">
            <Alert color="primary" isOpen={!!props.signInError}>
              {props.signInError}
            </Alert>
          </div>
        )}
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
