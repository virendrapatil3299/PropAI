// app/api/insights/route.ts
export const runtime = "edge";

export default async function GET() {
  const insights = [
    { type: "trend", message: "The rental market is strong in Austin." },
    { type: "risk", message: "Housing prices in San Francisco show volatility." },
    { type: "opportunity", message: "Rising demand for multifamily units in Dallas." },
  ];

  return Response.json(insights);
}
