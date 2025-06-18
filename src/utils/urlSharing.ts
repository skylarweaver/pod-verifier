/**
 * URL sharing utilities for POD data
 */

/**
 * Encode POD JSON for URL sharing
 */
export function encodePODForURL(podJSON: string): string {
  try {
    // Compress and encode the POD JSON
    const compressed = btoa(encodeURIComponent(podJSON))
    return compressed
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
    const decoded = decodeURIComponent(atob(encoded))
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