import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

interface AdminUser {
    uid: string;
    email: string;
}

/**
 * Verify that the incoming request has a valid Firebase ID token
 * with the `admin: true` custom claim.
 *
 * Usage in API routes:
 *   const admin = await verifyAdmin(request);
 *   if (admin instanceof Response) return admin; // 401/403
 */
export async function verifyAdmin(
    request: NextRequest
): Promise<AdminUser | Response> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const token = authHeader.slice(7);

    try {
        const auth = getAdminAuth();
        const decoded = await auth.verifyIdToken(token);

        if (!decoded.admin) {
            return new Response(JSON.stringify({ error: "Forbidden: admin access required" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        return { uid: decoded.uid, email: decoded.email || "" };
    } catch {
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
