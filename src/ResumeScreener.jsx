import { useState, useRef } from "react";

const ACCENT = "#0ea5e9";

const styles = {
  root: { minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "0" },
  header: { background: "linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)", borderBottom: "1px solid #1e293b", padding: "24px 40px", display: "flex", alignItems: "center", gap: "14px" },
  logo: { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-1px" },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.5px" },
  headerSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  body: { maxWidth: 1100, margin: "0 auto", padding: "36px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 },
  card: { background: "#161b27", border: "1px solid #1e293b", borderRadius: 16, padding: "24px 28px" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  dropZone: (dragging) => ({ border: `2px dashed ${dragging ? ACCENT : "#2d3748"}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: dragging ? "rgba(14,165,233,0.07)" : "transparent" }),
  dropIcon: { fontSize: 36, marginBottom: 10, opacity: 0.5 },
  dropText: { fontSize: 14, color: "#94a3b8" },
  dropSub: { fontSize: 12, color: "#475569", marginTop: 4 },
  fileChip: { display: "flex", alignItems: "center", gap: 10, background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 8, padding: "10px 14px", marginTop: 14 },
  fileIcon: { fontSize: 22, color: ACCENT },
  fileName: { fontSize: 13, fontWeight: 500, color: "#e2e8f0", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  removeBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, padding: 2 },
  textarea: { width: "100%", minHeight: 180, background: "#0f1117", border: "1px solid #2d3748", borderRadius: 10, color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, padding: "14px 16px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" },
  analyzeBtn: (disabled) => ({ width: "100%", padding: "14px", background: disabled ? "#1e293b" : "linear-gradient(135deg, #0ea5e9, #6366f1)", border: "none", borderRadius: 10, color: disabled ? "#475569" : "#fff", fontSize: 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", marginTop: 20, letterSpacing: "0.01em", transition: "opacity 0.2s" }),
  resultsCard: { background: "#161b27", border: "1px solid #1e293b", borderRadius: 16, padding: "28px", gridColumn: "1 / -1" },
  scoreRow: { display: "flex", alignItems: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" },
  scoreCircleWrap: { position: "relative", width: 110, height: 110, flexShrink: 0 },
  scoreSVG: { transform: "rotate(-90deg)" },
  scoreNum: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 28, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-1px" },
  scoreLabel: { fontSize: 12, color: "#64748b", position: "absolute", bottom: 8, width: "100%", textAlign: "center" },
  verdictBadge: (score) => ({ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: score >= 75 ? "rgba(34,197,94,0.12)" : score >= 50 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)", color: score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171", border: `1px solid ${score >= 75 ? "rgba(34,197,94,0.3)" : score >= 50 ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"}`, display: "inline-flex", alignItems: "center", gap: 6 }),
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, marginTop: 24 },
  skillsGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  skillChip: (matched) => ({ padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: matched ? "rgba(14,165,233,0.12)" : "rgba(100,116,139,0.12)", color: matched ? "#38bdf8" : "#94a3b8", border: `1px solid ${matched ? "rgba(14,165,233,0.3)" : "rgba(100,116,139,0.2)"}` }),
  missingChip: { padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  summaryBox: { background: "#0f1117", border: "1px solid #1e293b", borderRadius: 10, padding: "16px 18px", fontSize: 14, lineHeight: 1.7, color: "#94a3b8", marginTop: 8 },
  progressBarWrap: { background: "#1e293b", borderRadius: 4, height: 6, flex: 1, overflow: "hidden" },
  progressBar: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }),
  metaRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10, fontSize: 13 },
  metaLabel: { color: "#64748b", minWidth: 90, fontSize: 12 },
  spinner: { display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", verticalAlign: "middle", marginRight: 8 },
  divider: { height: 1, background: "#1e293b", margin: "20px 0" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  debugBox: { background: "#0f1117", border: "1px solid #f87171", borderRadius: 8, padding: "12px", fontSize: 12, color: "#f87171", marginTop: 10, wordBreak: "break-all", maxHeight: 120, overflowY: "auto" },
};

function ScoreCircle({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";
  const dash = (score / 100) * circ;
  return (
    <div style={styles.scoreCircleWrap}>
      <svg width={110} height={110} style={styles.scoreSVG} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={styles.scoreNum}>{score}%</div>
      <div style={styles.scoreLabel}>Match</div>
    </div>
  );
}

function parseJSON(text) {
  try {
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) return JSON.parse(text.slice(start, end + 1));
    } catch {}
    return null;
  }
}

export default function ResumeScreener() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const fileRef = useRef();

  const readFile = (f) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) readFile(f);
  };

  const analyze = async () => {
    if (!resumeText || !jobDesc) return;
    setLoading(true);
    setError("");
    setResult(null);
    setDebugInfo("");

    const prompt = `You are a professional resume screening AI. Analyze the resume and job description below.

RESUME:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jobDesc.slice(0, 2000)}

Respond ONLY with a valid JSON object (no markdown, no preamble) with this exact structure:
{
  "matchScore": <integer 0-100>,
  "verdict": "<Strong Match|Good Match|Partial Match|Poor Match>",
  "summary": "<2-3 sentence analysis of overall fit>",
  "candidateName": "<extracted name or Unknown>",
  "experience": "<X years or Not specified>",
  "education": "<highest degree or Not specified>",
  "extractedSkills": ["skill1", "skill2"],
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "categoryScores": {
    "skills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "keywords": <0-100>
  }
}`;

    try {
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
const res = await fetch(`${apiUrl}/api/analyze`, {        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setDebugInfo("RAW: " + text.slice(0, 300));
      const parsed = parseJSON(text);
      if (parsed) {
        setResult(parsed);
        setDebugInfo("");
      } else {
        setError("Parse failed. See debug info below.");
      }
    } catch (e) {
      setError("API error: " + e.message);
    }
    setLoading(false);
  };

  const canAnalyze = resumeText.trim() && jobDesc.trim() && !loading;

  return (
    <div style={styles.root}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } textarea:focus { border-color: #0ea5e9 !important; } input[type=file] { display:none; }`}</style>
      <div style={styles.header}>
        <div style={styles.logo}>RS</div>
        <div>
          <div style={styles.headerTitle}>Resume Screener AI</div>
          <div style={styles.headerSub}>Upload · Extract · Match · Score</div>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.card}>
          <div style={styles.cardTitle}><span>📄</span> Resume</div>
          <div style={styles.dropZone(dragging)} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => fileRef.current.click()}>
            <div style={styles.dropIcon}>📂</div>
            <div style={styles.dropText}>Drop your resume here</div>
            <div style={styles.dropSub}>.txt, .pdf (text), .md — or click to browse</div>
            <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.doc" onChange={(e) => e.target.files[0] && readFile(e.target.files[0])} />
          </div>
          {file && (
            <div style={styles.fileChip}>
              <span style={styles.fileIcon}>📋</span>
              <span style={styles.fileName}>{file.name}</span>
              <button style={styles.removeBtn} onClick={() => { setFile(null); setResumeText(""); }}>✕</button>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Or paste resume text:</div>
            <textarea style={styles.textarea} placeholder="Paste resume content here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}><span>💼</span> Job Description</div>
          <textarea style={{ ...styles.textarea, minHeight: 300 }} placeholder="Paste the job description here..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
          <button style={styles.analyzeBtn(!canAnalyze)} disabled={!canAnalyze} onClick={analyze}>
            {loading ? <><span style={styles.spinner} />Analyzing...</> : "⚡ Analyze Match"}
          </button>
          {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 10 }}>{error}</div>}
          {debugInfo && <div style={styles.debugBox}>{debugInfo}</div>}
        </div>

        {result && (
          <div style={styles.resultsCard}>
            <div style={styles.cardTitle}><span>📊</span> Analysis Results</div>
            <div style={styles.scoreRow}>
              <ScoreCircle score={result.matchScore} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{result.candidateName}</div>
                <span style={styles.verdictBadge(result.matchScore)}>
                  {result.matchScore >= 75 ? "✓" : result.matchScore >= 50 ? "~" : "✗"} {result.verdict}
                </span>
                <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, color: "#64748b" }}>🎓 {result.education}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>⏱ {result.experience}</div>
                </div>
              </div>
            </div>

            <div style={styles.twoCol}>
              <div>
                <div style={styles.sectionTitle}>Category Scores</div>
                {result.categoryScores && Object.entries(result.categoryScores).map(([key, val]) => (
                  <div style={styles.metaRow} key={key}>
                    <div style={styles.metaLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div style={styles.progressBarWrap}><div style={styles.progressBar(val, val >= 70 ? "#4ade80" : val >= 40 ? "#facc15" : "#f87171")} /></div>
                    <div style={{ fontSize: 12, color: "#94a3b8", minWidth: 30 }}>{val}%</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={styles.sectionTitle}>Summary</div>
                <div style={styles.summaryBox}>{result.summary}</div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.twoCol}>
              <div>
                <div style={styles.sectionTitle}>✅ Matched Skills ({result.matchedSkills?.length || 0})</div>
                <div style={styles.skillsGrid}>
                  {result.matchedSkills?.map((s, i) => <span key={i} style={styles.skillChip(true)}>{s}</span>)}
                  {!result.matchedSkills?.length && <span style={{ fontSize: 13, color: "#475569" }}>None found</span>}
                </div>
              </div>
              <div>
                <div style={styles.sectionTitle}>❌ Missing Skills ({result.missingSkills?.length || 0})</div>
                <div style={styles.skillsGrid}>
                  {result.missingSkills?.map((s, i) => <span key={i} style={styles.missingChip}>{s}</span>)}
                  {!result.missingSkills?.length && <span style={{ fontSize: 13, color: "#4ade80" }}>All required skills present!</span>}
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.twoCol}>
              <div>
                <div style={styles.sectionTitle}>💪 Strengths</div>
                {result.strengths?.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #4ade80" }}>{s}</div>
                ))}
              </div>
              <div>
                <div style={styles.sectionTitle}>⚠️ Gaps</div>
                {result.gaps?.map((g, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #f87171" }}>{g}</div>
                ))}
              </div>
            </div>

            <div style={styles.divider} />
            <div style={styles.sectionTitle}>🧠 All Extracted Skills</div>
            <div style={styles.skillsGrid}>
              {result.extractedSkills?.map((s, i) => (
                <span key={i} style={styles.skillChip(result.matchedSkills?.includes(s))}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}