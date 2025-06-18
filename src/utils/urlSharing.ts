/**
 * URL sharing utilities for POD data
 */

/**
 * Simple compression using gzip-like approach for URL sharing
 */
function compressJSON(json: string): string {
  // Remove unnecessary whitespace and format JSON compactly
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch {
    return json.replace(/\s+/g, ' ').trim()
  }
}

/**
 * Encode POD JSON for URL sharing with better compression
 */
export function encodePODForURL(podJSON: string): string {
  try {
    // First compress the JSON by removing whitespace
    const compressed = compressJSON(podJSON)
    
    // Use base64url encoding (URL-safe base64)
    const encoded = btoa(compressed)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    
    return encoded
  } catch (error) {
    console.error('Failed to encode POD for URL:', error)
    return ''
  }
}

/**
 * Decode POD JSON from URL
 */
export function decodePODFromURL(encoded: string): string | null {
  try {
    // Convert back from base64url to base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '='
    }
    
    const decoded = atob(base64)
    return decoded
  } catch (error) {
    console.error('Failed to decode POD from URL:', error)
    return null
  }
}

/**
 * Get current URL with POD data encoded
 */
export function getShareableURL(podJSON: string): string {
  const encoded = encodePODForURL(podJSON)
  if (!encoded) return window.location.origin + window.location.pathname
  
  const url = new URL(window.location.href)
  url.searchParams.set('pod', encoded)
  return url.toString()
}

/**
 * Extract POD data from current URL
 */
export function extractPODFromURL(): string | null {
  const url = new URL(window.location.href)
  const encoded = url.searchParams.get('pod')
  
  if (!encoded) return null
  
  return decodePODFromURL(encoded)
}

/**
 * Update URL with POD data without page reload
 */
export function updateURLWithPOD(podJSON: string) {
  const encoded = encodePODForURL(podJSON)
  const url = new URL(window.location.href)
  
  if (encoded) {
    url.searchParams.set('pod', encoded)
  } else {
    url.searchParams.delete('pod')
  }
  
  // Update URL without page reload
  window.history.replaceState({}, '', url.toString())
}

/**
 * Clear POD data from URL
 */
export function clearPODFromURL() {
  const url = new URL(window.location.href)
  url.searchParams.delete('pod')
  window.history.replaceState({}, '', url.toString())
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableURL(podJSON: string): Promise<boolean> {
  try {
    const shareableURL = getShareableURL(podJSON)
    await navigator.clipboard.writeText(shareableURL)
    return true
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error)
    return false
  }
}

/**
 * Share via Web Share API if available
 */
export async function shareViaNative(podJSON: string): Promise<boolean> {
  if (!navigator.share) return false
  
  try {
    const shareableURL = getShareableURL(podJSON)
    await navigator.share({
      title: 'POD Verifier - Verify this POD',
      text: 'Check out this verified Provable Object Data (POD)',
      url: shareableURL
    })
    return true
  } catch (error) {
    // User cancelled or error occurred
    return false
  }
}

/**
 * Validate if a string looks like POD JSON
 */
export function isValidPODJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString)
    return (
      parsed &&
      typeof parsed === 'object' &&
      'entries' in parsed &&
      'signature' in parsed &&
      'signerPublicKey' in parsed
    )
  } catch {
    return false
  }
}