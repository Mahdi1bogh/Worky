export type User = {
    avatar_url: string
    channels: string[] | null
    created_at: string | null
    email: string
    id: string
    is_away: boolean
    name: string | null
    phone: string | null
    type: string | null
    workspaces: string[] | null
}
export type workspaces = {
    channels: string[] | null
    created_at: string
    id: string
    image_url: string | null
    invite_code: string 
    members: string[] | null
    name: string | null
    regulators: string[] | null
    slug: string
    super_admin: string
  }