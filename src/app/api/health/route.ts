import { existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export async function GET() {
    return Response.json({
        ok: true,
        timestamp: new Date().toISOString(),
        firebase: existsSync(join(process.cwd(), "service-account.json")),
        gemini: !!process.env.GEMINI_API_KEY,
    });
}
