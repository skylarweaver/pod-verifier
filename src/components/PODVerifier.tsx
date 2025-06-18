import { useState, useEffect } from 'react'
import { Upload, Check, X, AlertTriangle, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { validatePODInput, getHelpfulErrorMessage } from '../utils/podValidation'
import { verifyPOD, getVerificationSummary } from '../utils/podVerification'
import { realPODExample, testCases } from '../utils/testData'
import { extractPODFromURL, updateURLWithPOD, clearPODFromURL, isValidPODJSON } from '../utils/urlSharing'
import Tooltip from './Tooltip'
import HelpSection from './HelpSection'
import PODDisplay from './PODDisplay'
import ShareButton from './ShareButton'
import type { PODVerificationResult } from '../utils/podVerification'

interface VerificationState {
  isLoading: boolean
  result: PODVerificationResult | null
  error: string | null
  validationError: string | null
  jsonPOD: any | null
}

export default function PODVerifier() {
  const [podInput, setPodInput] = useState('')
  const [verification, setVerification] = useState<VerificationState>({
    isLoading: false,
    result: null,
    error: null,
    validationError: null,
    jsonPOD: null
  })
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [loadedFromURL, setLoadedFromURL] = useState(false)
  const [autoFormatInfo, setAutoFormatInfo] = useState<{
    wasRepaired: boolean
    repairDescription: string[]
  } | null>(null)

  // Load POD from URL on component mount
  useEffect(() => {
    const podFromURL = extractPODFromURL()
    if (podFromURL && isValidPODJSON(podFromURL)) {
      setPodInput(podFromURL)
      setLoadedFromURL(true)
      // Optionally auto-verify PODs from URL
      // handleVerify() would go here if we want auto-verification
      
      // Hide the notification after 5 seconds
      setTimeout(() => setLoadedFromURL(false), 5000)
    }
  }, [])

  const handleVerify = async () => {
    setVerification({ isLoading: true, result: null, error: null, validationError: null, jsonPOD: null })

    try {
      // Step 1: Validate and parse POD input
      const validationResult = validatePODInput(podInput)
      
      // Update the input with auto-formatted JSON if it was repaired
      if (validationResult.autoFormatResult?.wasRepaired && validationResult.autoFormatResult.repairedJSON) {
        setPodInput(validationResult.autoFormatResult.repairedJSON)
        setAutoFormatInfo({
          wasRepaired: true,
          repairDescription: validationResult.repairDescription || ['JSON formatting improved']
        })
        // Auto-hide the notification after 8 seconds
        setTimeout(() => setAutoFormatInfo(null), 8000)
      } else {
        setAutoFormatInfo(null)
      }
      
      if (!validationResult.isValid) {
        setVerification({
          isLoading: false,
          result: null,
          error: null,
          validationError: getHelpfulErrorMessage(validationResult.error || 'Unknown validation error'),
          jsonPOD: null
        })
        return
      }

      if (!validationResult.parsedPOD) {
        setVerification({
          isLoading: false,
          result: null,
          error: null,
          validationError: 'Failed to parse POD',
          jsonPOD: null
        })
        return
      }

      // Step 2: Perform cryptographic verification
      const verificationResult = await verifyPOD(validationResult.parsedPOD)
      
      setVerification({
        isLoading: false,
        result: verificationResult,
        error: verificationResult.error || null,
        validationError: null,
        jsonPOD: validationResult.jsonPOD || null
      })

      // Update URL with POD data for sharing
      if (verificationResult.isSignatureValid && validationResult.jsonPOD) {
        updateURLWithPOD(podInput)
      }

    } catch (error) {
      setVerification({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown verification error',
        validationError: null,
        jsonPOD: null
      })
    }
  }

  const handleReset = () => {
    setPodInput('')
    setVerification({ isLoading: false, result: null, error: null, validationError: null, jsonPOD: null })
    setShowDetailedView(false)
    clearPODFromURL()
  }

  const loadSamplePOD = (sampleType: 'valid' | 'alice' | 'invalid' | 'malformed' = 'valid') => {
    let sampleData
    let isRawText = false
    
    switch (sampleType) {
      case 'alice':
        sampleData = testCases.alicePOD
        break
      case 'invalid':
        sampleData = testCases.missingSignature
        break
      case 'malformed':
        // Load malformed JSON to test auto-formatting
        sampleData = `{""entries"":{""attendeeEmail"":""test@example.com"",""attendeeName"":""Test User"",""eventName"":""Demo Event"",isActive:true,count:42,},""signature"":""demo-signature"",""signerPublicKey"":""demo-key""}`
        isRawText = true
        break
      default:
        sampleData = realPODExample
    }
    
    setPodInput(isRawText ? sampleData as string : JSON.stringify(sampleData, null, 2))
    setVerification({ isLoading: false, result: null, error: null, validationError: null, jsonPOD: null })
    setShowDetailedView(false)
    setAutoFormatInfo(null)
  }


  const hasError = verification.validationError || verification.error
  const hasResult = verification.result && !hasError
  
  const verificationSummary = verification.result ? getVerificationSummary(verification.result) : null

  return (
    <div className="space-y-8">
      {/* URL Load Notification */}
      {loadedFromURL && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-blue-800 font-medium">POD loaded from shared link!</p>
              <p className="text-blue-600 text-sm">You can now click "Verify POD 🐸" to check its authenticity.</p>
            </div>
          </div>
          <button
            onClick={() => setLoadedFromURL(false)}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Auto-Format Notification */}
      {autoFormatInfo?.wasRepaired && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-orange-600 mr-3" />
            <div>
              <p className="text-orange-800 font-medium">JSON auto-formatted! 🛠️</p>
              <div className="text-orange-600 text-sm">
                <p>Fixed the following issues:</p>
                <ul className="list-disc list-inside mt-1">
                  {autoFormatInfo.repairDescription.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={() => setAutoFormatInfo(null)}
            className="text-orange-400 hover:text-orange-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
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
              onClick={() => loadSamplePOD('malformed')}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Malformed JSON
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
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDetailedView(!showDetailedView)}
                className="flex items-center px-3 py-1 text-sm bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                {showDetailedView ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide POD Data
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    View POD Data
                  </>
                )}
              </button>
              
              <ShareButton 
                podJSON={podInput}
                isValid={verificationSummary?.status === 'valid'}
              />
            </div>
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

          {/* Enhanced POD Display */}
          {showDetailedView && verification.result && verification.jsonPOD && (
            <div className="mt-6">
              <PODDisplay 
                jsonPOD={verification.jsonPOD}
                contentID={verification.result.contentID || ''}
                signerPublicKey={verification.result.signerPublicKey || ''}
              />
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <HelpSection />
    </div>
  )
}