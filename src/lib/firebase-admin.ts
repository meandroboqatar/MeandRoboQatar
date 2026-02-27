import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | null = null;
let appInitialized = false;
let db: Firestore | null = null;
let adminAuth: Auth | null = null;

function getAdminApp(): App | null {
    if (appInitialized) return app;
    appInitialized = true;

    if (getApps().length > 0) {
        app = getApps()[0];
        return app;
    }

    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;

    if (!b64) {
        console.warn(
            "[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY_B64 is not set — Firebase Admin disabled. " +
            "Firestore/Auth calls will return null."
        );
        return null;
    }

    try {
        const serviceAccount = JSON.parse(
            Buffer.from(b64, "base64").toString("utf-8")
        );

        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
        });
        return app;
    } catch (err) {
        console.error("[firebase-admin] Failed to initialize Firebase Admin:", err);
        return null;
    }
}

export function getAdminDb(): Firestore | null {
    if (!db) {
        const a = getAdminApp();
        if (!a) return null;
        db = getFirestore(a);
    }
    return db;
}

export function getAdminAuth(): Auth | null {
    if (!adminAuth) {
        const a = getAdminApp();
        if (!a) return null;
        adminAuth = getAuth(a);
    }
    return adminAuth;
}
