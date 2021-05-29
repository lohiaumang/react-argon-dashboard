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
  const [loading, setLoading] = useState<boolean>(true);
  // TODO: SAVE IN CONTEXT
  const [user, setUser] = useState<object | null>(null);
  const [currentUserData, setCurrentUserData] = useState<any>([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((User) => {
      setUser(User);
      setLoading(false);
    });
  }, []);

 
const currentUser = firebase.auth().currentUser;
  
// async function getUser(uid:any) 
// {
// const userInfoSnap=await firebase.firestore()
// .collection('users')
// .doc(uid)
// .get()
// const userInfo=userInfoSnap.data()
// if(userInfo){
//   setCurrentUserData(userInfo);
// }  
// }

const getUserData = (uid: string) => {
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", uid)
      .onSnapshot(function (querySnapshot) {
        setCurrentUserData(
          querySnapshot.docs.map((doc) => ({
            role: doc.data().role,
            
          }))
        );
      });
  }, []);
};

if (currentUser && currentUser.uid) {
  getUserData(currentUser.uid);
}

useEffect(() => {
  
 
}, []);

console.log(currentUserData);
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
