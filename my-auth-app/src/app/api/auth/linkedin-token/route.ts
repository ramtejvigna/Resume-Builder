import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
          client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
          redirect_uri: `${
            process.env.NEXTAUTH_URL || "http://localhost:3000"
          }/auth/linkedin/callback`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      return NextResponse.json({ access_token: tokenData.access_token });
    } else {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("LinkedIn token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
