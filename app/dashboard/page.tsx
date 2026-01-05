"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CreateLinkDialog } from "@/components/create-link-dialog"
import { LinksTable } from "@/components/links-table"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ShortLink } from "@/types"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect("/auth/login")
      }
      setUser(user)
      fetchLinks()
    }

    checkAuth()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      if (!response.ok) throw new Error("Failed to fetch links")
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error("Error fetching links:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-svh">Loading...</div>
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/shrnk-logo.png" alt="Shrnk Logo" width={40} height={40} className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Shrnk Dashboard</h1>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Your Links</h2>
            <p className="text-sm text-muted-foreground">Create and manage your short links</p>
          </div>
          <CreateLinkDialog onSuccess={fetchLinks} />
        </div>

        <LinksTable links={links} onDelete={fetchLinks} />
      </div>
    </div>
  )
}
