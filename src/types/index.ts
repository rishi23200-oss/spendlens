// src/types/index.ts

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed"

export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf"

export interface ToolEntry {
  toolId: ToolId
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface Recommendation {
  action: "downgrade" | "switch" | "credits" | "optimal" | "right_plan"
  targetTool?: string
  targetPlan?: string
  reason: string
  monthlySavings: number
  annualSavings: number
  credexOpportunity?: boolean
}

export interface ToolAuditResult {
  toolId: ToolId
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendation: Recommendation
}

export interface AuditResult {
  id: string
  input: AuditInput
  results: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary?: string
  isOptimal: boolean
  createdAt: string
}

export interface LeadCapture {
  email: string
  companyName?: string
  role?: string
  teamSize?: number
  auditId: string
}