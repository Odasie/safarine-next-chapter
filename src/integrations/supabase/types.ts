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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      image_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      images: {
        Row: {
          alt: string | null
          alt_en: string
          alt_fr: string
          category: string | null
          checksum: string | null
          comments: string | null
          description_en: string | null
          description_fr: string | null
          featured: boolean | null
          file_name: string | null
          file_path: string | null
          height: number | null
          id: string
          image_type: string | null
          keywords_en: string[] | null
          keywords_fr: string[] | null
          loading_strategy: string | null
          mime_type: string | null
          page_id: string | null
          position: number | null
          priority: string | null
          published: boolean | null
          responsive_variant: string | null
          size_bytes: number | null
          source_url: string | null
          src: string | null
          subcategory: string | null
          tags: string[] | null
          title: string | null
          title_en: string | null
          title_fr: string | null
          tour_id: string | null
          updated_at: string | null
          webp_size_kb: number | null
          width: number | null
        }
        Insert: {
          alt?: string | null
          alt_en: string
          alt_fr: string
          category?: string | null
          checksum?: string | null
          comments?: string | null
          description_en?: string | null
          description_fr?: string | null
          featured?: boolean | null
          file_name?: string | null
          file_path?: string | null
          height?: number | null
          id?: string
          image_type?: string | null
          keywords_en?: string[] | null
          keywords_fr?: string[] | null
          loading_strategy?: string | null
          mime_type?: string | null
          page_id?: string | null
          position?: number | null
          priority?: string | null
          published?: boolean | null
          responsive_variant?: string | null
          size_bytes?: number | null
          source_url?: string | null
          src?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          title_en?: string | null
          title_fr?: string | null
          tour_id?: string | null
          updated_at?: string | null
          webp_size_kb?: number | null
          width?: number | null
        }
        Update: {
          alt?: string | null
          alt_en?: string
          alt_fr?: string
          category?: string | null
          checksum?: string | null
          comments?: string | null
          description_en?: string | null
          description_fr?: string | null
          featured?: boolean | null
          file_name?: string | null
          file_path?: string | null
          height?: number | null
          id?: string
          image_type?: string | null
          keywords_en?: string[] | null
          keywords_fr?: string[] | null
          loading_strategy?: string | null
          mime_type?: string | null
          page_id?: string | null
          position?: number | null
          priority?: string | null
          published?: boolean | null
          responsive_variant?: string | null
          size_bytes?: number | null
          source_url?: string | null
          src?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          title_en?: string | null
          title_fr?: string | null
          tour_id?: string | null
          updated_at?: string | null
          webp_size_kb?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      page_categories: {
        Row: {
          category_id: string
          page_id: string
        }
        Insert: {
          category_id: string
          page_id: string
        }
        Update: {
          category_id?: string
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_categories_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content_md: string | null
          id: string
          inserted_at: string | null
          lang: string | null
          level: number | null
          meta_desc: string | null
          meta_title: string | null
          parent_url: string | null
          slug: string | null
          title: string | null
          url: string
        }
        Insert: {
          content_md?: string | null
          id?: string
          inserted_at?: string | null
          lang?: string | null
          level?: number | null
          meta_desc?: string | null
          meta_title?: string | null
          parent_url?: string | null
          slug?: string | null
          title?: string | null
          url: string
        }
        Update: {
          content_md?: string | null
          id?: string
          inserted_at?: string | null
          lang?: string | null
          level?: number | null
          meta_desc?: string | null
          meta_title?: string | null
          parent_url?: string | null
          slug?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          currency: string
          duration_days: number | null
          hero_image: string | null
          hero_image_id: string | null
          highlights: Json | null
          id: string
          image_count: number | null
          is_private: boolean | null
          itinerary: Json | null
          page_id: string | null
          price: number | null
          thumbnail_image_id: string | null
        }
        Insert: {
          currency?: string
          duration_days?: number | null
          hero_image?: string | null
          hero_image_id?: string | null
          highlights?: Json | null
          id?: string
          image_count?: number | null
          is_private?: boolean | null
          itinerary?: Json | null
          page_id?: string | null
          price?: number | null
          thumbnail_image_id?: string | null
        }
        Update: {
          currency?: string
          duration_days?: number | null
          hero_image?: string | null
          hero_image_id?: string | null
          highlights?: Json | null
          id?: string
          image_count?: number | null
          is_private?: boolean | null
          itinerary?: Json | null
          page_id?: string | null
          price?: number | null
          thumbnail_image_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_hero_image_id_fkey"
            columns: ["hero_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_thumbnail_image_id_fkey"
            columns: ["thumbnail_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_117_image_system: {
        Args: Record<PropertyKey, never>
        Returns: {
          actual: number
          check_name: string
          expected: number
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
