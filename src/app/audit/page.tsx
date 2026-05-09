"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const TOOLS = [
  { id: "cursor", name: "Cursor", plans: ["hobby", "pro", "business", "enterprise"] },
  { id: "github_copilot", name: "GitHub Copilot", plans: ["individual", "business", "enterprise"] },
  { id: "claude", name: "Claude", plans: ["free", "pro", "max", "team", "enterprise"] },
  { id: "chatgpt", name: "ChatGPT", plans: ["plus", "team", "enterprise"] },
  { id: "anthropic_api", name: "Anthropic API", plans: ["pay_as_you_go"] },
  { id: "openai_api", name: "OpenAI API", plans: ["pay_as_you_go"] },
  { id: "gemini", name: "Gemini", plans: ["free", "advanced", "business"] },
  { id: "windsurf", name: "Windsurf", plans: ["free", "pro", "teams"] },
]

const USE_CASES = ["coding", "writing", "data", "research", "mixed"]

interface ToolEntry { toolId: string; plan: string; monthlySpend: number; seats: number }

const STORAGE_KEY = "spendlens_audit_input"

export default function AuditPage() {
  const router = useRouter()
  const [teamSize, setTeamSize] = useState(5)
  const [useCase, setUseCase] = useState("mixed")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [entries, setEntries] = useState<Record<string, ToolEntry>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Persist form state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { teamSize: ts, useCase: uc, selectedTools: st, entries: en } = JSON.parse(saved)
      if (ts) setTeamSize(ts)
      if (uc) setUseCase(uc)
      if (st) setSelectedTools(st)
      if (en) setEntries(en)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teamSize, useCase, selectedTools, entries }))
  }, [teamSize, useCase, selectedTools, entries])

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    )
    if (!entries[toolId]) {
      const tool = TOOLS.find(t => t.id === toolId)!
      setEntries(prev => ({ ...prev, [toolId]: { toolId, plan: tool.plans[1] ?? tool.plans[0], monthlySpend: 0, seats: 1 } }))
    }
  }

  const updateEntry = (toolId: string, field: keyof ToolEntry, value: string | number) => {
    setEntries(prev => ({ ...prev, [toolId]: { ...prev[toolId], [field]: value } }))
  }

  const handleSubmit = async () => {
    if (selectedTools.length === 0) { setError("Please select at least one AI tool."); return }
    setLoading(true); setError("")
    try {
      const tools = selectedTools.map(id => entries[id]).filter(Boolean)
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools, teamSize, useCase }),
      })
      const data = await res.json()
      if (data.id) router.push(`/audit/results?id=${data.id}`)
      else setError("Something went wrong. Please try again.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalSpend = selectedTools.reduce((acc, id) => acc + (entries[id]?.monthlySpend || 0), 0)

  return (
    <main style={{ minHeight: "100vh", background: "#F5F5F3" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "2px solid #E8E8E3", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
        <Link href="/" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, textDecoration: "none", color: "#0D0D0D" }}>
          spend<span style={{ color: "#FF4D1C" }}>lens</span>
        </Link>
        {totalSpend > 0 && (
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: "#707060" }}>
            Total: <strong style={{ color: "#0D0D0D" }}>${totalSpend.toLocaleString()}/mo</strong>
          </span>
        )}
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div className="animate-fade-up">
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#A0A090", marginBottom: 8 }}>STEP 1 OF 1</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>Your AI Stack</h1>
          <p style={{ color: "#707060", fontSize: 15, marginBottom: 40 }}>Select the tools you're paying for and fill in your current spend.</p>
        </div>

        {/* Team info */}
        <div className="animate-fade-up delay-100" style={{ background: "white", border: "2px solid #E8E8E3", padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Team Info</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontFamily: "DM Mono, monospace", color: "#707060", display: "block", marginBottom: 6 }}>TEAM SIZE</label>
              <input type="number" min={1} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))}
                className="input-base" placeholder="e.g. 8" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontFamily: "DM Mono, monospace", color: "#707060", display: "block", marginBottom: 6 }}>PRIMARY USE CASE</label>
              <select value={useCase} onChange={e => setUseCase(e.target.value)} className="input-base" style={{ cursor: "pointer" }}>
                {USE_CASES.map(uc => <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tool selector */}
        <div className="animate-fade-up delay-200" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Select Your Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 8 }}>
            {TOOLS.map(tool => {
              const selected = selectedTools.includes(tool.id)
              return (
                <button key={tool.id} onClick={() => toggleTool(tool.id)}
                  style={{ padding: "12px 16px", border: `2px solid ${selected ? "#0D0D0D" : "#E8E8E3"}`, background: selected ? "#0D0D0D" : "white", color: selected ? "#C8F135" : "#0D0D0D", fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
                  {selected ? "✓ " : ""}{tool.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Per-tool config */}
        {selectedTools.length > 0 && (
          <div className="animate-fade-in" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Tool Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedTools.map(toolId => {
                const tool = TOOLS.find(t => t.id === toolId)!
                const entry = entries[toolId] || { toolId, plan: tool.plans[0], monthlySpend: 0, seats: 1 }
                return (
                  <div key={toolId} style={{ background: "white", border: "2px solid #E8E8E3", padding: 20 }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                      {tool.name}
                      <button onClick={() => toggleTool(toolId)} style={{ fontSize: 11, color: "#A0A090", background: "none", border: "none", cursor: "pointer" }}>remove</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, fontFamily: "DM Mono, monospace", color: "#707060", display: "block", marginBottom: 4 }}>PLAN</label>
                        <select value={entry.plan} onChange={e => updateEntry(toolId, "plan", e.target.value)} className="input-base" style={{ cursor: "pointer", fontSize: 13 }}>
                          {tool.plans.map(p => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontFamily: "DM Mono, monospace", color: "#707060", display: "block", marginBottom: 4 }}>MONTHLY SPEND ($)</label>
                        <input type="number" min={0} value={entry.monthlySpend || ""} placeholder="0"
                          onChange={e => updateEntry(toolId, "monthlySpend", Number(e.target.value))}
                          className="input-base" style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontFamily: "DM Mono, monospace", color: "#707060", display: "block", marginBottom: 4 }}>SEATS</label>
                        <input type="number" min={1} value={entry.seats || ""} placeholder="1"
                          onChange={e => updateEntry(toolId, "seats", Number(e.target.value))}
                          className="input-base" style={{ fontSize: 13 }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {error && <div style={{ background: "#FFF0ED", border: "2px solid #FF4D1C", padding: 12, marginBottom: 16, fontSize: 13, color: "#CC3410" }}>{error}</div>}

        {/* Submit */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={handleSubmit} disabled={loading} className="btn-acid" style={{ fontSize: 16, padding: "16px 32px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Analyzing..." : "Run My Audit →"}
          </button>
          {totalSpend > 0 && (
            <span style={{ fontSize: 13, color: "#707060" }}>
              Auditing <strong>${totalSpend.toLocaleString()}/mo</strong> across {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </main>
  )
}