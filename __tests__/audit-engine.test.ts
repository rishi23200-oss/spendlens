import { runAudit } from "../src/lib/audit-engine"

describe("Audit Engine", () => {
  test("recommends downgrade for Cursor Business with ≤3 seats", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "business", monthlySpend: 120, seats: 3 }],
      teamSize: 3, useCase: "coding",
    })
    expect(result.results[0].recommendation.action).toBe("downgrade")
    expect(result.results[0].recommendation.monthlySavings).toBeGreaterThan(0)
  })

  test("flags Cursor as wrong tool for non-coding use case", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1, useCase: "writing",
    })
    expect(result.results[0].recommendation.action).toBe("switch")
  })

  test("flags Claude Team with <5 seats as overpriced", () => {
    const result = runAudit({
      tools: [{ toolId: "claude", plan: "team", monthlySpend: 75, seats: 3 }],
      teamSize: 3, useCase: "mixed",
    })
    expect(result.results[0].recommendation.action).toBe("downgrade")
    expect(result.results[0].recommendation.monthlySavings).toBeGreaterThan(0)
  })

  test("recommends Anthropic API switch for high OpenAI API spend", () => {
    const result = runAudit({
      tools: [{ toolId: "openai_api", plan: "pay_as_you_go", monthlySpend: 500, seats: 1 }],
      teamSize: 5, useCase: "coding",
    })
    expect(result.results[0].recommendation.action).toBe("switch")
    expect(result.results[0].recommendation.credexOpportunity).toBe(true)
  })

  test("totalAnnualSavings equals totalMonthlySavings * 12", () => {
    const result = runAudit({
      tools: [
        { toolId: "cursor", plan: "business", monthlySpend: 120, seats: 3 },
        { toolId: "claude", plan: "team", monthlySpend: 75, seats: 3 },
      ],
      teamSize: 3, useCase: "coding",
    })
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  test("marks audit as optimal when no savings found", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1, useCase: "coding",
    })
    expect(result.isOptimal).toBe(true)
    expect(result.totalMonthlySavings).toBe(0)
  })
})