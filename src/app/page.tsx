import Link from "next/link"

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "2px solid #E8E8E3", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20 }}>
          spend<span style={{ color: "#FF4D1C" }}>lens</span>
        </span>
        <Link href="/audit" className="btn-ink" style={{ fontSize: 12, padding: "8px 16px" }}>
          Run Free Audit →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,241,53,0.2)", border: "1px solid rgba(200,241,53,0.6)", padding: "6px 16px", fontSize: 12, fontFamily: "DM Mono, monospace", marginBottom: 32, color: "#4A4A3A" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F135", display: "inline-block" }} />
          Free · No login · Results in 60 seconds
        </div>

        <h1 className="animate-fade-up delay-100" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 8vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24 }}>
          Your team is probably<br />
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "relative", zIndex: 1 }}>overpaying</span>
            <span style={{ position: "absolute", bottom: 4, left: 0, right: 0, height: 16, background: "#C8F135", zIndex: 0, transform: "skewX(-2deg)" }} />
          </span>{" "}for AI.
        </h1>

        <p className="animate-fade-up delay-200" style={{ fontSize: 18, color: "#707060", maxWidth: 520, marginBottom: 40, lineHeight: 1.6 }}>
          Most startups overspend on AI tools by 30–60% — wrong plans, duplicate tools, retail prices when credits exist. SpendLens audits your stack in 2 minutes.
        </p>

        <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/audit" className="btn-acid" style={{ fontSize: 16, padding: "16px 32px" }}>
            Audit My AI Spend — Free
          </Link>
          <a href="#how" className="btn-ink" style={{ background: "white", color: "#0D0D0D", fontSize: 14, padding: "16px 24px" }}>
            How it works ↓
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-400" style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, borderTop: "2px solid #E8E8E3", paddingTop: 40, width: "100%", maxWidth: 400 }}>
          {[{ n: "$2,400", l: "avg. annual savings" }, { n: "8", l: "tools benchmarked" }, { n: "2 min", l: "to complete" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 24 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#A0A090", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: "white", borderTop: "2px solid #E8E8E3", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 32, textAlign: "center", marginBottom: 48 }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", border: "2px solid #0D0D0D" }}>
            {[
              { n: "01", t: "Enter your stack", d: "Tell us which AI tools your team uses, which plan, and how many seats." },
              { n: "02", t: "Get the audit", d: "Our engine checks every tool against current pricing and usage patterns." },
              { n: "03", t: "See the savings", d: "Per-tool breakdown with specific actions, dollar amounts, and reasoning." },
            ].map((item, i) => (
              <div key={item.n} style={{ padding: 32, borderRight: i < 2 ? "2px solid #0D0D0D" : "none" }}>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 40, fontWeight: 700, color: "#C8F135", WebkitTextStroke: "2px #0D0D0D", marginBottom: 16 }}>{item.n}</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{item.t}</div>
                <div style={{ fontSize: 14, color: "#707060", lineHeight: 1.6 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0D0D0D", color: "#F5F5F3", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 16 }}>Ready to find what you're wasting?</h2>
        <p style={{ color: "#A0A090", marginBottom: 32, fontSize: 14 }}>Free. No account needed. Under 2 minutes.</p>
        <Link href="/audit" className="btn-acid">Start Your Free Audit →</Link>
      </section>

      <footer style={{ borderTop: "2px solid #E8E8E3", padding: "24px", textAlign: "center", fontSize: 12, color: "#A0A090", fontFamily: "DM Mono, monospace" }}>
        SpendLens is a free tool by <a href="https://credex.rocks" style={{ textDecoration: "underline" }}>Credex</a>. Pricing data updated weekly.
      </footer>
    </main>
  )
}