import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelName, fairness, accuracy, metrics } = req.body;
    let model = await prisma.model.findFirst({ where: { name: modelName } });

    if (!model) {
      model = await prisma.model.create({
        data: { name: modelName, version: '1.0.0', type: 'Simulation' }
      });
    }

    const audit = await prisma.audit.create({
      data: {
        modelId: model.id,
        fairnessScore: parseFloat(fairness),
        accuracyScore: parseFloat(accuracy),
        disparateImpact: metrics?.disparateImpact || 0.8,
        statisticalParity: metrics?.statisticalParity || 0.7,
        status: fairness < 0.8 ? 'FAILED' : 'PASSED',
        rawMetrics: JSON.stringify(metrics || {})
      }
    });

    res.json({ success: true, auditId: audit.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save audit' });
  }
}
