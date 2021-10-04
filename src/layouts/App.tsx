import React, { useState, useEffect, useReducer } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import Loading from "../components/Share/Loading";
import AdminLayout from "./Admin";
import AuthLayout from "./Auth";
import {
  UserContext,
  PriceCinfigContext,
  InsuranceConfigContext,
} from "../Context";


const App: React.FC = () => {
  const currentUser = firebase.auth().currentUser;
  const [loading, setLoading] = useState<boolean>(true);
  // TODO: SAVE IN CONTEXT
  const [user, setUser] = useState<object | null>(null);
  const [signInError, setSignInError] = useState<string>("");
  const [currentUserDetails, setCurrentUserDetails] = useState<any>();
  const [priceConfigDetails, setPriceConfigDetails] = useState<any>();
  const [insuranceConfigDetails, setInsuranceConfigDetails] = useState<any>();
 // console.log(currentUser,"We get current user");
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
              if (doc.data().role !== "salesman") {
                setCurrentUserDetails(doc.data());

                setUser(User);
                setLoading(false);
              } else {
                setSignInError(
                  "You don't have permission to access the dashboard."
                );
                setTimeout(() => setSignInError(""), 1500);
                firebase.auth().signOut();
              }
            }
          });

        var docRef = firebase
          .firestore()
          .collection("priceConfig")
          .doc("config");
        docRef.get().then((doc) => {
          if (doc.exists) {
            setPriceConfigDetails(doc.data());
          }
        });
        var docRef = firebase
          .firestore()
          .collection("insuranceConfig")
          .doc("config");
        docRef.get().then((doc) => {
          if (doc.exists) {
            setInsuranceConfigDetails(doc.data());
          }
        });
      } else if (User === null) {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const getRoutes = () => {
    // const { role = "" } = currentUserDetails || {};

    return user ? (
      <UserContext.Provider value={[currentUserDetails, setCurrentUserDetails]}>
        <PriceCinfigContext.Provider value={priceConfigDetails}>
          <InsuranceConfigContext.Provider value={insuranceConfigDetails}>
            <Switch>
              <Redirect exact from="/admin" to="/admin/index" />
              <Route
                path="/admin"
                render={(props) => <AdminLayout {...props} />}
              />
              <Redirect from="/" to="/admin/index" />
            </Switch>
          </InsuranceConfigContext.Provider>
        </PriceCinfigContext.Provider>
      </UserContext.Provider>
    ) : (
      <UserContext.Provider value={[currentUserDetails, setCurrentUserDetails]}>
        <Switch>
          <Redirect exact from="/auth" to="/auth/login" />
          <Route
            path="/auth"
            render={(props) => (
              <AuthLayout {...props} signInError={signInError} />
            )}
          />
          <Redirect from="/" to="/auth/login" />
        </Switch>
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
