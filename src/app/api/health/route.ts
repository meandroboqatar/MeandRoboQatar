export const runtime = "nodejs";

export async function GET() {
    return Response.json({
        ok: true,
        timestamp: new Date().toISOString(),
        firebase: !!(process.env.FB_ADMIN_PROJECT_ID && process.env.FB_ADMIN_CLIENT_EMAIL && process.env.FB_ADMIN_PRIVATE_KEY),
        gemini: !!process.env.GEMINI_API_KEY,
    });
}
