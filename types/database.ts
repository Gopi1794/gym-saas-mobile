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
      access_devices: {
        Row: {
          created_at: string
          device_uid: string
          gym_id: string
          id: string
          last_seen_at: string | null
          name: string
          status: string
          token_hash: string
        }
        Insert: {
          created_at?: string
          device_uid: string
          gym_id: string
          id?: string
          last_seen_at?: string | null
          name: string
          status?: string
          token_hash: string
        }
        Update: {
          created_at?: string
          device_uid?: string
          gym_id?: string
          id?: string
          last_seen_at?: string | null
          name?: string
          status?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_devices_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      access_events: {
        Row: {
          created_at: string
          credential_hash: string | null
          device_id: string | null
          gym_id: string
          id: string
          member_id: string | null
          reason: string | null
          result: string
        }
        Insert: {
          created_at?: string
          credential_hash?: string | null
          device_id?: string | null
          gym_id: string
          id?: string
          member_id?: string | null
          reason?: string | null
          result: string
        }
        Update: {
          created_at?: string
          credential_hash?: string | null
          device_id?: string | null
          gym_id?: string
          id?: string
          member_id?: string | null
          reason?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "access_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_events_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_events_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_events_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          condition_target: string | null
          condition_type: string
          condition_value: number
          created_at: string | null
          description: string | null
          gym_id: string
          icon: string | null
          id: string
          name: string
          xp_reward: number
        }
        Insert: {
          condition_target?: string | null
          condition_type: string
          condition_value: number
          created_at?: string | null
          description?: string | null
          gym_id: string
          icon?: string | null
          id?: string
          name: string
          xp_reward?: number
        }
        Update: {
          condition_target?: string | null
          condition_type?: string
          condition_value?: number
          created_at?: string | null
          description?: string | null
          gym_id?: string
          icon?: string | null
          id?: string
          name?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "achievements_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          gym_id: string
          id: string
          input_tokens: number | null
          output_tokens: number | null
          plan_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          gym_id: string
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          plan_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          gym_id?: string
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          plan_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_audit_logs_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audit_logs_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          agent: string
          content: string
          created_at: string
          gym_id: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          agent?: string
          content: string
          created_at?: string
          gym_id?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          agent?: string
          content?: string
          created_at?: string
          gym_id?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_logs_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          gym_id: string
          id: string
          method: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          gym_id: string
          id?: string
          method?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          gym_id?: string
          id?: string
          method?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_plans: {
        Row: {
          active: boolean | null
          assigned_at: string | null
          assigned_by: string | null
          client_id: string
          gym_id: string
          id: string
          plan_id: string
        }
        Insert: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          client_id: string
          gym_id: string
          id?: string
          plan_id: string
        }
        Update: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          client_id?: string
          gym_id?: string
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_plans_client_gym_fkey"
            columns: ["client_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "client_plans_client_gym_fkey"
            columns: ["client_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "client_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_plans_plan_gym_fkey"
            columns: ["plan_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "client_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_favorites: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_favorites_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_maxes: {
        Row: {
          exercise_id: string
          id: string
          recorded_at: string | null
          user_id: string
          weight_kg: number
        }
        Insert: {
          exercise_id: string
          id?: string
          recorded_at?: string | null
          user_id: string
          weight_kg: number
        }
        Update: {
          exercise_id?: string
          id?: string
          recorded_at?: string | null
          user_id?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_maxes_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_maxes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_maxes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          image_url: string | null
          is_timed: boolean
          muscle_groups: string[] | null
          name: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          is_timed?: boolean
          muscle_groups?: string[] | null
          name: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          is_timed?: boolean
          muscle_groups?: string[] | null
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      foods: {
        Row: {
          calcium: number | null
          calories: number
          carbs: number
          category: string | null
          cholesterol: number | null
          created_at: string | null
          data_quality: string
          fat: number
          fiber: number | null
          grams_per_unit: number | null
          gym_id: string | null
          household_unit: string | null
          id: string
          iron: number | null
          magnesium: number | null
          monounsaturated_fat: number | null
          name: string
          niacin: number | null
          omega_3: number | null
          omega_6: number | null
          phosphorus: number | null
          polyunsaturated_fat: number | null
          potassium: number | null
          protein: number
          riboflavin: number | null
          saturated_fat: number | null
          scientific_name: string | null
          sodium: number | null
          source: string
          source_code: string | null
          source_updated_at: string | null
          source_url: string | null
          subcategory: string | null
          sugars: number | null
          thiamin: number | null
          trans_fat: number | null
          vitamin_b12: number | null
          vitamin_c: number | null
          zinc: number | null
        }
        Insert: {
          calcium?: number | null
          calories?: number
          carbs?: number
          category?: string | null
          cholesterol?: number | null
          created_at?: string | null
          data_quality?: string
          fat?: number
          fiber?: number | null
          grams_per_unit?: number | null
          gym_id?: string | null
          household_unit?: string | null
          id?: string
          iron?: number | null
          magnesium?: number | null
          monounsaturated_fat?: number | null
          name: string
          niacin?: number | null
          omega_3?: number | null
          omega_6?: number | null
          phosphorus?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein?: number
          riboflavin?: number | null
          saturated_fat?: number | null
          scientific_name?: string | null
          sodium?: number | null
          source?: string
          source_code?: string | null
          source_updated_at?: string | null
          source_url?: string | null
          subcategory?: string | null
          sugars?: number | null
          thiamin?: number | null
          trans_fat?: number | null
          vitamin_b12?: number | null
          vitamin_c?: number | null
          zinc?: number | null
        }
        Update: {
          calcium?: number | null
          calories?: number
          carbs?: number
          category?: string | null
          cholesterol?: number | null
          created_at?: string | null
          data_quality?: string
          fat?: number
          fiber?: number | null
          grams_per_unit?: number | null
          gym_id?: string | null
          household_unit?: string | null
          id?: string
          iron?: number | null
          magnesium?: number | null
          monounsaturated_fat?: number | null
          name?: string
          niacin?: number | null
          omega_3?: number | null
          omega_6?: number | null
          phosphorus?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein?: number
          riboflavin?: number | null
          saturated_fat?: number | null
          scientific_name?: string | null
          sodium?: number | null
          source?: string
          source_code?: string | null
          source_updated_at?: string | null
          source_url?: string | null
          subcategory?: string | null
          sugars?: number | null
          thiamin?: number | null
          trans_fat?: number | null
          vitamin_b12?: number | null
          vitamin_c?: number | null
          zinc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "foods_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_nutrition_defaults: {
        Row: {
          definicion_pct: number
          definicion_protein: number
          gym_id: string
          mantenimiento_protein: number
          perdida_moderada_pct: number
          perdida_moderada_protein: number
          recomposicion_protein: number
          rendimiento_pct: number
          rendimiento_protein: number
          updated_at: string
          volumen_pct: number
          volumen_protein: number
        }
        Insert: {
          definicion_pct?: number
          definicion_protein?: number
          gym_id: string
          mantenimiento_protein?: number
          perdida_moderada_pct?: number
          perdida_moderada_protein?: number
          recomposicion_protein?: number
          rendimiento_pct?: number
          rendimiento_protein?: number
          updated_at?: string
          volumen_pct?: number
          volumen_protein?: number
        }
        Update: {
          definicion_pct?: number
          definicion_protein?: number
          gym_id?: string
          mantenimiento_protein?: number
          perdida_moderada_pct?: number
          perdida_moderada_protein?: number
          recomposicion_protein?: number
          rendimiento_pct?: number
          rendimiento_protein?: number
          updated_at?: string
          volumen_pct?: number
          volumen_protein?: number
        }
        Relationships: [
          {
            foreignKeyName: "gym_nutrition_defaults_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: true
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          invite_code: string
          logo_url: string | null
          mp_vault_secret_id: string | null
          mp_webhook_secret_vault_id: string | null
          name: string
          owner_id: string | null
          slug: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          invite_code?: string
          logo_url?: string | null
          mp_vault_secret_id?: string | null
          mp_webhook_secret_vault_id?: string | null
          name: string
          owner_id?: string | null
          slug: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          invite_code?: string
          logo_url?: string | null
          mp_vault_secret_id?: string | null
          mp_webhook_secret_vault_id?: string | null
          name?: string
          owner_id?: string | null
          slug?: string
        }
        Relationships: []
      }
      machine_exercises: {
        Row: {
          exercise_id: string
          id: string
          machine_id: string
        }
        Insert: {
          exercise_id: string
          id?: string
          machine_id: string
        }
        Update: {
          exercise_id?: string
          id?: string
          machine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_exercises_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          created_at: string
          description: string | null
          gym_id: string
          id: string
          image_url: string | null
          name: string
          qr_identifier: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gym_id: string
          id?: string
          image_url?: string | null
          name: string
          qr_identifier?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gym_id?: string
          id?: string
          image_url?: string | null
          name?: string
          qr_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "machines_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      member_access_credentials: {
        Row: {
          created_at: string
          credential_hash: string
          gym_id: string
          id: string
          kind: string
          label: string | null
          member_id: string
          status: string
        }
        Insert: {
          created_at?: string
          credential_hash: string
          gym_id: string
          id?: string
          kind?: string
          label?: string | null
          member_id: string
          status?: string
        }
        Update: {
          created_at?: string
          credential_hash?: string
          gym_id?: string
          id?: string
          kind?: string
          label?: string | null
          member_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_access_credentials_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_access_credentials_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_access_credentials_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          created_at: string
          duration_days: number
          features: string[]
          gym_id: string
          id: string
          is_active: boolean
          label: string
          price: number
          type: string
        }
        Insert: {
          created_at?: string
          duration_days?: number
          features?: string[]
          gym_id: string
          id?: string
          is_active?: boolean
          label?: string
          price?: number
          type: string
        }
        Update: {
          created_at?: string
          duration_days?: number
          features?: string[]
          gym_id?: string
          id?: string
          is_active?: boolean
          label?: string
          price?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          contacted_at: string | null
          created_at: string
          dedup_key: string | null
          gym_id: string | null
          id: string
          metadata: Json
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          contacted_at?: string | null
          created_at?: string
          dedup_key?: string | null
          gym_id?: string | null
          id?: string
          metadata?: Json
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          contacted_at?: string | null
          created_at?: string
          dedup_key?: string | null
          gym_id?: string | null
          id?: string
          metadata?: Json
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_food_favorites: {
        Row: {
          created_at: string | null
          food_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_food_favorites_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_log_items: {
        Row: {
          actual_grams: number
          created_at: string | null
          food_id: string
          id: string
          log_id: string
        }
        Insert: {
          actual_grams: number
          created_at?: string | null
          food_id: string
          id?: string
          log_id: string
        }
        Update: {
          actual_grams?: number
          created_at?: string | null
          food_id?: string
          id?: string
          log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_log_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_log_items_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "nutrition_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_logs: {
        Row: {
          id: string
          log_date: string
          logged_at: string | null
          meal_id: string
          member_id: string
        }
        Insert: {
          id?: string
          log_date?: string
          logged_at?: string | null
          meal_id: string
          member_id: string
        }
        Update: {
          id?: string
          log_date?: string
          logged_at?: string | null
          meal_id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_logs_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_meal_items: {
        Row: {
          food_id: string
          id: string
          meal_id: string
          quantity_grams: number
        }
        Insert: {
          food_id: string
          id?: string
          meal_id: string
          quantity_grams?: number
        }
        Update: {
          food_id?: string
          id?: string
          meal_id?: string
          quantity_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_meal_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_meals: {
        Row: {
          id: string
          name: string
          order_index: number
          plan_id: string
          time_label: string | null
        }
        Insert: {
          id?: string
          name: string
          order_index?: number
          plan_id: string
          time_label?: string | null
        }
        Update: {
          id?: string
          name?: string
          order_index?: number
          plan_id?: string
          time_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_meals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plans: {
        Row: {
          calorie_adjustment_pct: number | null
          created_at: string | null
          created_by: string | null
          fat_per_kg: number | null
          goal: string | null
          gym_id: string
          id: string
          is_active: boolean | null
          member_id: string
          name: string
          needs_review: boolean
          needs_review_reason: string | null
          notes: string | null
          protein_per_kg: number | null
          target_calories: number | null
          target_carbs: number | null
          target_fat: number | null
          target_protein: number | null
        }
        Insert: {
          calorie_adjustment_pct?: number | null
          created_at?: string | null
          created_by?: string | null
          fat_per_kg?: number | null
          goal?: string | null
          gym_id: string
          id?: string
          is_active?: boolean | null
          member_id: string
          name: string
          needs_review?: boolean
          needs_review_reason?: string | null
          notes?: string | null
          protein_per_kg?: number | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          target_protein?: number | null
        }
        Update: {
          calorie_adjustment_pct?: number | null
          created_at?: string | null
          created_by?: string | null
          fat_per_kg?: number | null
          goal?: string | null
          gym_id?: string
          id?: string
          is_active?: boolean | null
          member_id?: string
          name?: string
          needs_review?: boolean
          needs_review_reason?: string | null
          notes?: string | null
          protein_per_kg?: number | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          target_protein?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_checkouts: {
        Row: {
          created_at: string
          expires_at: string
          external_reference: string
          gym_id: string
          id: string
          kind: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          external_reference: string
          gym_id: string
          id?: string
          kind: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          external_reference?: string
          gym_id?: string
          id?: string
          kind?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_checkouts_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gym_id: string
          id: string
          member_id: string
          method: string
          mp_payment_id: string | null
          notes: string | null
          recorded_by: string | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          gym_id: string
          id?: string
          member_id: string
          method?: string
          mp_payment_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          gym_id?: string
          id?: string
          member_id?: string
          method?: string
          mp_payment_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_gym_fkey"
            columns: ["recorded_by", "gym_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "payments_recorded_by_gym_fkey"
            columns: ["recorded_by", "gym_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id", "gym_id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          gym_id: string
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          gym_id: string
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          gym_id?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_order_items: {
        Row: {
          created_at: string
          id: string
          line_margin: number
          line_total: number
          order_id: string
          product_id: string
          quantity: number
          unit_cost: number
          unit_price: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_margin: number
          line_total: number
          order_id: string
          product_id: string
          quantity: number
          unit_cost: number
          unit_price: number
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          line_margin?: number
          line_total?: number
          order_id?: string
          product_id?: string
          quantity?: number
          unit_cost?: number
          unit_price?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "product_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_orders: {
        Row: {
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          created_by: string
          gym_id: string
          id: string
          member_id: string | null
          order_type: string
          paid_amount: number | null
          paid_at: string | null
          paid_by: string | null
          payment_method: string | null
          payment_reference: string | null
          reserved_until: string | null
          status: string
          subtotal_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          created_by: string
          gym_id: string
          id?: string
          member_id?: string | null
          order_type: string
          paid_amount?: number | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          reserved_until?: string | null
          status: string
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          created_by?: string
          gym_id?: string
          id?: string
          member_id?: string | null
          order_type?: string
          paid_amount?: number | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          reserved_until?: string | null
          status?: string
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_orders_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_orders_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_promotions: {
        Row: {
          created_at: string
          created_by: string | null
          cta_label: string | null
          description: string | null
          ends_at: string | null
          gym_id: string
          id: string
          image_url: string | null
          is_active: boolean
          product_id: string
          public_price: number
          sort_order: number
          starts_at: string | null
          title: string
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          description?: string | null
          ends_at?: string | null
          gym_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          product_id: string
          public_price: number
          sort_order?: number
          starts_at?: string | null
          title: string
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          description?: string | null
          ends_at?: string | null
          gym_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          product_id?: string
          public_price?: number
          sort_order?: number
          starts_at?: string | null
          title?: string
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promotions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promotions_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sales: {
        Row: {
          created_at: string
          gym_id: string
          id: string
          member_id: string | null
          method: string
          quantity: number
          recorded_by: string
          total_amount: number
          unit_cost: number
          unit_price: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          gym_id: string
          id?: string
          member_id?: string | null
          method: string
          quantity: number
          recorded_by: string
          total_amount: number
          unit_cost: number
          unit_price: number
          variant_id: string
        }
        Update: {
          created_at?: string
          gym_id?: string
          id?: string
          member_id?: string | null
          method?: string
          quantity?: number
          recorded_by?: string
          total_amount?: number
          unit_cost?: number
          unit_price?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          gym_id: string
          id: string
          movement_type: string
          order_id: string | null
          order_item_id: string | null
          product_id: string
          quantity_delta: number
          reason: string | null
          stock_after: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gym_id: string
          id?: string
          movement_type: string
          order_id?: string | null
          order_item_id?: string | null
          product_id: string
          quantity_delta: number
          reason?: string | null
          stock_after: number
          variant_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gym_id?: string
          id?: string
          movement_type?: string
          order_id?: string | null
          order_item_id?: string | null
          product_id?: string
          quantity_delta?: number
          reason?: string | null
          stock_after?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "product_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "product_order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          cost_price: number | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          price: number | null
          product_id: string
          sku: string | null
          stock: number
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          product_id: string
          sku?: string | null
          stock?: number
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          product_id?: string
          sku?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_cost: number
          base_price: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          gym_id: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
        }
        Insert: {
          base_cost: number
          base_price: number
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
        }
        Update: {
          base_cost?: number
          base_price?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          can_collect_payments: boolean
          created_at: string | null
          daily_activity: string | null
          date_of_birth: string | null
          emergency_name: string | null
          emergency_phone: string | null
          full_name: string | null
          gender: string | null
          goal: string | null
          gym_id: string | null
          height_cm: number | null
          id: string
          medical_conditions: string | null
          membership_expires_at: string | null
          membership_type: string | null
          metabolic_reference: string | null
          notification_hour: number
          onboarding_seen: boolean
          phone: string | null
          qr_code: string | null
          role: string
          total_xp: number
          trainer_id: string | null
          training_frequency: string | null
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          can_collect_payments?: boolean
          created_at?: string | null
          daily_activity?: string | null
          date_of_birth?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          gym_id?: string | null
          height_cm?: number | null
          id: string
          medical_conditions?: string | null
          membership_expires_at?: string | null
          membership_type?: string | null
          metabolic_reference?: string | null
          notification_hour?: number
          onboarding_seen?: boolean
          phone?: string | null
          qr_code?: string | null
          role?: string
          total_xp?: number
          trainer_id?: string | null
          training_frequency?: string | null
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          can_collect_payments?: boolean
          created_at?: string | null
          daily_activity?: string | null
          date_of_birth?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          gym_id?: string | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string | null
          membership_expires_at?: string | null
          membership_type?: string | null
          metabolic_reference?: string | null
          notification_hour?: number
          onboarding_seen?: boolean
          phone?: string | null
          qr_code?: string | null
          role?: string
          total_xp?: number
          trainer_id?: string | null
          training_frequency?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_log_entries: {
        Row: {
          calories: number
          carbs_g: number
          created_at: string | null
          description: string
          fat_g: number
          gym_id: string | null
          id: string
          logged_at: string
          meal_id: string | null
          photo_url: string | null
          protein_g: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs_g?: number
          created_at?: string | null
          description: string
          fat_g?: number
          gym_id?: string | null
          id?: string
          logged_at?: string
          meal_id?: string | null
          photo_url?: string | null
          protein_g?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs_g?: number
          created_at?: string | null
          description?: string
          fat_g?: number
          gym_id?: string | null
          id?: string
          logged_at?: string
          meal_id?: string | null
          photo_url?: string | null
          protein_g?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_log_entries_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_log_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_log_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_logs: {
        Row: {
          glasses: number
          id: string
          log_date: string
          member_id: string
        }
        Insert: {
          glasses?: number
          id?: string
          log_date?: string
          member_id: string
        }
        Update: {
          glasses?: number
          id?: string
          log_date?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          id: string
          log_date: string
          logged_at: string | null
          member_id: string
          notes: string | null
          weight_kg: number
        }
        Insert: {
          id?: string
          log_date?: string
          logged_at?: string | null
          member_id: string
          notes?: string | null
          weight_kg: number
        }
        Update: {
          id?: string
          log_date?: string
          logged_at?: string | null
          member_id?: string
          notes?: string | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plan_days: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          name: string | null
          plan_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          name?: string | null
          plan_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          name?: string | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plan_exercises: {
        Row: {
          created_at: string | null
          day_id: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          phase: string
          reps: number
          reps_max: number | null
          rest_seconds: number
          sets: number
        }
        Insert: {
          created_at?: string | null
          day_id: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number
          phase?: string
          reps?: number
          reps_max?: number | null
          rest_seconds?: number
          sets?: number
        }
        Update: {
          created_at?: string | null
          day_id?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          phase?: string
          reps?: number
          reps_max?: number | null
          rest_seconds?: number
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_exercises_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "workout_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plan_set_configs: {
        Row: {
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          percent_1rm: number | null
          reps: number | null
          reps_max: number | null
          set_number: number
        }
        Insert: {
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          percent_1rm?: number | null
          reps?: number | null
          reps_max?: number | null
          set_number: number
        }
        Update: {
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          percent_1rm?: number | null
          reps?: number | null
          reps_max?: number | null
          set_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_set_configs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_plan_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          gym_id: string
          id: string
          is_template: boolean | null
          level: string | null
          name: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          gym_id: string
          id?: string
          is_template?: boolean | null
          level?: string | null
          name: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          gym_id?: string
          id?: string
          is_template?: boolean | null
          level?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_assigned_to_gym_fkey"
            columns: ["assigned_to", "gym_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_plans_assigned_to_gym_fkey"
            columns: ["assigned_to", "gym_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_plans_created_by_gym_fkey"
            columns: ["created_by", "gym_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_plans_created_by_gym_fkey"
            columns: ["created_by", "gym_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_session_drafts: {
        Row: {
          collected_sets: Json
          current_set: number
          day_name: string
          day_of_week: number
          exercise_idx: number
          id: string
          phase: string
          plan_id: string
          rest_ends_at: number | null
          rest_total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collected_sets?: Json
          current_set?: number
          day_name: string
          day_of_week: number
          exercise_idx?: number
          id?: string
          phase?: string
          plan_id: string
          rest_ends_at?: number | null
          rest_total?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collected_sets?: Json
          current_set?: number
          day_name?: string
          day_of_week?: number
          exercise_idx?: number
          id?: string
          phase?: string
          plan_id?: string
          rest_ends_at?: number | null
          rest_total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_session_drafts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_drafts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_session_sets: {
        Row: {
          actual_reps: number | null
          calories_burned: number | null
          category: string
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_id: string | null
          exercise_name: string
          id: string
          planned_reps: number | null
          reps: number | null
          resistance_level: number | null
          session_id: string
          set_number: number
          speed_kmh: number | null
          weight_kg: number | null
        }
        Insert: {
          actual_reps?: number | null
          calories_burned?: number | null
          category: string
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          exercise_name: string
          id?: string
          planned_reps?: number | null
          reps?: number | null
          resistance_level?: number | null
          session_id: string
          set_number: number
          speed_kmh?: number | null
          weight_kg?: number | null
        }
        Update: {
          actual_reps?: number | null
          calories_burned?: number | null
          category?: string
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          exercise_name?: string
          id?: string
          planned_reps?: number | null
          reps?: number | null
          resistance_level?: number | null
          session_id?: string
          set_number?: number
          speed_kmh?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_session_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completed_at: string
          day_name: string
          day_of_week: number
          duration_seconds: number | null
          exercises_count: number
          gym_id: string
          id: string
          plan_id: string | null
          rest_skips: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          day_name: string
          day_of_week: number
          duration_seconds?: number | null
          exercises_count?: number
          gym_id: string
          id?: string
          plan_id?: string | null
          rest_skips?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          day_name?: string
          day_of_week?: number
          duration_seconds?: number | null
          exercises_count?: number
          gym_id?: string
          id?: string
          plan_id?: string | null
          rest_skips?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_plan_gym_fkey"
            columns: ["plan_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_user_gym_fkey"
            columns: ["user_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_sessions_user_gym_fkey"
            columns: ["user_id", "gym_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id", "gym_id"]
          },
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "member_churn_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      member_churn_status: {
        Row: {
          avatar_url: string | null
          churn_status: string | null
          full_name: string | null
          gym_id: string | null
          id: string | null
          last_check_in: string | null
          membership_expires_at: string | null
          membership_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      today_check_ins: {
        Row: {
          avatar_url: string | null
          checked_in_at: string | null
          checked_out_at: string | null
          full_name: string | null
          id: string | null
          membership_type: string | null
          method: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cancel_product_order: {
        Args: {
          p_cancelled_by: string
          p_gym_id: string
          p_order_id: string
          p_reason?: string
        }
        Returns: string
      }
      clone_workout_plan_for_member: {
        Args: { p_member_id: string; p_template_id: string }
        Returns: string
      }
      complete_workout_session: {
        Args: {
          p_day_name: string
          p_day_of_week: number
          p_duration_seconds?: number
          p_exercises_count: number
          p_plan_id: string
          p_rest_skips: number
          p_sets?: Json
        }
        Returns: {
          earned_achievements: Json
          new_total_xp: number
          session_id: string
          xp_earned: number
        }[]
      }
      create_gym_for_owner: {
        Args: { p_gym_name: string; p_user_id: string }
        Returns: string
      }
      create_product_order: {
        Args: {
          p_created_by: string
          p_gym_id: string
          p_items: Json
          p_member_id: string
          p_order_type?: string
          p_payment_method?: string
          p_payment_reference?: string
          p_reservation_minutes?: number
        }
        Returns: string
      }
      expire_stale_payment_checkouts: { Args: never; Returns: undefined }
      extend_member_membership: {
        Args: {
          p_amount: number
          p_duration_days: number
          p_gym_id: string
          p_member_id: string
          p_membership_type: string
          p_method?: string
          p_notes?: string
          p_payment_id: string
          p_recorded_by?: string
        }
        Returns: string
      }
      get_gym_mp_token: { Args: { p_gym_id: string }; Returns: string }
      get_gym_mp_webhook_secret_configured: {
        Args: { p_gym_id: string }
        Returns: boolean
      }
      get_mp_token_for_checkout: { Args: { p_gym_id: string }; Returns: string }
      get_mp_webhook_secret_for_webhook: {
        Args: { p_gym_id: string }
        Returns: string
      }
      get_my_gym_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      mark_product_order_paid: {
        Args: {
          p_gym_id: string
          p_order_id: string
          p_paid_amount?: number
          p_paid_by: string
          p_payment_method: string
          p_payment_reference?: string
        }
        Returns: string
      }
      member_achievement_metrics: { Args: { p_user_id: string }; Returns: Json }
      notify_churn_members: { Args: never; Returns: undefined }
      notify_expiring_memberships: { Args: never; Returns: undefined }
      record_failed_mp_payment: {
        Args: {
          p_amount: number
          p_gym_id: string
          p_member_id: string
          p_mp_payment_id: string
          p_status: Database["public"]["Enums"]["payment_status"]
        }
        Returns: undefined
      }
      record_product_sale: {
        Args: {
          p_gym_id: string
          p_member_id: string
          p_quantity: number
          p_recorded_by: string
          p_variant_id: string
        }
        Returns: string
      }
      release_expired_product_reservations: {
        Args: { p_gym_id?: string }
        Returns: number
      }
      restock_product_variant: {
        Args: { p_new_cost?: number; p_quantity: number; p_variant_id: string }
        Returns: number
      }
      search_foods: {
        Args: {
          p_categories?: string[]
          p_gym_id: string
          p_include_uncategorized?: boolean
          p_limit?: number
          p_offset?: number
          p_query?: string
          p_scope?: string
        }
        Returns: Json
      }
      set_gym_mp_token: {
        Args: { p_gym_id: string; p_token: string }
        Returns: undefined
      }
      set_gym_mp_webhook_secret: {
        Args: { p_gym_id: string; p_secret: string }
        Returns: undefined
      }
    }
    Enums: {
      payment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled"
        | "refunded"
        | "cash"
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
      payment_status: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "refunded",
        "cash",
      ],
    },
  },
} as const
