import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

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

    const filePath = join(process.cwd(), "service-account.json");

    if (!existsSync(filePath)) {
        console.warn(
            "[firebase-admin] service-account.json not found. Admin features disabled."
        );
        return null;
    }

    try {
        const serviceAccount = JSON.parse(readFileSync(filePath, "utf-8"));

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
