const { loadEnvConfig } = require('@next/env');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

loadEnvConfig(process.cwd());

async function main() {
    const email = "meandroboqatar@gmail.com";
    const password = "zfSG;;7uE1.3";

    let projectId = process.env.MB_FIREBASE_PROJECT_ID;
    let clientEmail = process.env.MB_FIREBASE_CLIENT_EMAIL;
    let privateKeyRaw = process.env.MB_FIREBASE_PRIVATE_KEY;

    // Check consolidated JSON secret first (preferred)
    const adminJsonStr = process.env.MB_FIREBASE_ADMIN_JSON;
    if (adminJsonStr) {
        try {
            const adminJson = JSON.parse(adminJsonStr);
            projectId = adminJson.project_id;
            clientEmail = adminJson.client_email;
            privateKeyRaw = adminJson.private_key;
        } catch (e) {
            console.error("Failed to parse MB_FIREBASE_ADMIN_JSON in env payload.");
        }
    }

    // Fallback exactly to a raw JSON file if ENV parsing keeps breaking
    const saPath = path.resolve(process.cwd(), 'service-account.json');
    if (fs.existsSync(saPath)) {
        console.log("Found service-account.json. Using direct JSON auth.");
        const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
        projectId = sa.project_id;
        clientEmail = sa.client_email;
        privateKeyRaw = sa.private_key;
    }

    if (!projectId || !clientEmail || !privateKeyRaw) {
        console.error("❌ Missing FIREBASE credentials in .env.local (MB_FIREBASE_ADMIN_JSON) or service-account.json");
        process.exit(1);
    }

    // Completely reconstruct the PEM key to fix ANY corrupt whitespace or DER errors
    const b64 = privateKeyRaw
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/\s+/g, '')
        .replace(/"/g, '');

    const chunked = b64.match(/.{1,64}/g).join('\n');
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${chunked}\n-----END PRIVATE KEY-----\n`;

    const app = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey
        })
    });

    const auth = getAuth(app);

    try {
        let user;
        try {
            user = await auth.getUserByEmail(email);
            console.log(`Updating existing user ${email}...`);
            await auth.updateUser(user.uid, { password });
        } catch (e) {
            if (e.code === 'auth/user-not-found') {
                console.log(`Creating new user ${email}...`);
                user = await auth.createUser({
                    email,
                    password,
                    emailVerified: true
                });
            } else {
                throw e;
            }
        }

        await auth.setCustomUserClaims(user.uid, { admin: true });
        console.log(`✅ Admin claim set and user created/updated for ${email} (uid: ${user.uid})`);
    } catch (err) {
        console.error("❌ Failed:", err);
        process.exit(1);
    }
}

main();
