// src/lib/audit-engine.ts
// Hardcoded rule-based logic — no AI here. Knowing when NOT to use AI is part of the design.

import { AuditInput, AuditResult, Recommendation, ToolAuditResult, ToolId } from "@/types"
import { getPlanById, getToolById, TOOLS } from "./pricing"
function nanoid(size = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < size; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

// ─── Individual tool evaluators ──────────────────────────────────────────────

function auditCursor(entry: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, monthlySpend, seats } = entry

  if (useCase !== "coding") {
    return {
      action: "switch",
      targetTool: "Claude Pro or ChatGPT Plus",
      reason: `Cursor is a coding IDE; for ${useCase} tasks, a general-purpose AI assistant gives better value.`,
      monthlySavings: monthlySpend,
      annualSavings: monthlySpend * 12,
    }
  }

  if (plan === "business" && seats <= 3) {
    const savings = (40 - 20) * seats
    return {
      action: "downgrade",
      targetPlan: "Pro",
      reason: `Business plan adds SSO/privacy mode — unnecessary for ≤3 seats. Pro is identical for practical daily use.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "enterprise" && seats < 20) {
    const savings = (100 - 40) * seats
    return {
      action: "downgrade",
      targetPlan: "Business",
      reason: `Enterprise pricing is designed for 20+ seat contracts with custom SLAs. At ${seats} seats, Business covers all real needs.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "pro" && seats >= 10) {
    return {
      action: "right_plan",
      reason: `Pro at ${seats} seats is correctly sized. Business adds org controls worth considering at this scale, but Pro spend is efficient.`,
      monthlySavings: 0,
      annualSavings: 0,
    }
  }

  const expectedSpend = getPlanById("cursor", plan)?.pricePerSeat ?? 0
  const actualPerSeat = monthlySpend / seats
  if (actualPerSeat > expectedSpend * 1.15) {
    const overcharge = (actualPerSeat - expectedSpend) * seats
    return {
      action: "right_plan",
      reason: `Your per-seat cost ($${actualPerSeat.toFixed(2)}) is above list price. Verify billing — you may have add-ons or overages.`,
      monthlySavings: overcharge,
      annualSavings: overcharge * 12,
    }
  }

  return {
    action: "optimal",
    reason: `Cursor ${plan} is correctly matched to your ${seats}-seat coding team.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditGitHubCopilot(entry: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, monthlySpend, seats } = entry

  if (useCase !== "coding") {
    return {
      action: "switch",
      targetTool: "Claude Pro",
      reason: "GitHub Copilot is purpose-built for coding autocomplete; it provides minimal value for non-coding use cases.",
      monthlySavings: monthlySpend,
      annualSavings: monthlySpend * 12,
    }
  }

  if (plan === "enterprise" && seats < 10) {
    const savings = (39 - 19) * seats
    return {
      action: "downgrade",
      targetPlan: "Business",
      reason: `Enterprise's fine-tuning and personalization features require a large codebase corpus to be useful. At ${seats} seats it's premature.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "business" && seats === 1) {
    const savings = 19 - 10
    return {
      action: "downgrade",
      targetPlan: "Individual",
      reason: "Business plan requires 2+ seats and adds org controls you don't need as a solo user.",
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  return {
    action: "optimal",
    reason: `GitHub Copilot ${plan} is well-matched to your ${seats}-person coding team.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditClaude(entry: { plan: string; monthlySpend: number; seats: number }, teamSize: number, useCase: string): Recommendation {
  const { plan, monthlySpend, seats } = entry

  if (plan === "team" && seats < 5) {
    const savings = (25 - 20) * seats
    return {
      action: "downgrade",
      targetPlan: "Pro (individual)",
      reason: `Claude Team has a 5-seat minimum — at ${seats} seats you're paying 25/seat vs 20/seat for individual Pro with identical features.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "enterprise" && teamSize < 15) {
    const savings = (60 - 25) * seats
    return {
      action: "downgrade",
      targetPlan: "Team",
      reason: `Claude Enterprise's custom data retention and SAML SSO are overkill for teams under 15. Team plan covers collaboration needs.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "max" && seats > 3 && useCase !== "data" && useCase !== "coding") {
    const savings = (100 - 20) * seats
    return {
      action: "downgrade",
      targetPlan: "Pro",
      reason: `Claude Max's 20× usage cap is for power users doing extended research/coding. For ${useCase} at ${seats} seats, Pro's 5× limit is sufficient.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  return {
    action: "optimal",
    reason: `Claude ${plan} is appropriately matched for your ${useCase} use case.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditChatGPT(entry: { plan: string; monthlySpend: number; seats: number }, teamSize: number, useCase: string): Recommendation {
  const { plan, seats } = entry

  if (plan === "enterprise" && teamSize < 20) {
    const savings = (60 - 25) * seats
    return {
      action: "downgrade",
      targetPlan: "Team",
      reason: `ChatGPT Enterprise is designed for 20+ person orgs with compliance requirements. Team plan is functionally equivalent at your size.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  if (plan === "plus" && seats > 1) {
    // Plus is per-seat individual — if "seats > 1" it means multiple individual accounts
    const savings = (25 - 20) * seats // each person could be on Team and share workspace
    return {
      action: "right_plan",
      reason: `Multiple Plus accounts lose team workspace features. Consider Team plan for shared prompts, admin, and 32K context.`,
      monthlySavings: 0, // slight premium, not a savings
      annualSavings: 0,
    }
  }

  if (useCase === "coding" && (plan === "plus" || plan === "team")) {
    return {
      action: "switch",
      targetTool: "Cursor Pro",
      reason: `For coding, a purpose-built IDE assistant (Cursor) provides inline completions, codebase context, and agentic edits that ChatGPT cannot match.`,
      monthlySavings: 0,
      annualSavings: 0,
    }
  }

  return {
    action: "optimal",
    reason: `ChatGPT ${plan} is appropriate for your ${useCase} workflow.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditAPISpend(
  toolId: ToolId,
  entry: { plan: string; monthlySpend: number; seats: number },
  teamSize: number,
  useCase: string
): Recommendation {
  const { monthlySpend } = entry

  if (toolId === "openai_api" && monthlySpend > 200) {
    const estimatedSavings = monthlySpend * 0.3
    return {
      action: "switch",
      targetTool: "Anthropic API (Claude 3.5 Sonnet)",
      reason: `Anthropic's Claude 3.5 Sonnet costs $3/MTok vs GPT-4o's $5/MTok for comparable quality — ~40% cheaper for most inference workloads.`,
      monthlySavings: estimatedSavings,
      annualSavings: estimatedSavings * 12,
      credexOpportunity: true,
    }
  }

  if (toolId === "anthropic_api" && monthlySpend > 500) {
    return {
      action: "credits",
      reason: `At $${monthlySpend}/mo you're a candidate for volume credits. Credex sources discounted Anthropic API credits that could cut this 20–40%.`,
      monthlySavings: monthlySpend * 0.25,
      annualSavings: monthlySpend * 0.25 * 12,
      credexOpportunity: true,
    }
  }

  return {
    action: "optimal",
    reason: `API spend at this level is within normal range. Keep monitoring token efficiency as usage scales.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditGemini(entry: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, seats } = entry

  if (plan === "advanced" && useCase === "coding") {
    return {
      action: "switch",
      targetTool: "GitHub Copilot Individual",
      reason: `Gemini Advanced lacks IDE-native code completion. GitHub Copilot at $10/seat is purpose-built and cheaper for coding workflows.`,
      monthlySavings: (19.99 - 10) * seats,
      annualSavings: (19.99 - 10) * seats * 12,
    }
  }

  if (plan === "business" && seats < 5) {
    return {
      action: "downgrade",
      targetPlan: "Advanced (Google One AI)",
      reason: `Google Workspace AI Business requires a Workspace subscription on top. If you're not using Workspace, Advanced personal plan is $5/seat cheaper.`,
      monthlySavings: (24 - 19.99) * seats,
      annualSavings: (24 - 19.99) * seats * 12,
    }
  }

  return {
    action: "optimal",
    reason: `Gemini ${plan} is adequately matched for your ${useCase} tasks.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

function auditWindsurf(entry: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, monthlySpend, seats } = entry

  if (useCase !== "coding") {
    return {
      action: "switch",
      targetTool: "Claude Pro",
      reason: "Windsurf is an AI coding editor. For non-coding use cases you're paying for capabilities you're not using.",
      monthlySavings: monthlySpend,
      annualSavings: monthlySpend * 12,
    }
  }

  if (plan === "teams" && seats < 5) {
    const savings = (35 - 15) * seats
    return {
      action: "downgrade",
      targetPlan: "Pro",
      reason: `Windsurf Teams adds admin/audit tooling useful at 5+ seats. At ${seats} seats, Pro gives identical coding capability for $20/seat less.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    }
  }

  return {
    action: "optimal",
    reason: `Windsurf ${plan} is reasonable for your coding team of ${seats}.`,
    monthlySavings: 0,
    annualSavings: 0,
  }
}

// ─── Main audit runner ────────────────────────────────────────────────────────

export function runAudit(input: AuditInput): AuditResult {
  const results: ToolAuditResult[] = input.tools.map((entry) => {
    const tool = getToolById(entry.toolId)
    let recommendation: Recommendation

    switch (entry.toolId) {
      case "cursor":
        recommendation = auditCursor(entry, input.useCase)
        break
      case "github_copilot":
        recommendation = auditGitHubCopilot(entry, input.useCase)
        break
      case "claude":
        recommendation = auditClaude(entry, input.teamSize, input.useCase)
        break
      case "chatgpt":
        recommendation = auditChatGPT(entry, input.teamSize, input.useCase)
        break
      case "anthropic_api":
      case "openai_api":
        recommendation = auditAPISpend(entry.toolId, entry, input.teamSize, input.useCase)
        break
      case "gemini":
        recommendation = auditGemini(entry, input.useCase)
        break
      case "windsurf":
        recommendation = auditWindsurf(entry, input.useCase)
        break
      default:
        recommendation = { action: "optimal", reason: "No specific audit rule for this tool.", monthlySavings: 0, annualSavings: 0 }
    }

    return {
      toolId: entry.toolId,
      toolName: tool.name,
      currentPlan: entry.plan,
      currentSpend: entry.monthlySpend,
      recommendation,
    }
  })

  const totalMonthlySavings = results.reduce((acc, r) => acc + r.recommendation.monthlySavings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    id: nanoid(10),
    input,
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal: totalMonthlySavings === 0,
    createdAt: new Date().toISOString(),
  }
}

export function buildAuditSummaryPrompt(result: AuditResult): string {
  const toolLines = result.results
    .map((r) => `- ${r.toolName} (${r.currentPlan}, $${r.currentSpend}/mo, ${r.recommendation.action}: ${r.recommendation.reason})`)
    .join("\n")

  return `You are a concise AI spend advisor. Write a ~100 word personalized summary for a startup team.

Context:
- Team size: ${result.input.teamSize}
- Primary use case: ${result.input.useCase}
- Total monthly AI spend: $${result.input.tools.reduce((a, t) => a + t.monthlySpend, 0)}
- Total potential savings: $${result.totalMonthlySavings.toFixed(0)}/mo ($${result.totalAnnualSavings.toFixed(0)}/yr)

Tool-by-tool findings:
${toolLines}

Write a warm but direct 100-word paragraph. Acknowledge what they're doing well, highlight the biggest saving opportunity, and give one concrete next step. Do not use bullet points. Do not mention Credex. Sound like a knowledgeable CFO friend.`
}