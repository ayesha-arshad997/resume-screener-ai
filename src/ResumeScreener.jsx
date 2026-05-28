import { useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const ACCENT = "#0ea5e9";

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0f1117",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: 0,
  },
  header: {
    background: "linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)",
    borderBottom: "1px solid #1e293b",
    padding: "24px 40px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
  },
  body: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "36px 40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 28,
  },
  card: {
    background: "#161b27",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 24,
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    background: "#0f1117",
    border: "1px solid #2d3748",
    borderRadius: 10,
    color: "#e2e8f0",
    padding: 14,
    resize: "vertical",
  },
  button: (disabled) => ({
    width: "100%",
    padding: 14,
    marginTop: 20,
    border: "none",
    borderRadius: 10,
    background: disabled
      ? "#1e293b"
      : "linear-gradient(135deg, #0ea5e9, #6366f1)",
    color: "#fff",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  }),
  resultCard: {
    gridColumn: "1 / -1",
    background: "#161b27",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 28,
  },
};

function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export default function ResumeScreener() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resumeText || !jobDesc) return;

    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `
Analyze resume vs job description.

Return ONLY JSON:
{
  "matchScore": 0-100,
  "verdict": "Strong Match|Good Match|Partial Match|Poor Match",
  "summary": "short summary",
  "candidateName": "name",
  "experience": "years",
  "education": "degree",
  "extractedSkills": [],
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "gaps": []
}

RESUME:
${resumeText}

JOB:
${jobDesc}
`;

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data?.content?.[0]?.text || "";

      const parsed = parseJSON(text);

      if (!parsed) {
        setError("Failed to parse response");
      } else {
        setResult(parsed);
      }
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  const canAnalyze = resumeText && jobDesc && !loading;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.logo}>RS</div>
        <div>Resume Screener AI</div>
      </div>

      <div style={styles.body}>
        <div style={styles.card}>
          <h3>Resume</h3>
          <textarea
            style={styles.textarea}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div style={styles.card}>
          <h3>Job Description</h3>
          <textarea
            style={styles.textarea}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <button
            style={styles.button(!canAnalyze)}
            disabled={!canAnalyze}
            onClick={analyze}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        {result && (
          <div style={styles.resultCard}>
            <h2>{result.candidateName}</h2>
            <p>{result.summary}</p>
            <h3>Score: {result.matchScore}</h3>
            <h4>{result.verdict}</h4>
          </div>
        )}
      </div>
    </div>
  );
}