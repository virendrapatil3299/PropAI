// pages/api/marketData.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const marketData = [
      { region: "California", averagePrice: 750000, daysOnMarket: 35, priceChange: 3.5 },
      { region: "Texas", averagePrice: 320000, daysOnMarket: 28, priceChange: -1.2 },
    ];

    res.status(200).json(marketData);
  } catch (error) {
    console.error("Error in /api/marketData:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
}
