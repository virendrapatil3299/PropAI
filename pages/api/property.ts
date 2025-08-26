// pages/api/property.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  try {
    // Call ATTOM
    const attomRes = await axios.get("http://localhost:3000/api/Attmy", { params: { address } });

    // Call Apify (example Zillow scraper actor)
    const apifyRes = await axios.get("http://localhost:3000/api/listings", {
      params: { address, actorId: process.env.APIFY_ZILLOW_ACTOR },
    });

    // Merge both datasets
    res.status(200).json({
      attom: attomRes.data,
      apify: apifyRes.data,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}
