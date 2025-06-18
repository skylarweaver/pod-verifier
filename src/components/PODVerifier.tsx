import { useState } from 'react'
import { Upload, Check, X, AlertTriangle, RotateCcw, Copy, Eye, EyeOff, Info } from 'lucide-react'
import { validatePODInput, getHelpfulErrorMessage } from '../utils/podValidation'
import { verifyPOD, formatPODEntries, getVerificationSummary } from '../utils/podVerification'
import { realPODExample, testCases } from '../utils/testData'
import Tooltip from './Tooltip'
import HelpSection from './HelpSection'
import type { PODVerificationResult } from '../utils/podVerification'

interface VerificationState {
  isLoading: boolean
  result: PODVerificationResult | null
  error: string | null
  validationError: string | null
}

export default function PODVerifier() {
  const [podInput, setPodInput] = useState('')
  const [verification, setVerification] = useState<VerificationState>({
    isLoading: false,
    result: null,
    error: null,
    validationError: null
  })
  const [showDetailedView, setShowDetailedView] = useState(false)

  const handleVerify = async () => {
    setVerification({ isLoading: true, result: null, error: null, validationError: null })

    try {
      // Step 1: Validate and parse POD input
      const validationResult = validatePODInput(podInput)
      
      if (!validationResult.isValid) {
        setVerification({
          isLoading: false,
          result: null,
          error: null,
          validationError: getHelpfulErrorMessage(validationResult.error || 'Unknown validation error')
        })
        return
      }

      if (!validationResult.parsedPOD) {
        setVerification({
          isLoading: false,
          result: null,
          error: null,
          validationError: 'Failed to parse POD'
        })
        return
      }

      // Step 2: Perform cryptographic verification
      const verificationResult = await verifyPOD(validationResult.parsedPOD)
      
      setVerification({
        isLoading: false,
        result: verificationResult,
        error: verificationResult.error || null,
        validationError: null
      })

    } catch (error) {
      setVerification({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown verification error',
        validationError: null
      })
    }
  }

  const handleReset = () => {
    setPodInput('')
    setVerification({ isLoading: false, result: null, error: null, validationError: null })
    setShowDetailedView(false)
  }

  const loadSamplePOD = (sampleType: 'valid' | 'alice' | 'invalid' = 'valid') => {
    let sampleData
    
    switch (sampleType) {
      case 'alice':
        sampleData = testCases.alicePOD
        break
      case 'invalid':
        sampleData = testCases.missingSignature
        break
      default:
        sampleData = realPODExample
    }
    
    setPodInput(JSON.stringify(sampleData, null, 2))
    setVerification({ isLoading: false, result: null, error: null, validationError: null })
    setShowDetailedView(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      console.warn('Could not copy to clipboard')
    }
  }

  const hasError = verification.validationError || verification.error
  const hasResult = verification.result && !hasError
  
  const verificationSummary = verification.result ? getVerificationSummary(verification.result) : null

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <Upload className="w-6 h-6 mr-2" />
            Paste Your POD
            <span className="ml-2">
              <Tooltip content="PODs (Provable Object Data) are cryptographically signed JSON objects. Paste your POD JSON here to verify its authenticity." />
            </span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => loadSamplePOD('valid')}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Valid POD
            </button>
            <button
              onClick={() => loadSamplePOD('alice')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Alice POD
            </button>
            <button
              onClick={() => loadSamplePOD('invalid')}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Invalid POD
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <textarea
          value={podInput}
          onChange={(e) => setPodInput(e.target.value)}
          placeholder="Paste your POD JSON here... 🐸"
          className="w-full h-64 p-4 border border-green-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-green-600">
            {podInput.length > 0 ? `${podInput.length} characters` : 'No POD data entered'}
          </p>
          <button
            onClick={handleVerify}
            disabled={!podInput.trim() || verification.isLoading}
            className="btn-frog disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {verification.isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Verify POD 🐸
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Error */}
      {verification.validationError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-800">Validation Error</h3>
          </div>
          <p className="text-red-700 mb-4">{verification.validationError}</p>
          <div className="bg-red-100 p-3 rounded-lg">
            <p className="text-sm text-red-600">
              <strong>💡 Tip:</strong> Make sure your POD JSON has the required fields: "entries", "signature", and "signerPublicKey".
            </p>
          </div>
        </div>
      )}

      {/* Verification Error */}
      {verification.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <X className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-800">Verification Error</h3>
          </div>
          <p className="text-red-700">{verification.error}</p>
        </div>
      )}

      {/* Results Section */}
      {hasResult && verificationSummary && (
        <div className={`rounded-xl border p-6 ${
          verificationSummary.status === 'valid' 
            ? 'bg-green-50 border-green-200' 
            : verificationSummary.status === 'invalid'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {verificationSummary.status === 'valid' ? (
                <Check className="w-8 h-8 text-green-600 mr-3" />
              ) : (
                <X className="w-8 h-8 text-red-600 mr-3" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${
                  verificationSummary.status === 'valid' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationSummary.message}
                </h3>
                <p className={`text-sm ${
                  verificationSummary.status === 'valid' ? 'text-green-700' : 'text-red-700'
                }`}>
                  Cryptographic verification {verificationSummary.status === 'valid' ? 'passed' : 'failed'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDetailedView(!showDetailedView)}
              className="flex items-center px-3 py-1 text-sm bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              {showDetailedView ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Details
                </>
              )}
            </button>
          </div>

          {/* Verification Summary */}
          <div className="space-y-2 mb-4">
            {verificationSummary.details.map((detail, index) => (
              <p key={index} className={`text-sm ${
                verificationSummary.status === 'valid' ? 'text-green-700' : 'text-red-700'
              }`}>
                {detail}
              </p>
            ))}
          </div>

          {/* Detailed View */}
          {showDetailedView && verification.result && (
            <div className="mt-6 space-y-4">
              {/* POD Metadata */}
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  POD Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 flex items-center">
                      Content ID:
                      <span className="ml-1">
                        <Tooltip content="The Content ID is a cryptographic hash of all the POD entries, ensuring the data integrity." />
                      </span>
                    </span>
                    <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                      {verification.result.contentID}
                      <button
                        onClick={() => copyToClipboard(verification.result?.contentID || '')}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-3 h-3 inline" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 flex items-center">
                      Signer Public Key:
                      <span className="ml-1">
                        <Tooltip content="The public key of the entity that signed this POD. Used to verify the signature authenticity." />
                      </span>
                    </span>
                    <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                      {verification.result.signerPublicKey}
                      <button
                        onClick={() => copyToClipboard(verification.result?.signerPublicKey || '')}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-3 h-3 inline" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* POD Entries */}
              {verification.result.entries && (
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    POD Entries ({verification.result.entryCount})
                    <span className="ml-1">
                      <Tooltip content="These are the key-value pairs stored in the POD. Each entry has a name, type, and value." />
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {formatPODEntries(verification.result.entries).map((entry, index) => (
                      <div key={index} className="bg-white/70 p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{entry.name}</span>
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                {entry.type}
                              </span>
                            </div>
                            <div className="font-mono text-sm text-gray-700 break-all">
                              {entry.displayValue}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(entry.value)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <HelpSection />
    </div>
  )
}