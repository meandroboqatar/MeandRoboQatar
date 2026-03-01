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

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.FB_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.FB_ADMIN_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FB_ADMIN_PRIVATE_KEY;
    privateKey = privateKey?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        console.warn(
            "[firebase-admin] Missing env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). " +
            "Admin features disabled."
        );
        return null;
    }

    try {
        app = initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
            projectId,
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
