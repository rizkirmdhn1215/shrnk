export interface ShortLink {
  id: string
  user_id: string
  original_url: string
  short_slug: string
  custom_slug: string | null
  expires_at: string | null
  password_enabled: boolean
  created_at: string
  updated_at: string
}
