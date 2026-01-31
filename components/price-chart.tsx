'use client'

export default function PriceChart() {
  // This avoids the import error and provides a cleaner fallback
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid lines */}
        <line x1="0" y1="50" x2="400" y2="50" stroke="#00d4aa" strokeWidth="0.5" opacity="0.1" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#00d4aa" strokeWidth="0.5" opacity="0.1" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#00d4aa" strokeWidth="0.5" opacity="0.1" />
        
        {/* Chart line - uptrend */}
        <polyline
          points="20,140 60,120 100,110 140,95 180,85 220,70 260,60 300,45 340,35 380,25"
          stroke="#00d4aa"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Fill area under curve */}
        <polygon
          points="20,140 60,120 100,110 140,95 180,85 220,70 260,60 300,45 340,35 380,25 380,200 20,200"
          fill="url(#chartGradient)"
          opacity="0.3"
        />
        
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Dots */}
        <circle cx="20" cy="140" r="4" fill="#00d4aa" />
        <circle cx="380" cy="25" r="4" fill="#00d4aa" />
      </svg>
    </div>
  )
}
