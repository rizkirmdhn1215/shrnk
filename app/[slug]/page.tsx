"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface LinkData {
  id: string
  original_url: string
  password_enabled: boolean
  expires_at: string | null
}

export default function RedirectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [link, setLink] = useState<LinkData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`/api/redirect/${slug}`)
        if (!response.ok) {
          setError("Link not found or has expired")
          setIsLoading(false)
          return
        }

        const data = await response.json()

        // Check if expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError("This link has expired")
          setIsLoading(false)
          return
        }

        setLink(data)

        if (data.password_enabled) {
          setNeedsPassword(true)
        } else {
          // Track and redirect
          trackAndRedirect(data)
        }

        setIsLoading(false)
      } catch (err) {
        setError("Error loading link")
        setIsLoading(false)
      }
    }

    fetchLink()
  }, [slug])

  const trackAndRedirect = async (linkData: LinkData) => {
    try {
      // Track analytics
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId: linkData.id,
          ipAddress: "N/A", // Can't get real IP on client
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      }).catch(() => {
        // Ignore tracking errors
      })

      // Redirect
      window.location.href = linkData.original_url
    } catch (err) {
      console.error("Error during redirect:", err)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link) return

    try {
      const response = await fetch(`/api/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId: link.id,
          password,
        }),
      })

      if (!response.ok) {
        setError("Incorrect password")
        return
      }

      // Correct password, now redirect
      trackAndRedirect(link)
    } catch (err) {
      setError("Error verifying password")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-background p-4">
        <Card className="max-w-sm w-full">
          <CardHeader>
            <CardTitle>Link Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (needsPassword) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-background p-4">
        <Card className="max-w-sm w-full">
          <CardHeader>
            <CardTitle>Password Protected</CardTitle>
            <CardDescription>This link is password protected. Please enter the password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
