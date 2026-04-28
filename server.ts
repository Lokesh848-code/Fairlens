import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { prisma } from "./src/lib/db.js";
import { recommendationService } from "./src/services/recommendationService.js";
import { analyzeDataset as analyzeDatasetReal } from "./src/services/fairnessAnalyzer.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database Seeding (Ensure initial model exists)
  try {
    const modelCount = await prisma.model.count();
    if (modelCount === 0) {
      await prisma.model.create({
        data: {
          name: "Lending_v4_Credit_Screener",
          version: "4.2.0",
          type: "Classification",
          description: "Main production lending algorithm for unsecured personal loans."
        }
      });
      console.log("Database seeded with initial model.");
    }
  } catch (err) {
    console.warn("Could not seed database:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "FairLens AI API" });
  });

  // Fetch real audit summary from DB
  app.get("/api/audit/summary", async (req, res) => {
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
          modelName: "No audit performed"
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
      res.status(500).json({ error: "Failed to fetch audit" });
    }
  });

  // Fetch all audits
  app.get("/api/audits", async (req, res) => {
    try {
      const audits = await prisma.audit.findMany({
        orderBy: { timestamp: 'desc' },
        include: { model: true }
      });
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audits" });
    }
  });

  // Fetch specific audit detail
  app.get("/api/audit/:id", async (req, res) => {
    try {
      const audit = await prisma.audit.findUnique({
        where: { id: req.params.id },
        include: { 
          model: true,
          recommendations: true
        }
      });
      
      if (!audit) {
        return res.status(404).json({ error: "Audit not found" });
      }
      
      res.json(audit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit detail" });
    }
  });

  // Create audit (for sandbox simulation)
  app.post("/api/audit/save", async (req, res) => {
    try {
      const { modelName, fairness, accuracy, metrics } = req.body;
      let model = await prisma.model.findFirst({ where: { name: modelName } });
      
      if (!model) {
        model = await prisma.model.create({
          data: { name: modelName, version: "1.0.0", type: "Simulation" }
        });
      }

      const audit = await prisma.audit.create({
        data: {
          modelId: model.id,
          fairnessScore: parseFloat(fairness),
          accuracyScore: parseFloat(accuracy),
          disparateImpact: metrics?.disparateImpact || 0.8,
          statisticalParity: metrics?.statisticalParity || 0.7,
          status: fairness < 0.8 ? "FAILED" : "PASSED",
          rawMetrics: JSON.stringify(metrics || {})
        }
      });

      // Background recommendation generation
      try {
        const recommendations = await recommendationService.generateRecommendations({
          modelName: modelName,
          detectedBias: fairness < 0.8 ? "High Selection Disparity" : "Low Variance",
          protectedGroups: ["Gender", "Age", "Ethnicity"],
          metrics: {
            disparateImpact: parseFloat(fairness),
            statisticalParity: metrics?.statisticalParity || 0.7
          }
        });

        await Promise.all(recommendations.map(rec => 
          prisma.recommendation.create({
            data: {
              auditId: audit.id,
              title: rec.title,
              description: rec.description,
              impact: rec.impact,
              gain: rec.gain,
              type: rec.type,
              implementationCode: rec.implementationCode
            }
          })
        ));
      } catch (recError) {
        console.warn("Failed to generate recommendations:", recError);
      }

      res.json({ success: true, auditId: audit.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save audit" });
    }
  });

  app.post("/api/analyze-dataset", async (req, res) => {
    try {
      const { fileName, sampleData, saveToDb = true } = req.body;
      if (!sampleData) {
        return res.status(400).json({ error: "Sample data is required" });
      }

      // Use the real fairness analyzer (no AI dependency)
      const analysis = analyzeDatasetReal(fileName, sampleData);

      // Optionally save to database for audit trail
      if (saveToDb && analysis.fairnessScore > 0) {
        try {
          let model = await prisma.model.findFirst({ where: { name: fileName.replace(/\.[^/.]+$/, '') } });
          if (!model) {
            model = await prisma.model.create({
              data: {
                name: fileName.replace(/\.[^/.]+$/, ''),
                version: "1.0.0",
                type: "Dataset Analysis"
              }
            });
          }
          await prisma.audit.create({
            data: {
              modelId: model.id,
              fairnessScore: analysis.fairnessScore / 100,
              accuracyScore: analysis.accuracyScore / 100,
              disparateImpact: analysis.disparateImpact,
              statisticalParity: analysis.statisticalParity,
              status: analysis.fairnessScore >= 80 ? "PASSED" : analysis.fairnessScore >= 60 ? "FAILED" : "CRITICAL",
              rawMetrics: JSON.stringify(analysis)
            }
          });
        } catch (dbErr) {
          console.warn("Could not save to database:", dbErr);
        }
      }

      res.json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Dataset analysis failed" });
    }
  });

  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const model = recommendationService['genAI']?.getGenerativeModel({ model: "gemini-1.5-flash" });
      if (!model) {
        return res.json({ reply: "I'm currently in offline mode. I can tell you that typical fairness audits involve checking Disparate Impact and Equalized Odds." });
      }

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
  });

  // Sample Dataset endpoints - serve real CSV files from public/samples
  app.get("/api/samples/:industry", (req, res) => {
    const { industry } = req.params;
    const validIndustries = ['hiring', 'banking', 'healthcare', 'education'];
    const industryId = industry.toLowerCase().replace(/_/g, '');
    
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
    
    const target = industryMap[industryId] || (validIndustries.includes(industryId) ? industryId : 'hiring');
    const filePath = path.join(__dirname, 'public', 'samples', `${target}_sample.csv`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${target}_sample.csv`);
      res.send(content);
    } catch (err) {
      console.error(`Sample file not found: ${filePath}`);
      res.status(404).json({ error: "Sample file not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FairLens AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
