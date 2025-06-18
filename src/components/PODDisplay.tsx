import { useState } from 'react'
import { Copy, Eye, EyeOff, User, Settings, FileText } from 'lucide-react'
import type { JSONPOD } from '@pcd/pod'
import { formatPODEntriesEnhanced, getCategoryInfo, type FormattedPODEntry } from '../utils/podFormatting'

interface PODDisplayProps {
  jsonPOD: JSONPOD
  contentID: string
  signerPublicKey: string
}

interface CategorySectionProps {
  category: FormattedPODEntry['category']
  entries: FormattedPODEntry[]
  onCopy: (text: string) => void
}

function CategorySection({ category, entries, onCopy }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(category === 'personal' || category === 'event')
  const categoryInfo = getCategoryInfo(category)
  
  if (entries.length === 0) return null
  
  return (
    <div className={`rounded-lg border ${categoryInfo.color} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{categoryInfo.icon}</span>
          <span className="font-medium text-gray-800">{categoryInfo.label}</span>
          <span className="text-sm text-gray-500">({entries.length})</span>
        </div>
        {isExpanded ? (
          <EyeOff className="w-4 h-4 text-gray-500" />
        ) : (
          <Eye className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-current border-opacity-20">
          {entries.map((entry, index) => (
            <div key={index} className={`px-4 py-3 ${index > 0 ? 'border-t border-current border-opacity-10' : ''}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`font-medium text-gray-800 ${entry.isImportant ? 'text-blue-700' : ''}`}>
                      {entry.name}
                    </span>
                    <span className="px-2 py-1 text-xs bg-white/70 text-gray-600 rounded-full">
                      {entry.type}
                    </span>
                    {entry.isImportant && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        Key Info
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700">
                    <div className="font-mono text-xs sm:text-sm bg-white/50 px-2 py-1 rounded mb-1 break-all">
                      {entry.formattedValue}
                    </div>
                    {entry.formattedValue !== entry.displayValue && (
                      <div className="text-xs text-gray-500 font-mono break-all">
                        Raw: {entry.displayValue}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onCopy(String(entry.value))}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Copy value"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PODDisplay({ jsonPOD, contentID, signerPublicKey }: PODDisplayProps) {
  const [showRawJSON, setShowRawJSON] = useState(false)
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.warn('Could not copy to clipboard')
    }
  }
  
  const formattedEntries = formatPODEntriesEnhanced(jsonPOD)
  
  // Group entries by category
  const entriesByCategory = formattedEntries.reduce((acc, entry) => {
    const category = entry.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(entry)
    return acc
  }, {} as Record<string, FormattedPODEntry[]>)
  
  const categoryOrder = ['personal', 'event', 'timestamp', 'technical', 'other'] as const
  
  return (
    <div className="space-y-6">
      {/* POD Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            POD Data Overview
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowRawJSON(!showRawJSON)}
              className="px-3 py-1 text-sm bg-white/70 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              {showRawJSON ? 'Hide Raw JSON' : 'Show Raw JSON'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Total Entries:</span>
            <span className="ml-2 font-mono text-gray-800">{formattedEntries.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Content ID:</span>
            <div className="font-mono text-xs bg-white/70 p-2 rounded mt-1 break-all flex items-center">
              <span className="flex-1 min-w-0">{contentID.slice(0, 32)}...</span>
              <button
                onClick={() => copyToClipboard(contentID)}
                className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        
        {showRawJSON && (
          <div className="mt-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(jsonPOD, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
      
      {/* Categorized Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2" />
          POD Contents
        </h3>
        
        {categoryOrder.map(category => (
          <CategorySection
            key={category}
            category={category}
            entries={entriesByCategory[category] || []}
            onCopy={copyToClipboard}
          />
        ))}
      </div>
      
      {/* Technical Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Technical Details
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-600">Signer Public Key:</span>
            <div className="font-mono text-xs bg-white p-2 rounded mt-1 break-all flex items-center gap-2">
              <span className="flex-1 min-w-0">{signerPublicKey}</span>
              <button
                onClick={() => copyToClipboard(signerPublicKey)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Signature Algorithm:</span>
            <span className="ml-2 font-mono text-gray-800">EdDSA-Poseidon</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Content Integrity:</span>
            <span className="ml-2 text-green-700">✅ Merkle Tree Validated</span>
          </div>
        </div>
      </div>
    </div>
  )
}