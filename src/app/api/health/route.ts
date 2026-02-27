export const runtime = "nodejs";

export async function GET() {
    return Response.json({
        ok: true,
        timestamp: new Date().toISOString(),
        firebase: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64,
        gemini: !!process.env.GEMINI_API_KEY,
    });
}
