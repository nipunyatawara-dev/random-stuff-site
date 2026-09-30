import React from 'react';
import Image from 'next/image';

export interface PolaroidCardProps {
  imageSrc?: string;
  caption: string;
  pinType?: 'red-pin' | 'green-pin' | 'tape' | 'paperclip' | 'none';
  rotation?: number; // angle in deg e.g. -6, 4, -10
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageSrc,
  caption,
  pinType = 'red-pin',
  rotation = 0,
  className = '',
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative inline-block bg-white p-3 pb-5 rounded-2xl shadow-studio-polaroid border border-black/5 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-20 cursor-pointer select-none ${className}`}
    >
      {/* Decorative Physical Fasteners */}
      {pinType === 'red-pin' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-800 shadow-inner flex items-center justify-center border border-red-300/50">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        </div>
      )}

      {pinType === 'green-pin' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#B8FF3D] via-[#89E00F] to-[#5CA800] shadow-inner flex items-center justify-center border border-white/60">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        </div>
      )}

      {pinType === 'tape' && (
        <div className="absolute -top-2.5 left-6 z-30 w-16 h-5 bg-[#EBD8B8]/80 backdrop-blur-xs border border-white/30 rotate-[-4deg] shadow-xs" />
      )}

      {pinType === 'paperclip' && (
        <div className="absolute -top-3.5 right-4 z-30 w-4 h-9 rounded-full border-2 border-slate-400 bg-transparent shadow-xs" />
      )}

      {/* Image or Visual Canvas */}
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F0F4F8] flex items-center justify-center relative">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={caption}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
            unoptimized
          />
        ) : (
          children || (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100 flex items-center justify-center text-slate-400 text-xs font-mono">
              Photo Canvas
            </div>
          )
        )}
      </div>

      {/* Handwritten Caption */}
      <div className="mt-3 text-center">
        <span className="font-caveat text-xl md:text-2xl text-[#14334D] font-bold tracking-wide">
          {caption}
        </span>
      </div>
    </div>
  );
};
