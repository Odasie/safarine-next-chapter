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
      admin_roles: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          department: string | null
          hired_date: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          hired_date?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          hired_date?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      b2b_favorites: {
        Row: {
          created_at: string | null
          id: string
          tour_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tour_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tour_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_favorites_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "b2b_users"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "b2b_users"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_users: {
        Row: {
          agency_type: string | null
          business_registration: string | null
          commission_rate: number | null
          company_name: string
          contact_person: string
          country: string | null
          created_at: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agency_type?: string | null
          business_registration?: string | null
          commission_rate?: number | null
          company_name: string
          contact_person: string
          country?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agency_type?: string | null
          business_registration?: string | null
          commission_rate?: number | null
          company_name?: string
          contact_person?: string
          country?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      contact_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          message_type: string | null
          name: string
          phone: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          message_type?: string | null
          name: string
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          message_type?: string | null
          name?: string
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          content: string
          created_at: string | null
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          content: string
          created_at?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          content?: string
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
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
          booking_method: string | null
          currency: string
          description_en: string | null
          description_fr: string | null
          destination: string | null
          difficulty_level: string | null
          duration_days: number | null
          duration_nights: number | null
          excluded_items: string[] | null
          gallery_images: number | null
          group_size_max: number | null
          group_size_min: number | null
          hero_image: string | null
          hero_image_id: string | null
          highlights: Json | null
          id: string
          image_count: number | null
          included_items: string[] | null
          is_private: boolean | null
          itinerary: Json | null
          languages: string[] | null
          page_id: string | null
          price: number | null
          slug_en: string | null
          slug_fr: string | null
          thumbnail_image_id: string | null
          title_en: string | null
          title_fr: string | null
          total_images: number | null
        }
        Insert: {
          booking_method?: string | null
          currency?: string
          description_en?: string | null
          description_fr?: string | null
          destination?: string | null
          difficulty_level?: string | null
          duration_days?: number | null
          duration_nights?: number | null
          excluded_items?: string[] | null
          gallery_images?: number | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image?: string | null
          hero_image_id?: string | null
          highlights?: Json | null
          id?: string
          image_count?: number | null
          included_items?: string[] | null
          is_private?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          page_id?: string | null
          price?: number | null
          slug_en?: string | null
          slug_fr?: string | null
          thumbnail_image_id?: string | null
          title_en?: string | null
          title_fr?: string | null
          total_images?: number | null
        }
        Update: {
          booking_method?: string | null
          currency?: string
          description_en?: string | null
          description_fr?: string | null
          destination?: string | null
          difficulty_level?: string | null
          duration_days?: number | null
          duration_nights?: number | null
          excluded_items?: string[] | null
          gallery_images?: number | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image?: string | null
          hero_image_id?: string | null
          highlights?: Json | null
          id?: string
          image_count?: number | null
          included_items?: string[] | null
          is_private?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          page_id?: string | null
          price?: number | null
          slug_en?: string | null
          slug_fr?: string | null
          thumbnail_image_id?: string | null
          title_en?: string | null
          title_fr?: string | null
          total_images?: number | null
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
      translations: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          key_name: string
          locale: string
          namespace: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          locale: string
          namespace?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          locale?: string
          namespace?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_tour_image: {
        Args: {
          alt_en_param: string
          alt_fr_param: string
          file_path_param: string
          image_type_param: string
          position_param?: number
          title_en_param?: string
          title_fr_param?: string
          tour_id_param: string
        }
        Returns: string
      }
      b2b_authenticate: {
        Args: { email_param: string; password_param: string }
        Returns: Json
      }
      b2b_authenticate_debug: {
        Args: { email_param: string; password_param: string }
        Returns: Json
      }
      b2b_secure_authenticate: {
        Args: { email_param: string; password_param: string }
        Returns: Json
      }
      create_new_tour: {
        Args: {
          currency_param?: string
          destination_param?: string
          duration_days_param?: number
          duration_nights_param?: number
          price_param?: number
          title_en_param: string
          title_fr_param: string
        }
        Returns: string
      }
      generate_secure_session_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_tour_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          count_value: number
          stat_name: string
          status: string
        }[]
      }
      send_b2b_registration_email: {
        Args: {
          company_name: string
          contact_person: string
          user_email: string
        }
        Returns: Json
      }
      test_rpc: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_117_image_system: {
        Args: Record<PropertyKey, never>
        Returns: {
          actual: number
          check_name: string
          expected: number
          status: string
        }[]
      }
      validate_tour_completeness: {
        Args: { tour_uuid: string }
        Returns: {
          message: string
          status: string
          validation_check: string
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
