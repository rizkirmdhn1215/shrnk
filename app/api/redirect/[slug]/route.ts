import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch link without requiring auth (public read)
    const { data: link, error } = await supabase
      .from("short_links")
      .select("id, original_url, password_enabled, expires_at")
      .eq("short_slug", slug)
      .single()

    if (error || !link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error("Error fetching redirect:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
