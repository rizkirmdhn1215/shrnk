import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { linkId, ipAddress, userAgent, referrer } = await request.json()

    if (!linkId) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Parse device info from user agent
    const isBot = /bot|crawler|spider|scraper/i.test(userAgent || "")
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent || "")
    const deviceType = isMobile ? "mobile" : "desktop"

    // Parse browser
    let browser = "unknown"
    if (/chrome/i.test(userAgent || "")) browser = "Chrome"
    else if (/firefox/i.test(userAgent || "")) browser = "Firefox"
    else if (/safari/i.test(userAgent || "")) browser = "Safari"
    else if (/edge/i.test(userAgent || "")) browser = "Edge"

    if (!isBot) {
      const { error } = await supabase.from("analytics").insert({
        link_id: linkId,
        ip_address: ipAddress,
        device_type: deviceType,
        browser,
        referrer: referrer || null,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 })
  }
}
