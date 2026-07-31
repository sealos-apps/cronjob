import type { NextApiRequest, NextApiResponse } from 'next';

import { HEALTHZ_CACHE_CONTROL, healthzResponse } from '@/utils/healthz';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', HEALTHZ_CACHE_CONTROL);
  res.status(200).json(healthzResponse);
}
