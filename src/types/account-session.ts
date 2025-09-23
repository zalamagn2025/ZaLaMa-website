export interface AccountSession {
  id: string
  device_id: string
  user_id: string
  email: string
  nom?: string
  prenom?: string
  profile_image?: string
  poste?: string
  entreprise?: string
  last_login: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DeviceAccounts {
  device_id: string
  accounts: AccountSession[]
  last_used_account_id?: string
  created_at: string
  updated_at: string
}

export interface AccountData {
  deviceId: string
  email: string
  nom?: string
  prenom?: string
  profileImage?: string
  poste?: string
  entreprise?: string
}

export interface PinVerification {
  deviceId: string
  userId: string
  pin: string
}
