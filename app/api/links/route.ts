import { createClient } from "@/lib/supabase/server"
import { generateShortSlug, validateSlug } from "@/lib/utils/slug"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { originalUrl, customSlug, expiresAt, password } = await request.json()

    if (!originalUrl) {
      return NextResponse.json({ error: "Original URL is required" }, { status: 400 })
    }

    let slug = customSlug
    if (customSlug) {
      if (!validateSlug(customSlug)) {
        return NextResponse.json(
          { error: "Custom slug must be 3-20 characters, alphanumeric with - and _" },
          { status: 400 },
        )
      }
      const { data: existing } = await supabase
        .from("short_links")
        .select("id")
        .eq("short_slug", customSlug)
        .maybeSingle()
      if (existing) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 })
      }
    } else {
      // Generate unique slug
      let isUnique = false
      while (!isUnique) {
        slug = generateShortSlug()
        const { data: existing } = await supabase.from("short_links").select("id").eq("short_slug", slug).maybeSingle()
        if (!existing) isUnique = true
      }
    }

    // Hash password if provided
    let passwordHash = null
    if (password) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    const { data, error } = await supabase.from("short_links").insert({
      user_id: user.id,
      original_url: originalUrl,
      short_slug: slug,
      custom_slug: customSlug || null,
      expires_at: expiresAt || null,
      password_hash: passwordHash,
      password_enabled: !!password,
    })

    if (error) throw error

    return NextResponse.json({ slug, originalUrl }, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("short_links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}
