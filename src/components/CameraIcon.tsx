import React from 'react';

interface CameraIconProps {
  size?: number;
  className?: string;
}

const CameraIcon: React.FC<CameraIconProps> = ({ size = 120, className = "" }) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Camera body shadow/depth */}
      <rect x="8" y="28" width="140" height="80" rx="8" fill="#1a1a1a" />
      
      {/* Main camera body */}
      <rect x="4" y="24" width="140" height="80" rx="8" fill="#2d2d2d" />
      
      {/* Top viewfinder bump */}
      <rect x="30" y="14" width="88" height="20" rx="4" fill="#2d2d2d" />
      <rect x="32" y="16" width="84" height="16" rx="2" fill="#1a1a1a" />
      
      {/* Flash */}
      <circle cx="130" cy="22" r="4" fill="#333333" />
      <circle cx="130" cy="22" r="2" fill="#ffffff" opacity="0.8" />
      
      {/* Lens mount */}
      <circle cx="74" cy="64" r="28" fill="#1a1a1a" />
      <circle cx="74" cy="64" r="24" fill="#333333" />
      
      {/* Lens elements */}
      <circle cx="74" cy="64" r="20" fill="#0a0a0a" />
      <circle cx="74" cy="64" r="18" fill="#1a1a1a" />
      <circle cx="74" cy="64" r="14" fill="#0a0a0a" />
      
      {/* Lens reflection */}
      <circle cx="70" cy="60" r="8" fill="url(#lensGradient)" />
      
      {/* Control buttons */}
      <rect x="120" y="45" width="12" height="6" rx="3" fill="#1a1a1a" />
      <rect x="120" y="55" width="12" height="6" rx="3" fill="#1a1a1a" />
      
      {/* Brand text area */}
      <rect x="15" y="45" width="35" height="8" rx="2" fill="#1a1a1a" />
      
      {/* Grip texture */}
      <rect x="8" y="70" width="20" height="25" fill="#1a1a1a" />
      <path d="M10 72 L26 72 M10 76 L26 76 M10 80 L26 80 M10 84 L26 84 M10 88 L26 88 M10 92 L26 92" 
            stroke="#333333" strokeWidth="0.5" />
      
      {/* Gradients */}
      <defs>
        <radialGradient id="lensGradient" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#357abd" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2d5aa0" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default CameraIcon;
