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
import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// Routes
import getRoutes from "../get-routes";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/Sidebar";
import { UserContext } from "../Context";

type Props = {
  location: {
    pathname: string;
  };
};

type RouteType = {
  path: string;
  name: string;
  icon: string;
  component: () => JSX.Element;
  layout: string;
  isNavigable: boolean;
}[];

const Admin: React.FC<Props> = (props) => {
  const [user] = useContext(UserContext);
  const { location } = props;
  const { pathname } = location;
  const routes: RouteType = getRoutes(user);

  const createRoutes = (layoutRoutes: RouteType) => {
    return layoutRoutes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={() => <prop.component />}
            key={key}
          />
        );
      }
      return null;
    });
  };

  const getBrandText = (path: string) => {
    for (let i = 0; i < routes.length; i += 1) {
      let menu = routes[i];
      if (path.includes(menu.layout + menu.path)) {
        return menu.name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        logo={{
          innerLink: "/admin/index",
          // eslint-disable-next-line global-require
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "Logo",
        }}
      />
      <div className="main-content">
        <AdminNavbar
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          brandText={getBrandText(pathname)}
        />
        <Switch>{createRoutes(routes)}</Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
