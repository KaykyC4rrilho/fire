export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: number
          name: string
          phone: string
          is_christian: boolean
          origin: 'conference' | 'participation' | 'manual'
          conference_slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          name: string
          phone: string
          is_christian: boolean
          origin: 'conference' | 'participation' | 'manual'
          conference_slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          name?: string
          phone?: string
          is_christian?: boolean
          origin?: 'conference' | 'participation' | 'manual'
          conference_slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
