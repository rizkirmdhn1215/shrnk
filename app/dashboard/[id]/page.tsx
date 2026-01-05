"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Analytics {
  id: string
  country?: string
  device_type?: string
  browser?: string
  click_timestamp: string
}

interface ShortLink {
  id: string
  short_slug: string
  original_url: string
  created_at: string
}

export default function LinkDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [link, setLink] = useState<ShortLink | null>(null)
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      fetchLinkDetails()
      fetchAnalytics()
    }

    checkAuth()
  }, [id])

  const fetchLinkDetails = async () => {
    try {
      const response = await fetch("/api/links")
      if (!response.ok) throw new Error("Failed to fetch links")
      const links = await response.json()
      const currentLink = links.find((l: ShortLink) => l.id === id)
      setLink(currentLink)
    } catch (error) {
      console.error("Error fetching link:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${id}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !link) {
    return <div className="flex items-center justify-center min-h-svh">Loading...</div>
  }

  // Calculate analytics data
  const totalClicks = analytics.length
  const deviceData = analytics.reduce(
    (acc, a) => {
      const device = a.device_type || "unknown"
      const existing = acc.find((d) => d.name === device)
      if (existing) {
        existing.value++
      } else {
        acc.push({ name: device, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const browserData = analytics.reduce(
    (acc, a) => {
      const browser = a.browser || "unknown"
      const existing = acc.find((b) => b.name === browser)
      if (existing) {
        existing.value++
      } else {
        acc.push({ name: browser, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const clicksByDay = analytics.reduce(
    (acc, a) => {
      const day = new Date(a.click_timestamp).toLocaleDateString()
      const existing = acc.find((d) => d.date === day)
      if (existing) {
        existing.clicks++
      } else {
        acc.push({ date: day, clicks: 1 })
      }
      return acc
    },
    [] as Array<{ date: string; clicks: number }>,
  )

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="min-h-svh bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Link Analytics</h1>
          <p className="text-sm text-muted-foreground">{link.short_slug}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Link Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Short Link</p>
              <code className="bg-muted px-2 py-1 rounded text-sm">{`${window.location.origin}/${link.short_slug}`}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Original URL</p>
              <p className="text-sm break-all">{link.original_url}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">{new Date(link.created_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Total Clicks: {totalClicks}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {clicksByDay.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Clicks Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clicksByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {deviceData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">By Device</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {browserData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">By Browser</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {browserData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
