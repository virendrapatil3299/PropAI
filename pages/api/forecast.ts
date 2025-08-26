import { NextResponse } from "next/server";

export default async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = {
      location: body.location || "NYC",
      propertyType: "residential" as const,
      scenarios: [
        { year: 2025, demandIndex: 80 },
        { year: 2026, demandIndex: 85 },
      ],
      riskLevel: "low",
    };

    return NextResponse.json(data); // ✅ returns Response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
