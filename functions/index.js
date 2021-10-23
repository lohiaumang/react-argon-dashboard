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

exports.createDealer = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    functions.logger.log("Create dealer function called with: ", data);
    try {
      //Checking that the new user role is valid
      const { role, dealerId } = data;

      if (!roleIsValid(role)) {
        throw new InvalidRoleError(
          'The "' + role + '" role is not a valid role'
        );
      }

      const userRecord = await admin.auth().createUser(data);
      const userId = userRecord.uid;
      const claims = {};
      const claimRole =
        role === "dealer" || role === "subdealer" ? "dealer" : role;
      claims["xyzCompanyUser"] = true;
      claims["dealer"] = true;

      functions.logger.log("User record: ", userRecord);
      functions.logger.log("User id: ", userId);
      functions.logger.log("Claims: ", claims);

      await admin.auth().setCustomUserClaims(userId, claims);

      let userData = {
        uid: userId,
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        gst: data.gst,
        pan: data.pan,
        address: data.address,
        temporaryCertificate: data.temporaryCertificate,
        termsAndCondition: data.termsAndCondition,
        role: "dealer",
        // role: data.role,
      };

      userData = data.dealerId
        ? {
            ...userData,
            dealerId: data.dealerId,
          }
        : userData;

      functions.logger.log("User data: ", userData);

      await admin.firestore().collection("users").doc(userId).set(userData);

      functions.logger.log("User added to collection users in firebase");

      return {
        result: "The new user has been successfully created.",
        uid: userId,
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

exports.createUser = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    try {
      //Checking that the new user role is valid
      functions.logger.log("createUser function called with: ", data);
      const { role } = data;

      if (!roleIsValid(role)) {
        throw new InvalidRoleError(
          'The "' + role + '" role is not a valid role'
        );
      }

      functions.logger.log("Input data: ", data);

      const userRecord = await admin.auth().createUser({
        ...data,
        displayName: data.name,
        emailVerified: false,
        disabled: false,
      });
      const userId = userRecord.uid;
      const userCreationRequest = {
        uid: userId,
        dealerId: data.dealerId,
        createdBy: data.createdBy,
        createdOn: FieldValue.serverTimestamp(),
        displayName: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
      };
      // functions.logger.log("USER RECORD: ", userRecord);

      functions.logger.log("userId: ", userId);

      functions.logger.log("user creation request data: ", userCreationRequest);

      const claims = {};
      claims[role] = true;
      claims["xyzCompanyUser"] = true;

      await admin.auth().setCustomUserClaims(userId, claims);
      functions.logger.log("Setting custom claims");

      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .set(userCreationRequest);

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

exports.deleteUser = functions
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
