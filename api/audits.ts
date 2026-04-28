import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const audits = await prisma.audit.findMany({
      orderBy: { timestamp: 'desc' },
      include: { model: true }
    });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
}
