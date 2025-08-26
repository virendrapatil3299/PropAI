import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db";
import { listings } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const saved = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, userId as string));

    return res.status(200).json(saved);
  }

  if (req.method === "POST") {
    const { userId, propertyId, title, location, price } = req.body;
    if (!userId || !propertyId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await db.insert(listings).values({
      userId,
      propertyId,
      title,
      location,
      price,
    });

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
