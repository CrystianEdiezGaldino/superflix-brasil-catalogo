export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      watch_history: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          media_type: 'movie' | 'tv'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          media_type: 'movie' | 'tv'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          media_type?: 'movie' | 'tv'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          media_id: number
          media_type: string
          title: string
          poster_path: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_id: number
          media_type: string
          title: string
          poster_path?: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          media_id?: number
          media_type?: string
          title?: string
          poster_path?: string
          added_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'closed'
          priority: 'low' | 'medium' | 'high'
          category: 'content' | 'subscription' | 'technical' | 'other'
          admin_response: string | null
          admin_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          category: 'content' | 'subscription' | 'technical' | 'other'
          admin_response?: string | null
          admin_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          category?: 'content' | 'subscription' | 'technical' | 'other'
          admin_response?: string | null
          admin_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          avatar_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'trialing' | 'canceled' | 'inactive'
          plan_type: string
          current_period_start: string | null
          current_period_end: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: 'active' | 'trialing' | 'canceled' | 'inactive'
          plan_type: string
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'trialing' | 'canceled' | 'inactive'
          plan_type?: string
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      temp_access: {
        Row: {
          id: string
          user_id: string
          is_active: boolean
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_active?: boolean
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_active?: boolean
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 