import { Heart, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-green-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg">🐸</span>
            <span className="text-green-700">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-green-700">and lots of</span>
            <span className="text-lg">🪷</span>
          </div>
          
          <p className="text-sm text-green-600 mb-4">
            This POD verifier runs entirely in your browser. No data is sent to any server.
          </p>
          
          <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-green-600">
            <span>Built with React & TypeScript</span>
            <span>•</span>
            <span>Powered by @pcd/pod</span>
            <span>•</span>
            <span>Frog-themed with ❤️</span>
            <span>•</span>
            <a 
              href="https://github.com/skylarweaver/pod-verifier" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
          
          <div className="mt-6 text-xs text-green-500">
            <p>POD verification happens client-side using cryptographic signatures.</p>
            <p>Learn more about Provable Object Data at <a href="https://pod.org" className="underline hover:text-green-600">pod.org</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}