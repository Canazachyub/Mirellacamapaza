/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_GOOGLE_APPS_SCRIPT_URL: string
  readonly VITE_SPREADSHEET_ID: string
  readonly VITE_DRIVE_FOLDER_ID: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_WHATSAPP_MESSAGE: string
  readonly VITE_EMAIL: string
  readonly VITE_TIKTOK_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_WHATSAPP_GROUP_URL: string
  readonly VITE_SEDE_PRINCIPAL_LAT: string
  readonly VITE_SEDE_PRINCIPAL_LNG: string
  readonly VITE_GOOGLE_MAPS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
