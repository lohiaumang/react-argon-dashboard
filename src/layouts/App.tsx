import React, { useState, useEffect, useReducer } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import Loading from "../components/Share/Loading";
import AdminLayout from "./Admin";
import AuthLayout from "./Auth";
import { UserContext } from "../Context";
import { userInfo } from "os";

const App: React.FC = () => {
  const currentUser = firebase.auth().currentUser;
  const [loading, setLoading] = useState<boolean>(true);
  // TODO: SAVE IN CONTEXT
  const [user, setUser] = useState<object | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((User) => {
      setUser(User);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      firebase
        .firestore()
        .collection("users")
        .where("uid", "==", currentUser.uid)
        .onSnapshot(function (querySnapshot) {
          const doc = querySnapshot.docs ? querySnapshot.docs[0] : null;
          if (doc && doc.exists && doc.data()) {
            setCurrentUserRole(doc.data().role);
          }
        });
    }
  }, [currentUser]);

  console.log(currentUserRole);
  const getRoutes = () => {
    return (
      <UserContext.Provider value={user}>
        {user ? (
          <Switch>
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />
            <Redirect from="/" to="/admin/index" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
            <Redirect from="/" to="/auth/login" />
          </Switch>
        )}
      </UserContext.Provider>
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
