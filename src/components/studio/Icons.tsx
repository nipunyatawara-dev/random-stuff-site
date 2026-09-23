import React from 'react';

export const GoogleMeetIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M15 12L19.5 8.5V15.5L15 12Z" fill="#00832D" />
    <path d="M4 7C4 5.89543 4.89543 5 6 5H13C14.1046 5 15 5.89543 15 7V17C15 18.1046 14.1046 19 13 19H6C4.89543 19 4 18.1046 4 17V7Z" fill="#0066DA" />
    <path d="M4 17L15 7V17H4Z" fill="#2684FC" />
    <path d="M4 7H15V10H4V7Z" fill="#00AC47" />
    <path d="M4 14H15V17H4V14Z" fill="#FFBA00" />
    <path d="M15 10L19.5 7V17L15 14V10Z" fill="#EA4335" />
    <path d="M15 12L19.5 8.5V15.5L15 12Z" fill="#00832D" />
  </svg>
);

export const ProjectsFolderIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M2.5 7.5C2.5 5.84315 3.84315 4.5 5.5 4.5H9.17157C9.96722 4.5 10.7303 4.81607 11.2929 5.37868L12.7071 6.79289C13.2697 7.3555 14.0328 7.67157 14.8284 7.67157H18.5C20.1569 7.67157 21.5 9.01472 21.5 10.6716V16.5C21.5 18.1569 20.1569 19.5 18.5 19.5H5.5C3.84315 19.5 2.5 18.1569 2.5 16.5V7.5Z"
      fill="#2563EB"
    />
    <path
      d="M2.5 10.5C2.5 8.84315 3.84315 7.5 5.5 7.5H18.5C20.1569 7.5 21.5 8.84315 21.5 10.5V16.5C21.5 18.1569 20.1569 19.5 18.5 19.5H5.5C3.84315 19.5 2.5 18.1569 2.5 16.5V10.5Z"
      fill="#3B82F6"
    />
    <rect x="5.5" y="6.5" width="13" height="4" rx="1.5" fill="#60A5FA" opacity="0.6" />
  </svg>
);

export const TelegramIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 20,
  className = '',
  color = '#229ED9',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8L15.08 16.14C14.96 16.67 14.65 16.8 14.2 16.55L11.82 14.8L10.68 15.9C10.55 16.03 10.44 16.14 10.18 16.14L10.35 13.73L14.74 9.76C14.93 9.59 14.7 9.5 14.44 9.67L9.01 13.09L6.68 12.36C6.17 12.2 6.16 11.85 6.79 11.6L15.89 8.09C16.31 7.94 16.68 8.19 16.64 8.8Z"
      fill={color}
    />
  </svg>
);

export const DiscordIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      fill="#5865F2"
    />
  </svg>
);

export const OtterLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="otter-star-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B5FF2E" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
        <filter id="otter-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#89E00F" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ears */}
      <circle cx="28" cy="28" r="9" fill="#14334D" />
      <circle cx="28" cy="28" r="5" fill="#89E00F" />
      <circle cx="72" cy="28" r="9" fill="#14334D" />
      <circle cx="72" cy="28" r="5" fill="#89E00F" />

      {/* Head */}
      <ellipse cx="50" cy="46" rx="28" ry="24" fill="#14334D" />

      {/* Body / Chest */}
      <path
        d="M32 64 C26 72, 24 88, 30 94 C42 96, 58 96, 70 94 C76 88, 74 72, 68 64 Z"
        fill="#14334D"
      />
      {/* Cream Belly */}
      <ellipse cx="50" cy="78" rx="14" ry="14" fill="#FAFCFD" />
      <ellipse cx="50" cy="78" rx="11" ry="11" fill="#E8ECEF" />

      {/* Muzzle */}
      <ellipse cx="50" cy="52" rx="13" ry="9" fill="#FAFCFD" />
      {/* Nose */}
      <path d="M46 47 C48 45, 52 45, 54 47 C54 50, 46 50, 46 47 Z" fill="#14334D" />
      {/* Smile */}
      <path d="M46 51 Q50 55 54 51" stroke="#14334D" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Round Glasses */}
      <circle cx="39" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
      <circle cx="61" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
      <path d="M48.5 41 Q50 39 51.5 41" stroke="#89E00F" strokeWidth="3" strokeLinecap="round" />

      {/* Eyes & Catchlights */}
      <circle cx="39" cy="41" r="4.5" fill="#FFFFFF" />
      <circle cx="39.5" cy="41" r="2.5" fill="#14334D" />
      <circle cx="40.5" cy="40" r="1" fill="#FFFFFF" />

      <circle cx="61" cy="41" r="4.5" fill="#FFFFFF" />
      <circle cx="60.5" cy="41" r="2.5" fill="#14334D" />
      <circle cx="61.5" cy="40" r="1" fill="#FFFFFF" />

      {/* Whiskers */}
      <line x1="23" y1="50" x2="33" y2="52" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="55" x2="33" y2="55" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
      <line x1="77" y1="50" x2="67" y2="52" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="55" x2="67" y2="55" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />

      {/* Holding Star in Paw */}
      <g filter="url(#otter-glow)">
        <polygon
          points="74,62 77,71 86,74 77,77 74,86 71,77 62,74 71,71"
          fill="url(#otter-star-grad)"
        />
        <circle cx="74" cy="74" r="3" fill="#FFFFFF" />
      </g>
      {/* Paws */}
      <ellipse cx="66" cy="74" rx="4.5" ry="3.5" fill="#14334D" />
      <ellipse cx="34" cy="74" rx="4.5" ry="3.5" fill="#14334D" />
    </svg>
  </div>
);

export const ChameleonLogo = OtterLogo;
