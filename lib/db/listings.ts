import type { NextApiRequest, NextApiResponse } from 'next';
import {  listings } from './schema';
import { db  } from '.';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allListings = await db.select().from(listings);
    res.status(200).json(allListings);
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
