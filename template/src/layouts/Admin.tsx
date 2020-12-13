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
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// Routes
import routes from "../routes";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/Sidebar";

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
  subMenu?: {
    path: string;
    name: string;
    icon: string;
    component: () => JSX.Element;
    layout: string;
  }[];
}[];

class Admin extends React.Component<Props> {
  getRoutes = (layoutRoutes: RouteType) => {
    return layoutRoutes.map((prop, key) => {
      if (prop.layout === "/admin" && !prop.subMenu) {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={() => <prop.component />}
            key={key}
          />
        );
      }
      else if (prop.subMenu) {
        return prop.subMenu !== undefined && prop.subMenu.map((prop, key) => {
          return (
            <Route
              exact
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        });
      }
      return null;
    });
  };

  getBrandText = (path: string) => {
    for (let i = 0; i < routes.length; i += 1) {
      let menu = routes[i];
      if (path.includes(menu.layout + menu.path) && !menu.subMenu) {
        return menu.name;
      }
      if (menu.subMenu) {
        for (let j = 0; j < menu.subMenu.length; j++) {
          let subMenu = menu.subMenu[j];
          if (path === (subMenu.layout + subMenu.path)) {
            console.log(path);
            return subMenu.name;
          }
        }
      }
    }
    return "Brand";
  };

  render() {
    const { location } = this.props;
    const { pathname } = location;
    return (
      <>
        <Sidebar
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          routes={routes}
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
            {...this.props}
            brandText={this.getBrandText(pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
