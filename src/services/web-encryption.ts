import CryptoJS from 'crypto-js'

export class WebEncryption {
  private static readonly SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'zalama_default_key_2024'

  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString()
    } catch (error) {
      console.error('Erreur de chiffrement:', error)
      return data // Fallback non chiffré
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Erreur de déchiffrement:', error)
      return encryptedData // Fallback
    }
  }

  static hashPin(pin: string): string {
    return CryptoJS.SHA256(pin + this.SECRET_KEY).toString()
  }
}
