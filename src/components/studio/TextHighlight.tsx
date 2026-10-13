import React from 'react';

export interface TextHighlightProps {
  children: React.ReactNode;
  color?: 'lime' | 'blue' | 'yellow';
  className?: string;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  color = 'lime',
  className = '',
}) => {
  const colorMap = {
    lime: 'bg-[#9DF71F] text-studio-ink',
    blue: 'bg-[#82CCFF] text-studio-ink',
    yellow: 'bg-[#FDE047] text-studio-ink',
  }[color];

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-[4px] font-bold mx-0.5 tracking-tight ${colorMap} ${className}`}
    >
      {children}
    </span>
  );
};
