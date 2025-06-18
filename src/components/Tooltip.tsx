import { useState } from 'react'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: string
  children?: React.ReactNode
  icon?: boolean
}

export default function Tooltip({ content, children, icon = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || (icon && <Info className="w-4 h-4 text-blue-500 hover:text-blue-700" />)}
      </div>
      
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="whitespace-pre-line">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}