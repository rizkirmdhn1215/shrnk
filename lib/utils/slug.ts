export function generateShortSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let slug = ""
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return slug
}

export function validateSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(slug)
}
