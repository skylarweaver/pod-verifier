import { jsonrepair } from 'jsonrepair'

export interface JSONFormatResult {
  wasRepaired: boolean
  originalInput: string
  repairedJSON: string
  parsedObject: any
  error?: string
}

/**
 * Common malformed JSON patterns we can detect and fix
 */
const MALFORMED_PATTERNS = {
  doubleQuotes: /""([^"]+)""/g, // Double quotes like ""key""
  trailingCommas: /,(\s*[}\]])/g, // Trailing commas
  unquotedKeys: /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, // Unquoted object keys
  singleQuotes: /'([^']*)'/g, // Single quotes around strings
  comments: /\/\*[\s\S]*?\*\/|\/\/.*$/gm, // Comments
  pythonConstants: /\b(None|True|False)\b/g, // Python constants
  ellipsis: /\.\.\./g, // Ellipsis in arrays/objects
  extraCommas: /,\s*,/g, // Multiple consecutive commas
}

/**
 * Detect if JSON string appears to be malformed
 */
export function detectMalformedJSON(jsonString: string): {
  isMalformed: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check for double quotes pattern
  if (MALFORMED_PATTERNS.doubleQuotes.test(jsonString)) {
    issues.push('Double-quoted strings detected (""key"")')
  }
  
  // Check for trailing commas
  if (MALFORMED_PATTERNS.trailingCommas.test(jsonString)) {
    issues.push('Trailing commas found')
  }
  
  // Check for unquoted keys
  if (MALFORMED_PATTERNS.unquotedKeys.test(jsonString)) {
    issues.push('Unquoted object keys detected')
  }
  
  // Check for single quotes
  if (MALFORMED_PATTERNS.singleQuotes.test(jsonString)) {
    issues.push('Single quotes found (should be double quotes)')
  }
  
  // Check for comments
  if (MALFORMED_PATTERNS.comments.test(jsonString)) {
    issues.push('Comments detected (not valid in JSON)')
  }
  
  // Check for Python constants
  if (MALFORMED_PATTERNS.pythonConstants.test(jsonString)) {
    issues.push('Python constants (None, True, False) detected')
  }
  
  // Check for ellipsis
  if (MALFORMED_PATTERNS.ellipsis.test(jsonString)) {
    issues.push('Ellipsis (...) detected')
  }
  
  // Check for extra commas
  if (MALFORMED_PATTERNS.extraCommas.test(jsonString)) {
    issues.push('Multiple consecutive commas found')
  }
  
  // Try to parse - if it fails, it's definitely malformed
  try {
    JSON.parse(jsonString)
  } catch {
    if (issues.length === 0) {
      issues.push('Invalid JSON syntax')
    }
  }
  
  return {
    isMalformed: issues.length > 0,
    issues
  }
}

/**
 * Auto-format malformed JSON using jsonrepair library
 */
export function autoFormatJSON(input: string): JSONFormatResult {
  const originalInput = input.trim()
  
  // First, check if it's already valid JSON
  try {
    const parsed = JSON.parse(originalInput)
    return {
      wasRepaired: false,
      originalInput,
      repairedJSON: originalInput,
      parsedObject: parsed
    }
  } catch {
    // Continue to repair attempt
  }
  
  try {
    // Use jsonrepair to fix the malformed JSON
    const repairedJSON = jsonrepair(originalInput)
    
    // Verify the repaired JSON is valid
    const parsedObject = JSON.parse(repairedJSON)
    
    // Format the repaired JSON nicely
    const formattedJSON = JSON.stringify(parsedObject, null, 2)
    
    return {
      wasRepaired: true,
      originalInput,
      repairedJSON: formattedJSON,
      parsedObject
    }
  } catch (error) {
    return {
      wasRepaired: false,
      originalInput,
      repairedJSON: originalInput,
      parsedObject: null,
      error: error instanceof Error ? error.message : 'Failed to repair JSON'
    }
  }
}

/**
 * Get human-readable description of what was fixed
 */
export function getRepairDescription(original: string, repaired: string): string[] {
  const changes: string[] = []
  
  // Detect what was actually fixed
  if (MALFORMED_PATTERNS.doubleQuotes.test(original)) {
    changes.push('Fixed double-quoted strings (""key"" → "key")')
  }
  
  if (MALFORMED_PATTERNS.trailingCommas.test(original)) {
    changes.push('Removed trailing commas')
  }
  
  if (MALFORMED_PATTERNS.unquotedKeys.test(original)) {
    changes.push('Added quotes around object keys')
  }
  
  if (MALFORMED_PATTERNS.singleQuotes.test(original)) {
    changes.push('Converted single quotes to double quotes')
  }
  
  if (MALFORMED_PATTERNS.comments.test(original)) {
    changes.push('Removed comments')
  }
  
  if (MALFORMED_PATTERNS.pythonConstants.test(original)) {
    changes.push('Converted Python constants to JSON (None→null, True→true, False→false)')
  }
  
  if (MALFORMED_PATTERNS.ellipsis.test(original)) {
    changes.push('Removed ellipsis (...)')
  }
  
  if (MALFORMED_PATTERNS.extraCommas.test(original)) {
    changes.push('Fixed multiple consecutive commas')
  }
  
  // Generic formatting improvement
  if (changes.length === 0 && original !== repaired) {
    changes.push('Improved JSON formatting and structure')
  }
  
  return changes
}

/**
 * Examples of malformed JSON that can be auto-fixed
 */
export const MALFORMED_JSON_EXAMPLES = {
  doubleQuotes: `{""entries"":{""name"":""John"",""age"":30},""signature"":""abc123""}`,
  trailingCommas: `{"entries":{"name":"John","age":30,},"signature":"abc123",}`,
  unquotedKeys: `{entries:{name:"John",age:30},signature:"abc123"}`,
  singleQuotes: `{'entries':{'name':'John','age':30},'signature':'abc123'}`,
  comments: `{
    // User data
    "entries": {
      "name": "John", /* Full name */
      "age": 30
    },
    "signature": "abc123"
  }`,
  pythonConstants: `{"entries":{"name":"John","active":True,"data":None},"signature":"abc123"}`,
  mixed: `{""entries"":{name:'John',age:30,active:True,},signature:"abc123",}`,
}