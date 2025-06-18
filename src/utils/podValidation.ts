import { POD } from '@pcd/pod'
import type { JSONPOD } from '@pcd/pod'

export interface PODValidationResult {
  isValid: boolean
  error?: string
  parsedPOD?: POD
  jsonPOD?: JSONPOD
}

export interface PODValidationError extends Error {
  code: 'PARSE_ERROR' | 'STRUCTURE_ERROR' | 'POD_ERROR'
  details?: any
}

/**
 * Safely parse JSON string with proper error handling
 */
export function safeJsonParse(jsonString: string): { success: boolean; data?: any; error?: string } {
  try {
    // Basic security: check for extremely large inputs
    if (jsonString.length > 1000000) { // 1MB limit
      return { success: false, error: 'Input too large (max 1MB)' }
    }

    // Sanitize input: remove null bytes and other potentially problematic characters
    const sanitized = jsonString.replace(/\0/g, '')
    
    const parsed = JSON.parse(sanitized)
    return { success: true, data: parsed }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON format' 
    }
  }
}

/**
 * Validate basic POD JSON structure
 */
export function validatePODStructure(obj: any): { isValid: boolean; error?: string } {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, error: 'POD must be an object' }
  }

  // Check for required top-level fields
  if (!obj.entries) {
    return { isValid: false, error: 'POD must have an "entries" field' }
  }

  if (!obj.signature) {
    return { isValid: false, error: 'POD must have a "signature" field' }
  }

  if (!obj.signerPublicKey) {
    return { isValid: false, error: 'POD must have a "signerPublicKey" field' }
  }

  // Validate entries structure
  if (typeof obj.entries !== 'object' || obj.entries === null) {
    return { isValid: false, error: 'POD entries must be an object' }
  }

  // Validate signature format (should be base64 string)
  if (typeof obj.signature !== 'string' || obj.signature.length === 0) {
    return { isValid: false, error: 'POD signature must be a non-empty string' }
  }

  // Validate signerPublicKey format (should be base64 string)
  if (typeof obj.signerPublicKey !== 'string' || obj.signerPublicKey.length === 0) {
    return { isValid: false, error: 'POD signerPublicKey must be a non-empty string' }
  }

  return { isValid: true }
}

/**
 * Validate POD entries structure and types
 */
export function validatePODEntries(entries: any): { isValid: boolean; error?: string } {
  if (!entries || typeof entries !== 'object') {
    return { isValid: false, error: 'Entries must be an object' }
  }

  for (const [key, value] of Object.entries(entries)) {
    // Validate entry name
    if (typeof key !== 'string' || key.length === 0) {
      return { isValid: false, error: `Entry name "${key}" must be a non-empty string` }
    }

    // Validate entry name format (POD names must match identifier pattern)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      return { isValid: false, error: `Entry name "${key}" must be a valid identifier (alphanumeric + underscore, not starting with digit)` }
    }

    // Validate entry value
    const entryValidation = validatePODEntryValue(key, value)
    if (!entryValidation.isValid) {
      return entryValidation
    }
  }

  return { isValid: true }
}

/**
 * Validate individual POD entry value
 */
export function validatePODEntryValue(key: string, value: any): { isValid: boolean; error?: string } {
  // Entry can be either a typed value object OR a primitive (in JSON POD format)
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    // This is valid for JSON POD format where primitives are allowed
    return { isValid: true }
  }

  if (!value || typeof value !== 'object') {
    return { isValid: false, error: `Entry "${key}" must be an object with type and value, or a primitive value` }
  }

  // For typed entry objects, validate structure
  if ('type' in value && 'value' in value) {
    const { type } = value
    
    // Validate type
    const validTypes = ['string', 'int', 'cryptographic', 'boolean', 'date', 'eddsa_pubkey', 'bytes', 'null']
    if (!validTypes.includes(type)) {
      return { isValid: false, error: `Entry "${key}" has invalid type "${type}". Valid types: ${validTypes.join(', ')}` }
    }

    // Basic value validation based on type
    const valueValidation = validateValueForType(type, value.value, key)
    if (!valueValidation.isValid) {
      return valueValidation
    }
  }

  return { isValid: true }
}

/**
 * Validate value matches expected type
 */
export function validateValueForType(type: string, value: any, entryName: string): { isValid: boolean; error?: string } {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return { isValid: false, error: `Entry "${entryName}" type is "string" but value is ${typeof value}` }
      }
      break
    
    case 'int':
      if (typeof value !== 'number' && typeof value !== 'bigint' && typeof value !== 'string') {
        return { isValid: false, error: `Entry "${entryName}" type is "int" but value is ${typeof value}` }
      }
      break
    
    case 'boolean':
      if (typeof value !== 'boolean') {
        return { isValid: false, error: `Entry "${entryName}" type is "boolean" but value is ${typeof value}` }
      }
      break
    
    case 'cryptographic':
      if (typeof value !== 'number' && typeof value !== 'bigint' && typeof value !== 'string') {
        return { isValid: false, error: `Entry "${entryName}" type is "cryptographic" but value is ${typeof value}` }
      }
      break
    
    case 'eddsa_pubkey':
      if (typeof value !== 'string') {
        return { isValid: false, error: `Entry "${entryName}" type is "eddsa_pubkey" but value is ${typeof value}` }
      }
      break
    
    case 'date':
      if (typeof value !== 'string' && !(value instanceof Date)) {
        return { isValid: false, error: `Entry "${entryName}" type is "date" but value is ${typeof value}` }
      }
      break
    
    case 'bytes':
      if (!(value instanceof Uint8Array) && typeof value !== 'string') {
        return { isValid: false, error: `Entry "${entryName}" type is "bytes" but value is ${typeof value}` }
      }
      break
    
    case 'null':
      if (value !== null) {
        return { isValid: false, error: `Entry "${entryName}" type is "null" but value is not null` }
      }
      break
  }

  return { isValid: true }
}

/**
 * Main POD validation function
 * Safely parses JSON and validates POD structure
 */
export function validatePODInput(input: string): PODValidationResult {
  try {
    // Step 1: Parse JSON safely
    const parseResult = safeJsonParse(input.trim())
    if (!parseResult.success) {
      return {
        isValid: false,
        error: `JSON parsing failed: ${parseResult.error}`
      }
    }

    const jsonData = parseResult.data

    // Step 2: Validate basic POD structure
    const structureValidation = validatePODStructure(jsonData)
    if (!structureValidation.isValid) {
      return {
        isValid: false,
        error: `POD structure invalid: ${structureValidation.error}`
      }
    }

    // Step 3: Validate entries
    const entriesValidation = validatePODEntries(jsonData.entries)
    if (!entriesValidation.isValid) {
      return {
        isValid: false,
        error: `POD entries invalid: ${entriesValidation.error}`
      }
    }

    // Step 4: Try to create POD object from JSON
    try {
      const pod = POD.fromJSON(jsonData)
      return {
        isValid: true,
        parsedPOD: pod,
        jsonPOD: jsonData
      }
    } catch (podError) {
      return {
        isValid: false,
        error: `POD creation failed: ${podError instanceof Error ? podError.message : 'Unknown POD error'}`
      }
    }

  } catch (error) {
    return {
      isValid: false,
      error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Get user-friendly error message for common POD validation issues
 */
export function getHelpfulErrorMessage(error: string): string {
  if (error.includes('JSON parsing failed')) {
    return 'The input is not valid JSON. Make sure you have properly formatted JSON with correct brackets, quotes, and commas.'
  }
  
  if (error.includes('POD must have')) {
    return 'The JSON is missing required POD fields. A valid POD must have "entries", "signature", and "signerPublicKey" fields.'
  }
  
  if (error.includes('Entry name')) {
    return 'POD entry names must be valid identifiers (letters, numbers, and underscores only, not starting with a number).'
  }
  
  if (error.includes('type')) {
    return 'POD entries must have valid types. Supported types are: string, int, cryptographic, boolean, date, eddsa_pubkey, bytes, null.'
  }
  
  if (error.includes('POD creation failed')) {
    return 'The POD library could not parse this data. This usually means the signature format or entry values are invalid.'
  }
  
  return error
}