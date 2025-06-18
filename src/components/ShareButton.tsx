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
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleShare}
        disabled={shareState === 'copying'}
        className="flex items-center px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
      >
        {shareState === 'copied' ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Link Copied!
          </>
        ) : shareState === 'copying' ? (
          <>
            <Copy className="w-4 h-4 mr-1 animate-pulse" />
            Copying...
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-1" />
            Share POD
          </>
        )}
      </button>
      
      {isURLGenerated && (
        <a
          href={shareableURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          title="Open shareable link in new tab"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Open Link
        </a>
      )}
    </div>
  )
}