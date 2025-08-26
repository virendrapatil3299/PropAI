// pages/api/ors.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const API_KEY = process.env.ORS_API_KEY;
  const {
    type = "route",
    start,
    end,
    range,
    mode = "foot-walking",
    coords,
    text,
  } = req.query;

  if (!API_KEY) {
    return res
      .status(500)
      .json({ success: false, error: "Missing ORS API key" });
  }

  try {
    let url = "";
    let body: unknown = {};
    let method: "GET" | "POST" = "POST";

    switch (type) {
      case "route":
        url = `https://api.openrouteservice.org/v2/directions/${mode}`;
        if (!start || !end) {
          return res.status(400).json({
            success: false,
            error:
              "Missing start or end coordinates. Use ?start=lon,lat&end=lon,lat",
          });
        }
        body = {
          coordinates: [
            (start as string).split(",").map(Number),
            (end as string).split(",").map(Number),
          ],
        };
        break;

      case "isochrone":
        url = `https://api.openrouteservice.org/v2/isochrones/${mode}`;
        if (!start) {
          return res.status(400).json({
            success: false,
            error: "Missing start coordinate. Use ?start=lon,lat",
          });
        }
        body = {
          locations: [(start as string).split(",").map(Number)],
          range: [range ? Number(range) : 900],
        };
        break;

      case "matrix":
        url = `https://api.openrouteservice.org/v2/matrix/${mode}`;
        if (!coords) {
          return res.status(400).json({
            success: false,
            error:
              "Missing coords. Use ?coords=lon1,lat1;lon2,lat2;lon3,lat3",
          });
        }
        body = {
          locations: (coords as string).split(";").map((pair) =>
            pair.split(",").map(Number)
          ),
          metrics: ["distance", "duration"],
        };
        break;

      case "geocode":
        if (!text) {
          return res.status(400).json({
            success: false,
            error: "Missing ?text=address query",
          });
        }
        method = "GET";
        url = `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(
          text as string
        )}`;
        break;

      case "reverse":
        if (!start) {
          return res.status(400).json({
            success: false,
            error: "Missing ?start=lon,lat for reverse geocode",
          });
        }
        method = "GET";
        url = `https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lon=${
          (start as string).split(",")[0]
        }&point.lat=${(start as string).split(",")[1]}`;
        break;

      default:
        return res
          .status(400)
          .json({ success: false, error: "Invalid type parameter" });
    }

    // ✅ Fixed headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (method === "POST") headers["Authorization"] = API_KEY;

    const response = await fetch(url, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(response.status)
        .json({ success: false, error: text || "ORS API error" });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
