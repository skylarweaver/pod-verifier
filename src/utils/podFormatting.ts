import type { JSONPOD } from '@pcd/pod'

export interface FormattedPODEntry {
  name: string
  type: string
  value: any
  displayValue: string
  formattedValue: string
  isImportant?: boolean
  category?: 'personal' | 'event' | 'technical' | 'timestamp' | 'other'
}

/**
 * Format a timestamp into a readable date string
 */
export function formatTimestamp(timestamp: number | string): string {
  try {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
    if (isNaN(date.getTime())) {
      return timestamp.toString()
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return timestamp.toString()
  }
}

/**
 * Format an ISO date string into a readable format
 */
export function formatDateString(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return dateStr
  }
}

/**
 * Detect entry category based on name and value
 */
export function categorizeEntry(name: string, _value: any): FormattedPODEntry['category'] {
  const nameLower = name.toLowerCase()
  
  if (nameLower.includes('email') || nameLower.includes('name') || nameLower.includes('attendee')) {
    return 'personal'
  }
  
  if (nameLower.includes('event') || nameLower.includes('ticket') || nameLower.includes('product')) {
    return 'event'
  }
  
  if (nameLower.includes('timestamp') || nameLower.includes('date') || nameLower.includes('time')) {
    return 'timestamp'
  }
  
  if (nameLower.includes('id') || nameLower.includes('secret') || nameLower.includes('key') || 
      nameLower.includes('consumed') || nameLower.includes('revoked') || nameLower.includes('addon')) {
    return 'technical'
  }
  
  return 'other'
}

/**
 * Check if entry should be highlighted as important
 */
export function isImportantEntry(name: string): boolean {
  const importantFields = ['attendeeName', 'attendeeEmail', 'eventName', 'ticketName', 'eventLocation']
  return importantFields.includes(name)
}

/**
 * Format POD entries with enhanced display formatting
 */
export function formatPODEntriesEnhanced(jsonPOD: JSONPOD): FormattedPODEntry[] {
  const entries = jsonPOD.entries || {}
  
  return Object.entries(entries).map(([name, value]) => {
    let type: string
    let actualValue: any
    let displayValue: string
    let formattedValue: string
    
    // Handle both typed entries and primitive values
    if (value && typeof value === 'object' && 'type' in value && 'value' in value) {
      type = String(value.type)
      actualValue = value.value
    } else {
      // Infer type from primitive value
      if (typeof value === 'string') {
        type = 'string'
        actualValue = value
      } else if (typeof value === 'number') {
        type = 'int'
        actualValue = value
      } else if (typeof value === 'boolean') {
        type = 'boolean'
        actualValue = value
      } else if (typeof value === 'bigint') {
        type = 'cryptographic'
        actualValue = value
      } else {
        type = 'unknown'
        actualValue = value
      }
    }
    
    // Basic display value
    displayValue = String(actualValue)
    
    // Enhanced formatting based on field name and type
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes('timestamp') && typeof actualValue === 'number') {
      formattedValue = formatTimestamp(actualValue)
    } else if (nameLower.includes('date') && typeof actualValue === 'string') {
      formattedValue = formatDateString(actualValue)
    } else if (nameLower.includes('email')) {
      formattedValue = `📧 ${actualValue}`
    } else if (nameLower.includes('name') && !nameLower.includes('event')) {
      formattedValue = `👤 ${actualValue}`
    } else if (nameLower.includes('event') && nameLower.includes('name')) {
      formattedValue = `🎫 ${actualValue}`
    } else if (nameLower.includes('location')) {
      formattedValue = `📍 ${actualValue}`
    } else if (nameLower.includes('category') && typeof actualValue === 'number') {
      formattedValue = `Category ${actualValue}`
    } else if (type === 'boolean') {
      formattedValue = actualValue ? '✅ Yes' : '❌ No'
    } else if (nameLower.includes('url')) {
      formattedValue = `🔗 ${actualValue}`
    } else if (nameLower.includes('secret') || nameLower.includes('key')) {
      formattedValue = `🔐 ${actualValue.length > 20 ? actualValue.slice(0, 20) + '...' : actualValue}`
    } else if (nameLower.includes('id')) {
      formattedValue = `🆔 ${actualValue.length > 30 ? actualValue.slice(0, 30) + '...' : actualValue}`
    } else {
      formattedValue = displayValue
    }
    
    return {
      name,
      type,
      value: actualValue,
      displayValue,
      formattedValue,
      isImportant: isImportantEntry(name),
      category: categorizeEntry(name, actualValue)
    }
  }).sort((a, b) => {
    // Sort by importance first, then by category
    if (a.isImportant && !b.isImportant) return -1
    if (!a.isImportant && b.isImportant) return 1
    
    const categoryOrder = ['personal', 'event', 'timestamp', 'technical', 'other']
    const aIndex = categoryOrder.indexOf(a.category || 'other')
    const bIndex = categoryOrder.indexOf(b.category || 'other')
    
    return aIndex - bIndex
  })
}

/**
 * Get category display information
 */
export function getCategoryInfo(category: FormattedPODEntry['category']) {
  switch (category) {
    case 'personal':
      return { icon: '👤', label: 'Personal', color: 'bg-blue-50 border-blue-200' }
    case 'event':
      return { icon: '🎫', label: 'Event', color: 'bg-purple-50 border-purple-200' }
    case 'timestamp':
      return { icon: '⏰', label: 'Timestamp', color: 'bg-orange-50 border-orange-200' }
    case 'technical':
      return { icon: '⚙️', label: 'Technical', color: 'bg-gray-50 border-gray-200' }
    default:
      return { icon: '📄', label: 'Other', color: 'bg-green-50 border-green-200' }
  }
}