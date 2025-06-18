import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'
import { copyShareableURL, getShareableURL } from '../utils/urlSharing'

interface ShareButtonProps {
  podJSON: string
  isValid: boolean
  className?: string
}

export default function ShareButton({ podJSON, isValid, className = '' }: ShareButtonProps) {
  const [shareState, setShareState] = useState<'idle' | 'copying' | 'copied'>('idle')
  
  const handleShare = async () => {
    if (!isValid || !podJSON) return
    
    setShareState('copying')
    const copySuccess = await copyShareableURL(podJSON)
    
    if (copySuccess) {
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 2000)
    } else {
      setShareState('idle')
    }
  }
  
  const shareableURL = getShareableURL(podJSON)
  const isURLGenerated = shareableURL !== (window.location.origin + window.location.pathname)
  
  if (!isValid) {
    return null
  }
  
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${className}`}>
      <button
        onClick={handleShare}
        disabled={shareState === 'copying'}
        className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
      >
        {shareState === 'copied' ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Link Copied!</span>
            <span className="sm:hidden">Copied!</span>
          </>
        ) : shareState === 'copying' ? (
          <>
            <Copy className="w-4 h-4 mr-1 animate-pulse" />
            <span className="hidden sm:inline">Copying...</span>
            <span className="sm:hidden">Copying...</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Share POD</span>
            <span className="sm:hidden">Share</span>
          </>
        )}
      </button>
      
      {isURLGenerated && (
        <a
          href={shareableURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          title="Open shareable link in new tab"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Open Link</span>
          <span className="sm:hidden">Open</span>
        </a>
      )}
    </div>
  )
}