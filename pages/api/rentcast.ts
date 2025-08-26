import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type = "properties" } = req.query;

    let url = "";

    switch (type) {
      case "properties":
        // Get multiple properties
        url = "https://api.rentcast.io/v1/properties?limit=50&offset=0";
        break;

      case "rents":
        // Rent estimate for a valid address
        url =
          "https://api.rentcast.io/v1/rents?lat=38.8977&limit=50";
        break;

      case "markets":
        // Market trends for a city/zip
        url =
          "https://api.rentcast.io/v1/markets?limit=50&offset=0";
        break;

      default:
        return res.status(400).json({ error: "Invalid type parameter" });
    }

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-Api-Key": process.env.RENTCAST_API_KEY as string,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
}
