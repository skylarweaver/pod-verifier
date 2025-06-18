import { useState } from 'react'
import { ChevronDown, ChevronRight, Book, Shield, Code, Lightbulb } from 'lucide-react'

interface HelpTopicProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

function HelpTopic({ title, icon, children }: HelpTopicProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          {icon}
          <span className="font-medium text-blue-800 ml-2">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-blue-600" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-white border-t border-blue-200">
          {children}
        </div>
      )}
    </div>
  )
}

export default function HelpSection() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
        <Book className="w-5 h-5 mr-2" />
        POD Verification Help
      </h3>
      
      <div className="space-y-3">
        <HelpTopic 
          title="What are PODs?" 
          icon={<Shield className="w-4 h-4 text-blue-600" />}
        >
          <div className="text-blue-700 space-y-2 text-sm">
            <p>
              <strong>Provable Object Data (PODs)</strong> are cryptographically signed objects that contain structured data. 
              They use EdDSA-Poseidon signatures to ensure the data hasn't been tampered with.
            </p>
            <p>
              Each POD contains:
            </p>
            <ul className="ml-4 space-y-1">
              <li>• <strong>Entries:</strong> Key-value pairs with your data</li>
              <li>• <strong>Signature:</strong> Cryptographic proof of authenticity</li>
              <li>• <strong>Signer Public Key:</strong> Identifies who signed the POD</li>
            </ul>
          </div>
        </HelpTopic>

        <HelpTopic 
          title="How Verification Works" 
          icon={<Code className="w-4 h-4 text-blue-600" />}
        >
          <div className="text-blue-700 space-y-2 text-sm">
            <p>
              The verification process involves several steps:
            </p>
            <ol className="ml-4 space-y-1 list-decimal">
              <li><strong>JSON Parsing:</strong> Check if the POD is valid JSON</li>
              <li><strong>Structure Validation:</strong> Verify required fields exist</li>
              <li><strong>Entry Validation:</strong> Check entry names and types</li>
              <li><strong>Signature Verification:</strong> Cryptographically verify the EdDSA signature</li>
              <li><strong>Merkle Tree Validation:</strong> Ensure entries match the content ID</li>
            </ol>
            <p className="mt-2">
              <strong>All verification happens in your browser</strong> - no data is sent to any server.
            </p>
          </div>
        </HelpTopic>

        <HelpTopic 
          title="Common POD Formats" 
          icon={<Lightbulb className="w-4 h-4 text-blue-600" />}
        >
          <div className="text-blue-700 space-y-2 text-sm">
            <p>PODs can store entries in two formats:</p>
            
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="font-medium">1. Simple Format (JSON POD):</p>
              <pre className="text-xs mt-1 bg-white p-2 rounded overflow-x-auto">{`{
  "entries": {
    "name": "Alice",
    "age": 25,
    "isVerified": true
  },
  "signature": "...",
  "signerPublicKey": "..."
}`}</pre>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="font-medium">2. Typed Format:</p>
              <pre className="text-xs mt-1 bg-white p-2 rounded overflow-x-auto">{`{
  "entries": {
    "name": {
      "type": "string",
      "value": "Alice"
    },
    "age": {
      "type": "int", 
      "value": 25
    }
  },
  "signature": "...",
  "signerPublicKey": "..."
}`}</pre>
            </div>
          </div>
        </HelpTopic>

        <HelpTopic 
          title="Troubleshooting" 
          icon={<Lightbulb className="w-4 h-4 text-blue-600" />}
        >
          <div className="text-blue-700 space-y-2 text-sm">
            <p><strong>Common Issues:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• <strong>JSON Parse Error:</strong> Check for missing quotes, commas, or brackets</li>
              <li>• <strong>Missing Fields:</strong> Ensure your POD has "entries", "signature", and "signerPublicKey"</li>
              <li>• <strong>Invalid Entry Names:</strong> Entry names must be valid identifiers (letters, numbers, underscore only)</li>
              <li>• <strong>Signature Invalid:</strong> The POD may have been modified or corrupted</li>
            </ul>
            
            <p className="mt-3"><strong>Tips:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Use the sample buttons to see working examples</li>
              <li>• Copy POD data carefully to avoid formatting issues</li>
              <li>• Check that signatures and public keys are proper base64 strings</li>
            </ul>
          </div>
        </HelpTopic>
      </div>
    </div>
  )
}