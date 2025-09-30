export interface Profile {
  id: string
  email: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  subdomain: string | null
  custom_domain: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price_in_cents: number
  max_projects: number
  max_pages_per_project: number
  max_storage_mb: number
  custom_domain_allowed: boolean
  stripe_price_id: string | null
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  project_count: number
  storage_used_mb: number
  updated_at: string
}

export interface Page {
  id: string
  project_id: string
  name: string
  slug: string
  is_home: boolean
  created_at: string
  updated_at: string
}

export interface Element {
  id: string
  project_id: string
  name: string
  slug: string
  is_home: boolean
  created_at: string
  updated_at: string
}

export type ElementType = "section" | "container" | "text" | "image" | "button" | "form" | "navbar" | "footer"

export interface EditorElement extends Element {
  children?: EditorElement[]
}

export interface UserTable {
  id: string
  project_id: string
  name: string
  schema: TableSchema
  created_at: string
  updated_at: string
}

export interface TableSchema {
  columns: TableColumn[]
}

export interface TableColumn {
  name: string
  type: "text" | "number" | "boolean" | "date" | "image"
  required: boolean
}

export interface TableData {
  id: string
  table_id: string
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DataBinding {
  table_id: string
  field: string
  display_type?: "text" | "image" | "list"
}

export interface Translation {
  id: string
  project_id: string
  language_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface TranslationString {
  id: string
  translation_id: string
  element_id: string
  field_name: string
  translated_value: string
  created_at: string
  updated_at: string
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
]
