export const runtime = "nodejs";

export async function GET() {
    return Response.json({
        ok: true,
        timestamp: new Date().toISOString(),
        firebase: !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
        gemini: !!process.env.GEMINI_API_KEY,
    });
}
