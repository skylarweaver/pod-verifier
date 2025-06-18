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
              <p className="text-sm text-green-600">
                Secure • 
                <a 
                  href="https://github.com/skylarweaver/pod-verifier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative inline-block group cursor-pointer transition-all duration-300 hover:text-green-700"
                >
                  <span className="relative z-10">Client-side</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-sm -mx-1 px-1"></span>
                  <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"></span>
                </a>
                 • Frog-powered
              </p>
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