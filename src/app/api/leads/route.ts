import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, auditId } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })
    // TODO: save to Supabase + send via Resend
    console.log("Lead captured:", { email, auditId })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}