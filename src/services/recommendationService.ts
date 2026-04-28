import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AuditContext {
  modelName: string;
  detectedBias: string;
  protectedGroups: string[];
  metrics: {
    disparateImpact: number;
    statisticalParity: number;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  gain: string;
  type: string;
  implementationCode?: string;
}

const API_KEY = process.env.GEMINI_API_KEY;

export class RecommendationService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
    }
  }

  async generateRecommendations(context: AuditContext): Promise<Recommendation[]> {
    if (!this.genAI) {
      // Fallback if no key
      return [
        {
          id: "AUTO-1",
          title: `Synthetic Re-sampling for ${context.protectedGroups[0]}`,
          description: `Automatically balance the ${context.modelName} training set to reduce bias in ${context.detectedBias}.`,
          impact: "High",
          gain: "+14% Parity",
          type: "Pre-processing"
        }
      ];
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Fairness Auditor named FairLens Agent. 
      Act as an expert in algorithmic bias mitigation.
      
      CONTEXT:
      Model: ${context.modelName}
      Detected Bias: ${context.detectedBias}
      Protected Groups: ${context.protectedGroups.join(", ")}
      Current Metrics: Disparate Impact ${context.metrics.disparateImpact}, Statistical Parity ${context.metrics.statisticalParity}

      TASK: generate 2 highly technical and specific fairness mitigation recommendations.
      Format the response as a JSON array of objects with the following structure:
      {
        "id": string (unique),
        "title": string (technical title),
        "description": string (clear explanation of why this works for this specific case),
        "impact": "High" | "Medium" | "Low",
        "gain": string (e.g. "+15% Parity"),
        "type": "Pre-processing" | "In-processing" | "Post-processing",
        "implementationCode": string (one line python code snippet using a library like AIF360)
      }
      Return ONLY THE JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async analyzeDataset(fileName: string, sampleData: string): Promise<any> {
    if (!this.genAI) {
      return {
        fileName,
        fairnessScore: 85,
        detectedBiases: ["Age group disparity (Potential)"],
        proxyRisks: ["Zip Code"],
        summary: "Synthetic analysis results (AI Service Offline)."
      };
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following dataset sample for AI fairness and potential bias risks.
      
      FILE NAME: ${fileName}
      SAMPLE DATA (CSV/TEXT):
      ${sampleData}

      TASK:
      1. Identify sensitive attributes (Gender, Race, Age, etc.).
      2. Detect potential proxy variables (e.g. Zip code for race).
      3. Estimating a preliminary fairness score (0-100).
      4. List specific bias concerns.
      5. Provide a 2-sentence executive summary.

      Format the response as a JSON object:
      {
        "fairnessScore": number,
        "detectedBiases": string[],
        "proxyRisks": string[],
        "summary": string
      }
      Return ONLY THE JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }
}

export const recommendationService = new RecommendationService();
