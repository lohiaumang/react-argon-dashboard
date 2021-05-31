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
import React,{useContext} from "react";
import Login from "./views/pages/Login";
import CreateAccount from "./views/pages/CreateAccount";
import UserManagement from "./views/pages/UserManagement";
import Settings from "./views/pages/Settings";
import Profile from "./views/pages/Profile";
import Index from "./views/Index";
import DeliveryOrders from "./views/pages/DeliveryOrders";
// import { UserContext } from "./Context";

// const user = useContext(UserContext);

const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-teal",
    component: () => <Index />,
    layout: "/admin",
    isNavigable: true,
  },
  {
    path: "/delivery-orders",
    name: "Delivery Orders",
    icon: "ni ni-single-copy-04 text-teal",
    component: () => <DeliveryOrders />,
    layout: "/admin",
    isNavigable: true,
  },
  {
    path: "/user-profile",
    name: "My Profile",
    icon: "fas fa-user text-teal",
    component: () => <Profile />,
    layout: "/admin",
    isNavigable: true,
  },
  {
    path: "/user-management",
    name: "User Management",
    icon: "fas fa-user-cog text-info",
    component: () => <UserManagement />,
    layout: "/admin",
    isNavigable: true,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "ni ni-settings-gear-65 text-info",
    component: () => <Settings />,
    layout: "/admin",
    isNavigable: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: () => <Login />,
    layout: "/auth",
    isNavigable: false,
  },
  {
    path: "/create-account",
    name: "Create Account",
    icon: "fas fa-user text-info",
    component: () => <CreateAccount />,
    layout: "/auth",
    isNavigable: false,
  },
];
export default routes;
