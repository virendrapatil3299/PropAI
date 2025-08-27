import type { NextApiRequest, NextApiResponse } from 'next';
<<<<<<< HEAD
import {  listings } from './schema';
import { db  } from '.';
=======
import {  listings } from '../../lib/db/schema';
import { db  } from '../../lib/db';
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allListings = await db.select().from(listings);
    res.status(200).json(allListings);
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
