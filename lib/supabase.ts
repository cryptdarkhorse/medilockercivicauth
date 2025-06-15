import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Document {
  id: string
  user_wallet_address: string
  file_name: string
  ipfs_cid: string
  created_at: string
}

export interface AccessGrant {
  id: string
  document_id: string
  access_code: string
  expires_at: string
  created_at: string
} 