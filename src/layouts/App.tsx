import React, { useState, useEffect, useReducer } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import Loading from "../components/Share/Loading";
import AdminLayout from "./Admin";
import AuthLayout from "./Auth";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((User) => {
      setUser(User);
      setLoading(false);
    });
  }, []);

  const getRoutes = () => {
    return user ? (
      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/index" />
      </Switch>
    ) : (
      <Switch>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Redirect from="/" to="/auth/login" />
      </Switch>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        getRoutes()
      )}
    </>
  );
};

export default App;
