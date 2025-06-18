import { ExternalLink } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🐸</span>
            <div>
              <h1 className="text-xl font-bold text-green-800">POD Verifier</h1>
              <p className="text-sm text-green-600">Secure • Client-side • Frog-powered</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a 
              href="https://pod.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-700 hover:text-green-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Learn about PODs</span>
            </a>
            <a 
              href="https://docs.pcd.team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-700 hover:text-green-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Docs</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}