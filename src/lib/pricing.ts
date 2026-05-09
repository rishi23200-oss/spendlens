// src/lib/pricing.ts
// All pricing verified May 2025 — see PRICING_DATA.md for sources

import { ToolId, UseCase } from "@/types"

export interface PlanDefinition {
  id: string
  label: string
  pricePerSeat: number // USD/month/seat
  minSeats?: number
  maxSeats?: number
  bestFor: UseCase[]
  features: string[]
}

export interface ToolDefinition {
  id: ToolId
  name: string
  category: "coding" | "general" | "api"
  plans: PlanDefinition[]
  alternativeTo?: ToolId[]
}

export const TOOLS: Record<ToolId, ToolDefinition> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: [
      { id: "hobby", label: "Hobby", pricePerSeat: 0, bestFor: ["coding"], features: ["2000 completions/mo", "50 slow requests"] },
      { id: "pro", label: "Pro", pricePerSeat: 20, bestFor: ["coding"], features: ["Unlimited completions", "500 fast requests", "10 o1 requests"] },
      { id: "business", label: "Business", pricePerSeat: 40, bestFor: ["coding"], features: ["Everything Pro", "Centralized billing", "SSO", "Privacy mode"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 100, bestFor: ["coding"], features: ["Custom contracts", "SLAs", "Custom models"] },
    ],
  },
  github_copilot: {
    id: "github_copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { id: "individual", label: "Individual", pricePerSeat: 10, bestFor: ["coding"], features: ["Code completions", "Chat", "CLI"] },
      { id: "business", label: "Business", pricePerSeat: 19, bestFor: ["coding"], features: ["Everything Individual", "Org policies", "Audit logs"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 39, bestFor: ["coding"], features: ["Everything Business", "Personalization", "Fine-tuning"] },
    ],
  },
  claude: {
    id: "claude",
    name: "Claude",
    category: "general",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, bestFor: ["writing", "research", "mixed"], features: ["Limited messages", "Claude Sonnet"] },
      { id: "pro", label: "Pro", pricePerSeat: 20, bestFor: ["writing", "research", "mixed"], features: ["5x more usage", "Claude Opus/Sonnet", "Projects"] },
      { id: "max", label: "Max", pricePerSeat: 100, bestFor: ["writing", "research", "data", "mixed"], features: ["20x Pro usage", "Extended thinking", "Priority access"] },
      { id: "team", label: "Team", pricePerSeat: 25, minSeats: 5, bestFor: ["writing", "mixed"], features: ["Pro features", "Shared projects", "Admin console"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, bestFor: ["mixed"], features: ["Unlimited usage", "SSO/SAML", "Custom retention"] },
    ],
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    category: "general",
    plans: [
      { id: "plus", label: "Plus", pricePerSeat: 20, bestFor: ["writing", "research", "mixed"], features: ["GPT-4o", "DALL-E", "Advanced data analysis"] },
      { id: "team", label: "Team", pricePerSeat: 25, minSeats: 2, bestFor: ["writing", "mixed"], features: ["Everything Plus", "Workspace", "Admin"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, bestFor: ["mixed"], features: ["Unlimited GPT-4", "SSO", "Custom retention"] },
    ],
  },
  anthropic_api: {
    id: "anthropic_api",
    name: "Anthropic API",
    category: "api",
    plans: [
      { id: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: 0, bestFor: ["coding", "data", "mixed"], features: ["Claude 3.5 Sonnet: $3/MTok in", "Claude 3 Opus: $15/MTok in"] },
    ],
  },
  openai_api: {
    id: "openai_api",
    name: "OpenAI API",
    category: "api",
    plans: [
      { id: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: 0, bestFor: ["coding", "data", "mixed"], features: ["GPT-4o: $5/MTok in", "GPT-4o-mini: $0.15/MTok in"] },
    ],
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    category: "general",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, bestFor: ["writing", "research"], features: ["Gemini 1.5 Flash", "Limited Gemini 1.5 Pro"] },
      { id: "advanced", label: "Advanced (Google One AI)", pricePerSeat: 19.99, bestFor: ["writing", "research", "mixed"], features: ["Gemini Ultra", "1TB storage", "Google Workspace"] },
      { id: "business", label: "Business (Workspace)", pricePerSeat: 24, bestFor: ["writing", "mixed"], features: ["Gemini for all apps", "Admin controls"] },
    ],
  },
  windsurf: {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, bestFor: ["coding"], features: ["5 flows/day", "Basic completions"] },
      { id: "pro", label: "Pro", pricePerSeat: 15, bestFor: ["coding"], features: ["Unlimited flows", "Fast model", "Priority"] },
      { id: "teams", label: "Teams", pricePerSeat: 35, bestFor: ["coding"], features: ["Everything Pro", "Team management", "Audit logs"] },
    ],
  },
}

export function getToolById(id: ToolId): ToolDefinition {
  return TOOLS[id]
}

export function getPlanById(toolId: ToolId, planId: string): PlanDefinition | undefined {
  return TOOLS[toolId]?.plans.find((p) => p.id === planId)
}