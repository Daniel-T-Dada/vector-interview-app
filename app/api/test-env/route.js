import { NextResponse } from "next/server";

export async function GET() {
    // Only return the first few characters of the client ID for security
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientIdPrefix = clientId.substring(0, 8);

    return NextResponse.json({
        clientIdPrefix,
        hasClientId: !!clientId,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    });
} 