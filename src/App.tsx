import { CheckCircle, FileText, Shield } from 'lucide-react'
import PODVerifier from './components/PODVerifier'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="mb-6">
              <span className="text-4xl sm:text-6xl mb-4 block animate-hop">🐸</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
                POD Verifier
              </h1>
              <p className="text-lg sm:text-xl text-green-700 mb-4 sm:mb-6">
                Hop into secure POD verification! 🪷
              </p>
              <p className="text-base sm:text-lg text-green-600 max-w-2xl mx-auto px-4">
                Paste your Provable Object Data (POD) JSON below and let our friendly frog 
                verify its cryptographic signature and data integrity.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center lily-pad">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                Cryptographic Verification
              </h3>
              <p className="text-sm sm:text-base text-green-600">
                Validates EdDSA signatures and Merkle tree integrity
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center lily-pad">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                POD Structure Analysis
              </h3>
              <p className="text-sm sm:text-base text-green-600">
                Displays all entries, types, and metadata clearly
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center lily-pad">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                Instant Results
              </h3>
              <p className="text-sm sm:text-base text-green-600">
                Client-side verification with immediate feedback
              </p>
            </div>
          </div>

          {/* Main Verifier Component */}
          <PODVerifier />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App