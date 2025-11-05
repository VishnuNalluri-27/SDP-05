import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const dimensions = {
    sm: { width: 140, height: showText ? 180 : 140, scale: 0.6 },
    md: { width: 180, height: showText ? 220 : 180, scale: 0.8 },
    lg: { width: 220, height: showText ? 260 : 220, scale: 1.0 }
  };

  const { width, height, scale } = dimensions[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ transform: `scale(${scale})` }}>
        <svg
          width="220"
          height="200"
          viewBox="0 0 220 200"
          className="drop-shadow-xl"
        >
          {/* Outer Circular Background */}
          <circle
            cx="110"
            cy="100"
            r="95"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          
          {/* Golden Ring */}
          <circle
            cx="110"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="4"
          />
          
          {/* Inner Background */}
          <circle
            cx="110"
            cy="100"
            r="82"
            fill="#fefdfb"
          />
          
          {/* Main Title Arc */}
          <path
            id="topArc"
            d="M 50 100 A 60 60 0 0 1 170 100"
            fill="none"
          />
          <text fontSize="16" fontWeight="bold" fill="#ff9933">
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              SAMVIDHAN
            </textPath>
          </text>
          
          {/* Central Emblem Base Circle */}
          <circle
            cx="110"
            cy="100"
            r="45"
            fill="url(#emblemGradient)"
            stroke="#d4af37"
            strokeWidth="2"
          />
          
          {/* Constitutional Book in Center */}
          <g transform="translate(110, 100)">
            {/* Book Base */}
            <rect x="-25" y="-8" width="50" height="16" fill="#8b4513" rx="2" />
            <rect x="-24" y="-7" width="23" height="14" fill="#faf8f5" rx="1" />
            <rect x="1" y="-7" width="23" height="14" fill="#faf8f5" rx="1" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#654321" strokeWidth="2" />
            
            {/* Constitution Text on Book */}
            <text x="0" y="-2" fontSize="6" fill="#1e3a8a" textAnchor="middle" fontWeight="bold">संविधान</text>
            <text x="0" y="4" fontSize="5" fill="#1e3a8a" textAnchor="middle">Constitution</text>
          </g>
          
          {/* Tricolor Elements Around the Circle */}
          <g transform="translate(110, 100)">
            {/* Saffron Elements */}
            <rect x="-60" y="-25" width="8" height="50" fill="#ff9933" transform="rotate(0)" />
            <rect x="-25" y="-60" width="50" height="8" fill="#ff9933" transform="rotate(0)" />
            <rect x="52" y="-25" width="8" height="50" fill="#ff9933" transform="rotate(0)" />
            <rect x="-25" y="52" width="50" height="8" fill="#ff9933" transform="rotate(0)" />
            
            {/* White Elements */}
            <rect x="-52" y="-25" width="8" height="50" fill="white" stroke="#e5e7eb" strokeWidth="1" />
            <rect x="-25" y="-52" width="50" height="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
            <rect x="44" y="-25" width="8" height="50" fill="white" stroke="#e5e7eb" strokeWidth="1" />
            <rect x="-25" y="44" width="50" height="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Green Elements */}
            <rect x="-44" y="-25" width="8" height="50" fill="#138808" />
            <rect x="-25" y="-44" width="50" height="8" fill="#138808" />
            <rect x="36" y="-25" width="8" height="50" fill="#138808" />
            <rect x="-25" y="36" width="50" height="8" fill="#138808" />
          </g>
          
          {/* Ashoka Chakra */}
          <circle cx="110" cy="55" r="15" fill="none" stroke="#000080" strokeWidth="2" />
          <circle cx="110" cy="55" r="12" fill="none" stroke="#000080" strokeWidth="1" />
          <circle cx="110" cy="55" r="3" fill="#000080" />
          
          {/* Chakra Spokes */}
          <g transform="translate(110, 55)">
            {Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1="-12"
                x2="0"
                y2="-15"
                stroke="#000080"
                strokeWidth="1"
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>
          
          {/* "360" in a Modern Circle */}
          <circle
            cx="110"
            cy="145"
            r="20"
            fill="url(#threeSixtyGradient)"
            stroke="#d4af37"
            strokeWidth="2"
          />
          <text
            x="110"
            y="152"
            fontSize="18"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
          >
            360
          </text>
          
          {/* Justice Scale Icon */}
          <g transform="translate(160, 80)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#8b4513" strokeWidth="2" />
            <line x1="-8" y1="5" x2="8" y2="5" stroke="#8b4513" strokeWidth="1.5" />
            <circle cx="-6" cy="8" r="3" fill="none" stroke="#d4af37" strokeWidth="1" />
            <circle cx="6" cy="8" r="3" fill="none" stroke="#d4af37" strokeWidth="1" />
            <line x1="-6" y1="5" x2="-6" y2="8" stroke="#8b4513" strokeWidth="1" />
            <line x1="6" y1="5" x2="6" y2="8" stroke="#8b4513" strokeWidth="1" />
          </g>
          
          {/* Knowledge Lamp */}
          <g transform="translate(60, 80)">
            <rect x="-2" y="5" width="4" height="15" fill="#8b4513" rx="2" />
            <ellipse cx="0" cy="5" rx="4" ry="2" fill="#d4af37" />
            <path d="M0 5 Q-2 0 0 -5 Q2 0 0 5" fill="#ff6b35" />
            <path d="M0 2 Q-1 0 0 -2 Q1 0 0 2" fill="#ffd23f" />
          </g>
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
            
            <radialGradient id="emblemGradient" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#fefdfb" />
              <stop offset="100%" stopColor="#f8f6f0" />
            </radialGradient>
            
            <linearGradient id="threeSixtyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9933" />
              <stop offset="50%" stopColor="#138808" />
              <stop offset="100%" stopColor="#000080" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="mt-3">
          <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-2 rounded-full shadow-lg">
            <div className="text-center">
              <div className="font-bold text-lg leading-tight">
                SAMVIDHAN 360
              </div>
              <div className="text-sm opacity-90 leading-tight">
                संविधान शिक्षा मंच
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`drop-shadow-sm ${className}`}
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" fill="white" stroke="#e5e7eb" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#d4af37" strokeWidth="2" />
      <circle cx="50" cy="50" r="37" fill="#fefdfb" />
      
      {/* Central Constitution Book */}
      <rect x="35" y="45" width="30" height="10" fill="#8b4513" rx="1" />
      <rect x="36" y="46" width="13" height="8" fill="#faf8f5" />
      <rect x="51" y="46" width="13" height="8" fill="#faf8f5" />
      <line x1="50" y1="45" x2="50" y2="55" stroke="#654321" strokeWidth="1" />
      
      {/* 360 Badge */}
      <circle cx="50" cy="70" r="8" fill="url(#miniGradient)" />
      <text x="50" y="73" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">360</text>
      
      {/* Simplified Tricolor Elements */}
      <rect x="20" y="25" width="4" height="20" fill="#ff9933" />
      <rect x="25" y="25" width="4" height="20" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
      <rect x="30" y="25" width="4" height="20" fill="#138808" />
      
      <rect x="66" y="25" width="4" height="20" fill="#ff9933" />
      <rect x="71" y="25" width="4" height="20" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
      <rect x="76" y="25" width="4" height="20" fill="#138808" />
      
      {/* Ashoka Chakra */}
      <circle cx="50" cy="30" r="6" fill="none" stroke="#000080" strokeWidth="1" />
      <circle cx="50" cy="30" r="1" fill="#000080" />
      <g transform="translate(50, 30)">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            x1="0"
            y1="-5"
            x2="0"
            y2="-6"
            stroke="#000080"
            strokeWidth="0.5"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
      
      <defs>
        <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9933" />
          <stop offset="50%" stopColor="#138808" />
          <stop offset="100%" stopColor="#000080" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 text-gray-800 p-8 rounded-xl shadow-xl border-2 border-gold">
      <div className="flex items-center justify-center space-x-8">
        <div className="flex-shrink-0">
          <Logo size="lg" showText={false} />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            Samvidhan 360
          </h1>
          <p className="text-xl font-medium text-gray-700 mb-2">संविधान शिक्षा मंच</p>
          <p className="text-lg opacity-80">Complete Constitutional Education Platform</p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
            <span className="text-lg font-bold text-blue-800">सत्यमेव जयते</span>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Role-based Learning • Interactive Quizzes • Constitutional Library • AI Chat
          </div>
        </div>
      </div>
    </div>
  );
}