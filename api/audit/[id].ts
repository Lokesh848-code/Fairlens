import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  try {
    const audit = await prisma.audit.findUnique({
      where: { id: id as string },
      include: {
        model: true,
        recommendations: true
      }
    });

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit detail' });
  }
}
