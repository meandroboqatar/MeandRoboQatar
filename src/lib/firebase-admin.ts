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

    let projectId, clientEmail, privateKey;

    // Try to load consolidated JSON secret first (preferred)
    const adminJsonStr = process.env.MB_FIREBASE_ADMIN_JSON;

    if (adminJsonStr) {
        try {
            const adminJson = JSON.parse(adminJsonStr);
            projectId = adminJson.project_id;
            clientEmail = adminJson.client_email;
            privateKey = adminJson.private_key;
        } catch (e) {
            console.error("[firebase-admin] Failed to parse MB_FIREBASE_ADMIN_JSON.");
        }
    } else {
        // Fallback for local dev if they still use individual MB_ vars
        projectId = process.env.MB_FIREBASE_PROJECT_ID;
        clientEmail = process.env.MB_FIREBASE_CLIENT_EMAIL;
        let pk = process.env.MB_FIREBASE_PRIVATE_KEY;
        privateKey = pk ? pk.replace(/\\n/g, "\n") : undefined;
    }

    if (!projectId || !clientEmail || !privateKey) {
        console.warn(
            "[firebase-admin] Missing env vars for Admin SDK (MB_FIREBASE_ADMIN_JSON). " +
            "Admin features disabled gracefully."
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
