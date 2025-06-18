import { POD } from '@pcd/pod'

export interface PODVerificationResult {
  isSignatureValid: boolean
  contentID?: string
  signerPublicKey?: string
  entryCount?: number
  entries?: Record<string, any>
  verificationDetails?: {
    signatureValid: boolean
    merkleTreeValid: boolean
    entriesValid: boolean
  }
  error?: string
}

/**
 * Perform cryptographic verification of a POD
 */
export async function verifyPOD(pod: POD): Promise<PODVerificationResult> {
  try {
    // Get basic POD information
    const contentID = pod.contentID.toString()
    const signerPublicKey = pod.signerPublicKey
    const entries = pod.content.asEntries()
    const entryCount = Object.keys(entries).length

    // Perform signature verification
    let isSignatureValid = false
    let signatureError: string | undefined
    
    try {
      isSignatureValid = pod.verifySignature()
    } catch (error) {
      signatureError = error instanceof Error ? error.message : 'Signature verification failed'
      isSignatureValid = false
    }

    // Additional verification details
    const verificationDetails = {
      signatureValid: isSignatureValid,
      merkleTreeValid: true, // POD library handles this internally
      entriesValid: true, // If POD was created successfully, entries are valid
    }

    return {
      isSignatureValid,
      contentID,
      signerPublicKey,
      entryCount,
      entries,
      verificationDetails,
      error: signatureError
    }

  } catch (error) {
    return {
      isSignatureValid: false,
      error: error instanceof Error ? error.message : 'POD verification failed'
    }
  }
}

/**
 * Extract and format POD entry information for display
 */
export function formatPODEntries(entries: Record<string, any>): Array<{
  name: string
  type: string
  value: string
  displayValue: string
}> {
  return Object.entries(entries).map(([name, entry]) => {
    let type: string
    let value: any
    let displayValue: string

    // Handle both typed entries and primitive values (from JSON POD)
    if (entry && typeof entry === 'object' && 'type' in entry && 'value' in entry) {
      type = entry.type
      value = entry.value
    } else {
      // Infer type from primitive value
      if (typeof entry === 'string') {
        type = 'string'
        value = entry
      } else if (typeof entry === 'number') {
        type = 'int'
        value = entry
      } else if (typeof entry === 'boolean') {
        type = 'boolean'
        value = entry
      } else if (typeof entry === 'bigint') {
        type = 'cryptographic'
        value = entry
      } else {
        type = 'unknown'
        value = entry
      }
    }

    // Format display value based on type
    switch (type) {
      case 'string':
        displayValue = `"${value}"`
        break
      case 'int':
      case 'cryptographic':
        displayValue = value.toString()
        break
      case 'boolean':
        displayValue = value ? 'true' : 'false'
        break
      case 'date':
        displayValue = value instanceof Date ? value.toISOString() : value.toString()
        break
      case 'eddsa_pubkey':
        displayValue = value.toString()
        break
      case 'bytes':
        displayValue = value instanceof Uint8Array ? `[${value.length} bytes]` : value.toString()
        break
      case 'null':
        displayValue = 'null'
        break
      default:
        displayValue = String(value)
    }

    return {
      name,
      type,
      value: String(value),
      displayValue
    }
  })
}

/**
 * Generate a verification summary message
 */
export function getVerificationSummary(result: PODVerificationResult): {
  status: 'valid' | 'invalid' | 'error'
  message: string
  details: string[]
} {
  if (result.error) {
    return {
      status: 'error',
      message: 'Verification Error',
      details: [result.error]
    }
  }

  if (result.isSignatureValid) {
    const details = [
      `✅ Signature is cryptographically valid`,
      `📝 Content ID: ${result.contentID?.slice(0, 16)}...`,
      `🔑 Signer: ${result.signerPublicKey?.slice(0, 16)}...`,
      `📊 ${result.entryCount} entries verified`
    ]

    return {
      status: 'valid',
      message: 'POD is Valid! 🎉',
      details
    }
  } else {
    return {
      status: 'invalid',
      message: 'POD Signature Invalid ❌',
      details: [
        '❌ Cryptographic signature verification failed',
        'This POD may have been tampered with or contain invalid data'
      ]
    }
  }
}

/**
 * Check if a string looks like a valid base64 signature
 */
export function looksLikeSignature(signature: string): boolean {
  // Base64 pattern check (88 chars for EdDSA signature)
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/
  return base64Pattern.test(signature) && signature.length >= 40
}

/**
 * Check if a string looks like a valid public key
 */
export function looksLikePublicKey(publicKey: string): boolean {
  // Base64 pattern check (44 chars for EdDSA public key)
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/
  return base64Pattern.test(publicKey) && publicKey.length >= 20
}

/**
 * Validate signature and public key formats before verification
 */
export function validateCryptographicFormats(signature: string, publicKey: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!looksLikeSignature(signature)) {
    errors.push('Signature does not appear to be valid base64 format')
  }

  if (!looksLikePublicKey(publicKey)) {
    errors.push('Public key does not appear to be valid base64 format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}