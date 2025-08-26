// pages/api/attom.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const apiKey = process.env.ATTOM_API_KEY;
    const response = await fetch(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=${encodeURIComponent(address)}`,
      { headers: { 'apikey': apiKey || '' } }
    );

    if (!response.ok) throw new Error('ATTOM API error');

    const data = await response.json();

    const property = Array.isArray(data.property) && data.property.length > 0 ? data.property[0] : null;

    return res.status(200).json({
      currentValue: property?.valuation?.value ?? 0,
      address: property?.address?.oneLine ?? address,
      city: property?.address?.city ?? '',
      state: property?.address?.state ?? ''
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch property data' });
  }
}
