const functions = require("firebase-functions");
const admin = require("firebase-admin");
const FieldValue = require("firebase-admin").firestore.FieldValue;

admin.initializeApp();

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = "UnauthenticatedError";
  }
}

class NotAnAdminError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = "NotAnAdminError";
  }
}

class InvalidRoleError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = "InvalidRoleError";
  }
}

function roleIsValid(role) {
  const validRoles = ["dealer", "salesman", "officeStaff", "subdealer"]; //To be adapted with your own list of roles
  return validRoles.includes(role);
}

exports.createUserIndia = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    try {
      const {
        name,
        phoneNumber,
        email,
        password,
        gst,
        pan,
        address,
        temporaryCertificate,
        termsAndCondition,
        role,
        dealerId,
      } = data;

      //Checking that the new user role is valid
      if (!roleIsValid(role)) {
        throw new InvalidRoleError(
          'The "' + role + '" role is not a valid role'
        );
      }

      const { uid } = await admin.auth().createUser({
        ...data,
        displayName: name,
        emailVerified: false,
        disabled: false,
      });

      functions.logger.log("User id: ", uid);

      const claims = {};
      claims[role] = true;
      // claims["xyzCompanyUser"] = true;

      await admin.auth().setCustomUserClaims(uid, claims);

      let userData = {
        uid,
        name,
        phoneNumber,
        email,
        password,
        gst,
        pan,
        address,
        temporaryCertificate,
        termsAndCondition,
        role,
      };

      userData =
        role === "subdealer" && dealerId
          ? {
            ...userData,
            dealerId,
          }
          : userData;

      await admin.firestore().collection("users").doc(uid).set(userData);

      functions.logger.log("Collection amended");
      // await userCreationRequestRef.update({ status: 'Treated' })

      return {
        result: "The new user has been successfully created.",
        uid,
      };
    } catch (error) {
      functions.logger.log("Error: ", JSON.stringify(error));
      if (error.type === "UnauthenticatedError") {
        throw new functions.https.HttpsError("unauthenticated", error.message);
      } else if (
        error.type === "NotAnAdminError" ||
        error.type === "InvalidRoleError"
      ) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          error.message
        );
      } else {
        throw new functions.https.HttpsError("internal", error.message);
      }
    }
  });

exports.createUserdataIndia1 = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    try {
      //Checking that the new user role is valid
      functions.logger.log("FUNCTION CALLED: ", data);
      const role = data.role;
      if (!roleIsValid(role)) {
        throw new InvalidRoleError(
          'The "' + role + '" role is not a valid role'
        );
      }
      functions.logger.log("INPUT DATA: ", data);

      const userRecord = await admin.auth().createUser({
        ...data,
        displayName: data.name,
        emailVerified: false,
        disabled: false,
      });
      functions.logger.log("USER RECORD: ", userRecord);

      const userId = userRecord.uid;
      functions.logger.log("USERID: ", userId);

      let userCreationRequest = {
        uid: userId,
        createdBy: data.createdBy,
        createdOn: FieldValue.serverTimestamp(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        createdByName: data.createdByName,
      };

      userCreationRequest = data.dealerId
        ? { ...userCreationRequest, dealerId: data.dealerId }
        : userCreationRequest;

      functions.logger.log("USER CREATION REQUEST: ", userCreationRequest);

      const claims = {};
      claims[role] = true;
      claims["xyzCompanyUser"] = true;

      await admin.auth().setCustomUserClaims(userId, claims);
      functions.logger.log("SETTING CUSTOM CLAIMS");

      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .set(userCreationRequest);
      console.log(userId);

      // await userCreationRequestRef.update({ status: 'Treated' })

      return {
        result: "The new user has been successfully created.",
        userCreationRequest,
      };
    } catch (error) {
      if (error.type === "UnauthenticatedError") {
        throw new functions.https.HttpsError("unauthenticated", error.message);
      } else if (
        error.type === "NotAnAdminError" ||
        error.type === "InvalidRoleError"
      ) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          error.message
        );
      } else {
        throw new functions.https.HttpsError("internal", error.message);
      }
    }
  });

//Delete User

exports.deleteUserDataIndia = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    admin
      .auth()
      .deleteUser(data.uid)
      .then(function () {
        return { result: "User Delete Successfully." };
      })
      .catch(function (error) {
        console.log("Error deleting user:", error);
      });
  });

//Delete Usere

exports.userDeletedIndia = functions
  .region("asia-south1")
  .auth.user()
  .onDelete((user) => {
    const doc = admin.firestore().collection("users").doc(user.uid);
    return doc.delete();
  });

//Reset Pasword
exports.resetPasswordIndia = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    var auth = firebase.auth();
    auth
      .sendPasswordResetEmail(data)
      .then(function () { })
      .catch(function (error) {
        console.log("Error deleting user:", error);
      });
  });
