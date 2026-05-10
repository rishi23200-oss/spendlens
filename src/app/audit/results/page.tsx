"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

interface Recommendation {
  action: string; targetTool?: string; targetPlan?: string
  reason: string; monthlySavings: number; annualSavings: number; credexOpportunity?: boolean
}
interface ToolResult {
  toolId: string; toolName: string; currentPlan: string
  currentSpend: number; recommendation: Recommendation
}
interface AuditResult {
  id: string; results: ToolResult[]; totalMonthlySavings: number
  totalAnnualSavings: number; aiSummary?: string; isOptimal: boolean
  input: { teamSize: number; useCase: string; tools: { monthlySpend: number }[] }
}

const ACTION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  downgrade:  { label: "Downgrade Plan", color: "#CC3410", bg: "#FFF0ED" },
  switch:     { label: "Switch Tool",    color: "#7C3AED", bg: "#F5F0FF" },
  credits:    { label: "Use Credits",    color: "#0284C7", bg: "#F0F9FF" },
  optimal:    { label: "Optimal ✓",      color: "#16A34A", bg: "#F0FDF4" },
  right_plan: { label: "Check Billing",  color: "#D97706", bg: "#FFFBEB" },
}

function ResultsContent() {
  const params = useSearchParams()
  const id = params.get("id")
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/audit?id=${id}`)
      .then(r => r.json())
      .then(d => { setResult(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  const handleLeadSubmit = async () => {
    if (!email || !result) return
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, auditId: result.id }),
    })
    setSubmitted(true)
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F3" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Analyzing your stack...</div>
        <div style={{ color: "#A0A090", fontSize: 14 }}>Running audit engine</div>
      </div>
    </div>
  )

  if (!result) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, marginBottom: 16 }}>Audit not found.</div>
        <Link href="/audit" className="btn-acid">Start a new audit</Link>
      </div>
    </div>
  )

  const totalSpend = result.input.tools.reduce((a, t) => a + t.monthlySpend, 0)
  const showCredex = result.totalMonthlySavings > 500

  return (
    <main style={{ minHeight: "100vh", background: "#F5F5F3" }}>
      <nav style={{ borderBottom: "2px solid #E8E8E3", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
        <Link href="/" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, textDecoration: "none", color: "#0D0D0D" }}>
          spend<span style={{ color: "#FF4D1C" }}>lens</span>
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={copyLink} className="btn-ink" style={{ fontSize: 12, padding: "8px 16px" }}>
            {copying ? "Copied! ✓" : "Share Audit"}
          </button>
          <Link href="/audit" className="btn-acid" style={{ fontSize: 12, padding: "8px 16px" }}>
            New Audit
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        <div className="animate-fade-up" style={{ background: "#0D0D0D", color: "#F5F5F3", padding: 40, marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: "#C8F135", borderRadius: "50%", opacity: 0.1 }} />
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#A0A090", marginBottom: 12, letterSpacing: "0.1em" }}>AUDIT COMPLETE · {new Date().toLocaleDateString()}</div>
          {result.isOptimal ? (
            <>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>You&apos;re spending well. ✓</div>
              <div style={{ color: "#A0A090", fontSize: 15 }}>Your ${totalSpend}/mo AI stack is optimally configured for your team of {result.input.teamSize}.</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: "#A0A090", marginBottom: 4 }}>POTENTIAL MONTHLY SAVINGS</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 56, color: "#C8F135", lineHeight: 1, marginBottom: 4 }}>
                ${result.totalMonthlySavings.toLocaleString()}
              </div>
              <div style={{ color: "#A0A090", fontSize: 15, marginBottom: 16 }}>
                ${result.totalAnnualSavings.toLocaleString()} saved annually · from ${totalSpend.toLocaleString()}/mo current spend
              </div>
              <div style={{ height: 2, background: "#1C1C14", marginBottom: 16 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { l: "Current spend", v: `$${totalSpend}/mo` },
                  { l: "After optimizing", v: `$${(totalSpend - result.totalMonthlySavings).toFixed(0)}/mo` },
                  { l: "Annual savings", v: `$${result.totalAnnualSavings.toLocaleString()}` },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 11, color: "#707060", fontFamily: "DM Mono, monospace", marginBottom: 4 }}>{s.l.toUpperCase()}</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {result.aiSummary && (
          <div className="animate-fade-up delay-100" style={{ background: "white", border: "2px solid #E8E8E3", padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#A0A090", marginBottom: 12, letterSpacing: "0.1em" }}>AI SUMMARY</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#2E2E22" }}>{result.aiSummary}</p>
          </div>
        )}

        <div className="animate-fade-up delay-200" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Tool-by-Tool Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.results.map((r, i) => {
              const st = ACTION_LABELS[r.recommendation.action] ?? ACTION_LABELS.optimal
              return (
                <div key={r.toolId} className="animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.05}s`, background: "white", border: "2px solid #E8E8E3", padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16 }}>{r.toolName}</span>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#A0A090", marginLeft: 8 }}>{r.currentPlan} · ${r.currentSpend}/mo</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {r.recommendation.monthlySavings > 0 && (
                        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "#16A34A" }}>
                          −${r.recommendation.monthlySavings.toFixed(0)}/mo
                        </span>
                      )}
                      <span style={{ background: st.bg, color: st.color, fontSize: 11, fontFamily: "DM Mono, monospace", padding: "4px 10px", fontWeight: 600 }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#4A4A3A", lineHeight: 1.6, margin: 0 }}>{r.recommendation.reason}</p>
                  {r.recommendation.targetPlan && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#707060" }}>→ Switch to: <strong>{r.recommendation.targetPlan}</strong></div>
                  )}
                  {r.recommendation.targetTool && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#707060" }}>→ Consider: <strong>{r.recommendation.targetTool}</strong></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {showCredex && (
          <div className="animate-fade-up delay-300" style={{ background: "#C8F135", border: "2px solid #0D0D0D", padding: 32, marginBottom: 24 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, marginBottom: 8, letterSpacing: "0.1em" }}>MAXIMIZE YOUR SAVINGS</div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
              You could save even more with Credex credits.
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20, color: "#2E2E22" }}>
              Credex sells discounted AI infrastructure credits — Claude, ChatGPT Enterprise, Cursor — sourced from companies that overforecast. Real discounts, same products.
            </p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="btn-ink">
              Book a Credex Consultation →
            </a>
          </div>
        )}

        <div className="animate-fade-up delay-400" style={{ background: "white", border: "2px solid #E8E8E3", padding: 32, marginBottom: 24 }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Report sent!</div>
              <div style={{ fontSize: 14, color: "#707060" }}>Check your inbox for your audit summary.</div>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#A0A090", marginBottom: 8, letterSpacing: "0.1em" }}>
                {result.isOptimal ? "STAY UPDATED" : "GET YOUR REPORT"}
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                {result.isOptimal ? "Notify me when new optimizations apply to my stack" : "Email me this audit report"}
              </h3>
              <p style={{ fontSize: 14, color: "#707060", marginBottom: 20 }}>
                {result.isOptimal ? "We'll reach out when better options appear for your tools." : "Get a full breakdown with action steps delivered to your inbox."}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)} className="input-base"
                  style={{ flex: 1, minWidth: 200 }} />
                <button onClick={handleLeadSubmit} className="btn-ink" style={{ whiteSpace: "nowrap" }}>
                  {result.isOptimal ? "Notify Me" : "Send Report"} →
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#707060" }}>Share this audit with your team or CFO:</div>
          <button onClick={copyLink} className="btn-acid" style={{ fontSize: 13, padding: "10px 20px" }}>
            {copying ? "Link copied! ✓" : "Copy Shareable Link"}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F3" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20 }}>Loading audit...</div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}