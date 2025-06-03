import admin from "firebase-admin";
import serviceAccount from "./permissions.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// user account creation
const auth = admin.auth();

export { db, auth };