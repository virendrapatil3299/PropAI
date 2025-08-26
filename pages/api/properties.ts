import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db"; // your Drizzle DB client
import { listings } from "../../lib/db/schema"; // your schema
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const {
        title,
        price,
        location,
        area,
        url,
        statusType,
        imgSrc,
        has3DModel,
        addressCity,
        addressStreet,
        addressState,
        addressZipcode,
        lat,
        lng,
        baths,
        beds,
        homeType,
      } = req.body;

      // Insert into Neon via Drizzle
      const inserted = await db
        .insert(listings)
        .values({
          title,
          price,
          location,
          area,
          url,
          statusType,
          imgSrc,
          has3DModel,
          addressCity,
          addressStreet,
          addressState,
          addressZipcode,
          lat,
          lng,
          baths,
          beds,
          homeType,
        })
        .returning();

      return res.status(201).json({ success: true, property: inserted[0] });
    }

    if (req.method === "GET") {
      const allProperties = await db.select().from(listings);
      return res.status(200).json({ success: true, properties: allProperties });
    }

    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
