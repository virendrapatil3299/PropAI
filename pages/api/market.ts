// pages/api/market.ts
import type { NextApiRequest, NextApiResponse } from "next";

type MarketData = any; // replace with proper type if you have ATTOM response type

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarketData | { error: string }>
) {
  const API_KEY = process.env.ATTOM_API_KEY; // store key in env
  const URL = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/market/snapshot";

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing ATTOM API key" });
  }

  try {
    // Example: ATTOM Market Snapshot expects a 'fips' parameter
    // Replace with a valid FIPS code for your area
    const fips = req.query.fips || "06037"; // default Los Angeles County, CA

    const response = await fetch(`${URL}?fips=${fips}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        apikey: API_KEY,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error("Error fetching Market Snapshot:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
}
