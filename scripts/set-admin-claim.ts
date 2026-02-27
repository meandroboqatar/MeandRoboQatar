/**
 * Set the `admin: true` custom claim on a Firebase Auth user.
 *
 * Usage:
 *   npx ts-node scripts/set-admin-claim.ts user@example.com
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY_B64 env variable.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Usage: npx ts-node scripts/set-admin-claim.ts <email>");
        process.exit(1);
    }

    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
    if (!b64) {
        console.error("❌ Set FIREBASE_SERVICE_ACCOUNT_KEY_B64 env variable first.");
        process.exit(1);
    }

    const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    const app = initializeApp({ credential: cert(serviceAccount) });
    const auth = getAuth(app);

    try {
        const user = await auth.getUserByEmail(email);
        await auth.setCustomUserClaims(user.uid, { admin: true });
        console.log(`✅ Admin claim set for ${email} (uid: ${user.uid})`);
        console.log("ℹ️  The user must sign out and sign back in for the claim to take effect.");
    } catch (err) {
        console.error("❌ Failed:", err);
        process.exit(1);
    }

    process.exit(0);
}

main();
