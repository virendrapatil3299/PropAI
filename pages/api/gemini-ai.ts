// pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const roi = parseFloat(req.query.roi as string);
  const capRate = parseFloat(req.query.capRate as string);

  if (isNaN(roi) || isNaN(capRate)) {
    return res.status(400).json({ comment: 'Invalid parameters' });
  }

  let comment = 'Neutral investment opportunity.';
  if (roi > 15 && capRate > 6) comment = 'Strong investment potential with high returns!';
  else if (roi > 10 && capRate > 4) comment = 'Good investment, worth considering.';
  else if (roi < 5 || capRate < 2) comment = 'Investment may not be profitable, proceed with caution.';

  return res.status(200).json({ comment });
}
