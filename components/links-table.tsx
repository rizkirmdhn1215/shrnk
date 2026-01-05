"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { ShortLink } from "@/types"
import Link from "next/link"

export function LinksTable({ links, onDelete }: { links: ShortLink[]; onDelete: () => void }) {
  const { toast } = useToast()

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
    toast({ title: "Copied", description: "Link copied to clipboard" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    try {
      const response = await fetch(`/api/links/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      toast({ title: "Deleted", description: "Link deleted successfully" })
      onDelete()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete link",
        variant: "destructive",
      })
    }
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No links yet. Create your first link to get started!</div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short Link</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-mono text-sm">
                <code className="bg-muted px-2 py-1 rounded">/{link.short_slug}</code>
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm">{link.original_url}</TableCell>
              <TableCell className="text-sm">{new Date(link.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(link.short_slug)}>
                  Copy
                </Button>
                <Link href={`/dashboard/${link.id}`}>
                  <Button variant="outline" size="sm">
                    Analytics
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
