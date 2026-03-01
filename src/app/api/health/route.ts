export const runtime = "nodejs";

export async function GET() {
    const hasFirebaseAdmin = !!process.env.MB_FIREBASE_ADMIN_JSON ||
        !!(process.env.MB_FIREBASE_PROJECT_ID && process.env.MB_FIREBASE_CLIENT_EMAIL && process.env.MB_FIREBASE_PRIVATE_KEY);

    return Response.json({
        ok: true,
        timestamp: new Date().toISOString(),
        firebase: hasFirebaseAdmin,
        gemini: !!process.env.MB_GEMINI_API_KEY,
    });
}
