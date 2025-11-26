const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

interface RecaptchaVerificationResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  score?: number
  action?: string
  'error-codes'?: string[]
}

export async function verifyRecaptchaToken(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<RecaptchaVerificationResponse> {
  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    }
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    console.error('❌ RECAPTCHA_SECRET_KEY manquant dans la configuration')
    return {
      success: false,
      'error-codes': ['missing-secret'],
    }
  }

  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    if (remoteIp) {
      params.append('remoteip', remoteIp)
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = (await response.json()) as RecaptchaVerificationResponse

    if (!data.success) {
      console.warn('⚠️ Validation reCAPTCHA échouée:', data['error-codes'])
    }

    return data
  } catch (error) {
    console.error('❌ Erreur lors de la vérification reCAPTCHA:', error)
    return {
      success: false,
      'error-codes': ['recaptcha-not-reachable'],
    }
  }
}

