<div align="center">
<img width="1200" height="475" alt="FairLens Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FairLens — AI Fairness Auditing Platform

**FairLens** is a production-ready web application for auditing AI/ML models and datasets for fairness, bias, and regulatory compliance. It provides statistical analysis of datasets, identifies proxy variables, computes fairness metrics (Disparate Impact, Statistical Parity), and generates compliance reports for regulations like the **EU AI Act**.

---

## Features

###  Dataset Audit
- **Upload CSV datasets** and get real-time fairness analysis
- **Auto-detection** of sensitive attributes (gender, race, age, etc.)
- **Statistical metrics**: Disparate Impact Ratio, Statistical Parity, Equalized Odds
- **Proxy variable detection** — identifies features that correlate with protected attributes
- **Group analysis** — selection rates across demographic groups

###  Fairness Metrics
- **Disparate Impact (80% Rule)** — legal standard for discrimination testing
- **Statistical Parity Difference** — measures selection rate gaps
- **Equalized Odds** — error rate parity across groups
- **Cramér's V Correlation** — detects proxy variables

###  Sample Datasets
Realistic sample datasets included for testing:
- **Hiring** — recruitment data with gender/race bias patterns
- **Banking** — loan applications with approval disparities
- **Healthcare** — patient triage with insurance/priority data
- **Education** — admissions with legacy/status indicators

###  Compliance & Reporting
- **EU AI Act Annex IV** documentation generation
- **Audit trail vault** with tamper-proof logs
- **Exportable compliance reports** (PDF/CSV)
- **Blockchain-verified certificates**

###  Dashboard & Analytics
- Fairness trend visualization over time
- Model performance tracking
- Critical disparity alerts
- Bias signal monitoring

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Express.js, Node.js |
| **Database** | SQLite with Prisma ORM |
| **Charts** | Recharts |
| **AI (Optional)** | Google Gemini API for copilot chat |

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/fairlens.git
   cd fairlens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY (optional, for AI copilot)
   ```

4. **Initialize database:**
   ```bash
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

---

## Usage Guide

### Running a Dataset Audit

1. **Navigate to Dataset Audit** from the dashboard
2. **Download a sample dataset** or upload your own CSV
3. **Review detected columns** — sensitive attributes are auto-highlighted
4. **Click "Begin Bias Audit"** to run statistical analysis
5. **Review results:**
   - Fairness Score (0-100)
   - Disparate Impact ratio (legal threshold: 0.80)
   - Group selection rates
   - Proxy variable warnings
   - Recommended mitigations

### Understanding Results

| Metric | Description | Legal Threshold |
|--------|-------------|-----------------|
| **Disparate Impact** | Ratio of selection rates (min/max) | ≥ 0.80 (4/5 rule) |
| **Statistical Parity** | Difference in selection rates | < 0.20 |
| **Equalized Odds** | Error rate parity across groups | Close to 1.0 |

### Generating Compliance Reports

1. Go to **Reports** page
2. Click **"Start Generation"** for EU AI Act documentation
3. Download individual reports from the table
4. Access **Audit Log Vault** for historical records

---

## Project Structure

```
fairlens/
├── src/
│   ├── components/        # Reusable UI components
│   ├── components/ui/     # shadcn/ui components
│   ├── pages/
│   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── DashboardOverviewPage.tsx
│   │   │   ├── DatasetAuditPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── RecommendationsPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   └── SandboxPage.tsx
│   │   └── auth/           # Login/Signup pages
│   ├── services/
│   │   └── fairnessAnalyzer.ts  # Core fairness algorithms
│   ├── lib/
│   │   └── db.ts           # Prisma database client
│   └── App.tsx             # Main routes
├── public/
│   └── samples/            # Sample CSV datasets
│       ├── hiring_sample.csv
│       ├── banking_sample.csv
│       ├── healthcare_sample.csv
│       └── education_sample.csv
├── prisma/
│   └── schema.prisma       # Database schema
├── server.ts               # Express backend API
└── package.json
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analyze-dataset` | POST | Analyze CSV for fairness |
| `/api/samples/:industry` | GET | Download sample dataset |
| `/api/audit/summary` | GET | Dashboard statistics |
| `/api/audits` | GET | List all audits |
| `/api/audit/save` | POST | Save audit results |
| `/api/copilot/chat` | POST | AI assistant chat |

---

## How It Works

### Fairness Analysis Pipeline

1. **CSV Parsing** — Extract headers and sample rows
2. **Column Profiling** — Detect data types (numerical/categorical/boolean)
3. **Sensitive Attribute Detection** — Pattern matching on column names
4. **Outcome Variable Detection** — Identify target/decision columns
5. **Metric Computation**:
   - Group selection rates per protected attribute
   - Disparate Impact ratio (min_rate / max_rate)
   - Statistical Parity Difference
   - Correlation analysis for proxy detection
6. **Recommendation Generation** — Suggest mitigations based on findings

### No External AI Required

The core fairness analysis runs entirely offline using statistical methods:
- Cramér's V for categorical correlations
- Pearson correlation for numerical associations
- Standard fairness metrics (DI, SPD, Equalized Odds)

The **Gemini API** is only used for the optional Copilot chat feature.

---

## Compliance

FairLens helps organizations meet requirements for:
- **EU AI Act** (High-Risk AI Systems)
- **Equal Employment Opportunity** (EEOC guidelines)
- **Fair Credit Reporting Act** (FCRA)
- **General Data Protection Regulation** (GDPR) Article 22

---

## Development

### Adding New Sample Datasets

1. Create a CSV file in `public/samples/`
2. Include columns for protected attributes (gender, race, age, etc.)
3. Include an outcome column (hired, approved, etc.)
4. Ensure at least 20 rows for meaningful analysis

### Customizing Fairness Thresholds

Edit `src/services/fairnessAnalyzer.ts`:
```typescript
const DISPARATE_IMPACT_THRESHOLD = 0.80;
const STATISTICAL_PARITY_THRESHOLD = 0.20;
```

---

## License

MIT License — free for commercial and non-commercial use.

---

## Support

For issues or questions:
- Open a GitHub issue
- Contact: support@fairlens.ai

---

**Built with  for ethical AI.**
