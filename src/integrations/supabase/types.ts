export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          parent_id: string | null
          post_slug: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          post_slug: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          post_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string
          content_html: string
          created_at: string
          date_label: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean
          slug: string
          sort_order: number
          subtitle: string | null
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content_html?: string
          created_at?: string
          date_label: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          subtitle?: string | null
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content_html?: string
          created_at?: string
          date_label?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          subtitle?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_reaction_counts: {
        Row: {
          comment_id: string
          count: number
          emoji: string
          id: string
          updated_at: string
        }
        Insert: {
          comment_id: string
          count?: number
          emoji: string
          id?: string
          updated_at?: string
        }
        Update: {
          comment_id?: string
          count?: number
          emoji?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reaction_counts_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      lectures: {
        Row: {
          audience: string | null
          badges: string[]
          created_at: string
          description: string | null
          id: string
          published: boolean
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string | null
          badges?: string[]
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string | null
          badges?: string[]
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      podcast_episodes: {
        Row: {
          created_at: string
          date_label: string | null
          description: string | null
          drive_url: string | null
          duration: string | null
          id: string
          num: string
          published: boolean
          sort_order: number
          spotify_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          drive_url?: string | null
          duration?: string | null
          id?: string
          num: string
          published?: boolean
          sort_order?: number
          spotify_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          drive_url?: string | null
          duration?: string | null
          id?: string
          num?: string
          published?: boolean
          sort_order?: number
          spotify_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          buttons: Json
          created_at: string
          id: string
          paragraphs: Json
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          buttons?: Json
          created_at?: string
          id?: string
          paragraphs?: Json
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          buttons?: Json
          created_at?: string
          id?: string
          paragraphs?: Json
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quick_reaction_counts: {
        Row: {
          count: number
          id: string
          post_slug: string
          reaction: string
          updated_at: string
        }
        Insert: {
          count?: number
          id?: string
          post_slug: string
          reaction: string
          updated_at?: string
        }
        Update: {
          count?: number
          id?: string
          post_slug?: string
          reaction?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _is_allowed_comment_emoji: { Args: { _e: string }; Returns: boolean }
      claim_admin_if_none: { Args: never; Returns: boolean }
      decrement_comment_reaction: {
        Args: { _comment_id: string; _emoji: string }
        Returns: number
      }
      decrement_quick_reaction: {
        Args: { _post_slug: string; _reaction: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_comment_reaction: {
        Args: { _comment_id: string; _emoji: string }
        Returns: number
      }
      increment_quick_reaction: {
        Args: { _post_slug: string; _reaction: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
