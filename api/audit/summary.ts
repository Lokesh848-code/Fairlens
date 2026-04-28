import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lastAudit = await prisma.audit.findFirst({
      orderBy: { timestamp: 'desc' },
      include: { model: true }
    });

    if (!lastAudit) {
      return res.json({
        fairnessScore: 0,
        biasDetected: false,
        lastAudit: null,
        issuesFound: 0,
        modelName: 'No audit performed'
      });
    }

    res.json({
      fairnessScore: lastAudit.fairnessScore,
      accuracyScore: lastAudit.accuracyScore,
      biasDetected: lastAudit.fairnessScore < 0.8,
      lastAudit: lastAudit.timestamp,
      modelName: lastAudit.model.name,
      auditId: lastAudit.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
}
