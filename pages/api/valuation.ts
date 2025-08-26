export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  try {
    const { property } = await req.json();

    if (!property || typeof property !== "object") {
      return NextResponse.json({ error: "Invalid property data" }, { status: 400 });
    }

    const prompt = `Estimate the valuation for this property:\n${JSON.stringify(property, null, 2)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();

      // Handle quota exceeded gracefully
      if (error.error?.status === "RESOURCE_EXHAUSTED") {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            retryAfter:
              error.error.details.find((d: any) =>
                d["@type"]?.includes("RetryInfo")
              )?.retryDelay || "60s",
          },
          { status: 429 }
        );
      }

      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch valuation", details: error.message },
      { status: 500 }
    );
  }
}
