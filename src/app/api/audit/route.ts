import { NextRequest, NextResponse } from "next/server"
import { runAudit, buildAuditSummaryPrompt } from "@/lib/audit-engine"
import { AuditInput } from "@/types"

// Simple in-memory store (replace with Supabase later)
const auditStore = new Map<string, object>()

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json()
    
    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 })
    }

    const result = runAudit(body)

    // Try to get AI summary
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (apiKey && apiKey !== "placeholder") {
        const prompt = buildAuditSummaryPrompt(result)
        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }],
          }),
        })
        const aiData = await aiRes.json()
        result.aiSummary = aiData.content?.[0]?.text ?? undefined
      }
    } catch {
      // Fallback: no AI summary, results still shown
    }

    // Fallback summary if AI unavailable
    if (!result.aiSummary) {
      const totalSpend = body.tools.reduce((a, t) => a + t.monthlySpend, 0)
      result.aiSummary = result.isOptimal
        ? `Your team of ${body.teamSize} is spending $${totalSpend}/mo on AI tools and doing it efficiently. Your plan selections are well-matched to your ${body.useCase} use case. No immediate action needed — revisit this audit when your team size changes or new tools launch.`
        : `Your team of ${body.teamSize} is spending $${totalSpend}/mo on AI tools with $${result.totalMonthlySavings.toFixed(0)}/mo in identified savings — $${result.totalAnnualSavings.toFixed(0)} annually. The biggest opportunity is ${result.results.find(r => r.recommendation.monthlySavings > 0)?.toolName ?? "across your stack"}. Acting on these recommendations requires minimal migration effort and no capability loss.`
    }

    auditStore.set(result.id, result)
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const result = auditStore.get(id)
  if (!result) return NextResponse.json({ error: "Audit not found" }, { status: 404 })
  return NextResponse.json(result)
}