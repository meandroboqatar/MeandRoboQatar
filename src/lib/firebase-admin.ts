import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;
let db: Firestore;
let adminAuth: Auth;

function getAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;

    if (!b64) {
        // Fallback: allow running without Firebase (dev/preview)
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY_B64 is not set. Firestore writes will fail.");
        return initializeApp();
    }

    const serviceAccount = JSON.parse(
        Buffer.from(b64, "base64").toString("utf-8")
    );

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

export function getAdminDb(): Firestore {
    if (!app) {
        app = getAdminApp();
    }
    if (!db) {
        db = getFirestore(app);
    }
    return db;
}

export function getAdminAuth(): Auth {
    if (!app) {
        app = getAdminApp();
    }
    if (!adminAuth) {
        adminAuth = getAuth(app);
    }
    return adminAuth;
}
