import React, { useState, useEffect, useReducer } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import Loading from "../components/Share/Loading";
import AdminLayout from "./Admin";
import AuthLayout from "./Auth";
import { UserContext } from "../Context";

const App: React.FC = () => {
  const currentUser = firebase.auth().currentUser;
  const [loading, setLoading] = useState<boolean>(true);
  // TODO: SAVE IN CONTEXT
  const [user, setUser] = useState<object | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<any>();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((User) => {
      if (User && User.uid) {
        firebase
          .firestore()
          .collection("users")
          .where("uid", "==", User.uid)
          .onSnapshot(function (querySnapshot) {
            const doc = querySnapshot.docs ? querySnapshot.docs[0] : null;
            if (doc && doc.exists && doc.data()) {
              setCurrentUserDetails(doc.data());
              setUser(User);
              setLoading(false);
            }
          });
      } else if (User === null) {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const getRoutes = () => {
    return user ? (
      <UserContext.Provider value={currentUserDetails}>
        <Switch>
          <Redirect exact from="/admin" to="/admin/index" />
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Redirect from="/" to="/admin/index" />
        </Switch>
      </UserContext.Provider>
    ) : (
      <Switch>
        <Redirect exact from="/auth" to="/auth/login" />
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
