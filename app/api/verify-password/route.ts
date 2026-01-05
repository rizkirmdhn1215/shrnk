import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { linkId, password } = await request.json()

    const supabase = await createClient()

    const { data: link, error } = await supabase.from("short_links").select("password_hash").eq("id", linkId).single()

    if (error || !link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    if (!link.password_hash) {
      return NextResponse.json({ error: "Link not password protected" }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, link.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
