import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { industry } = req.query;
  const industryId = (industry as string).toLowerCase().replace(/_/g, '');

  // Map various inputs to standard names
  const industryMap: Record<string, string> = {
    hiring: 'hiring',
    bank: 'banking',
    banking: 'banking',
    health: 'healthcare',
    healthcare: 'healthcare',
    edu: 'education',
    education: 'education'
  };

  const validIndustries = ['hiring', 'banking', 'healthcare', 'education'];
  const target = industryMap[industryId] || (validIndustries.includes(industryId) ? industryId : 'hiring');

  // For Vercel, files are in the public folder
  const filePath = path.join(process.cwd(), 'public', 'samples', `${target}_sample.csv`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${target}_sample.csv`);
    res.send(content);
  } catch (err) {
    console.error(`Sample file not found: ${filePath}`);
    res.status(404).json({ error: 'Sample file not found' });
  }
}
