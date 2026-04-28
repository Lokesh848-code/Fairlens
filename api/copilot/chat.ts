import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!genAI) {
      return res.json({ reply: "I'm currently in offline mode. I can tell you that typical fairness audits involve checking Disparate Impact and Equalized Odds." });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are FairLens Agent, an AI Copilot for a Fairness Auditing platform.
      You help users understand their bias metrics.

      USER QUESTION: ${message}

      Context: The user is looking at their dashboard which shows models, audits, and recommendations.
      Be concise, technical, and helpful. Use markdown.

      Answer based on ethical AI principles.
    `;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    res.json({ reply: "I couldn't process that request right now. Let's focus on your audit scores!" });
  }
}
