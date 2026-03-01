import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function GET() {
    try {
        const auth = getAdminAuth();
        if (!auth) {
            return NextResponse.json({ error: "No Admin Auth" }, { status: 500 });
        }

        const email = "meandroboqatar@gmail.com";
        const password = "zfSG;;7uE1.3";

        let user;
        try {
            user = await auth.getUserByEmail(email);
            await auth.updateUser(user.uid, { password });
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
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
        return NextResponse.json({ success: true, uid: user.uid, email });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
