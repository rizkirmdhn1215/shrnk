import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {
  try {
    const { linkId } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns this link
    const { data: link, error: linkError } = await supabase
      .from("short_links")
      .select("id")
      .eq("id", linkId)
      .eq("user_id", user.id)
      .single()

    if (linkError || !link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("link_id", linkId)
      .order("click_timestamp", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
