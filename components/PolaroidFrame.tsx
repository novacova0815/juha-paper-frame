import React from 'react';
import { PhotoIcon } from './Icons';
import { TitleColor } from '../types';

interface PolaroidFrameProps {
  image: string | null;
  title: string;
  subtitle: string;
  titleColor: TitleColor;
}

const colorClassMap: Record<TitleColor, string> = {
  orange: 'text-orange-600',
  brown: 'text-amber-800',
  navy: 'text-blue-900',
  pink: 'text-pink-600',
  black: 'text-gray-800',
};

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({ image, title, subtitle, titleColor }) => {
  return (
    <div className="bg-amber-50 rounded-lg shadow-xl border border-gray-300 w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 aspect-square relative overflow-hidden">
      
      {/* Image Container: Mimics the padding and shadow from the canvas output */}
      <div 
        className="absolute bg-gray-100 flex items-center justify-center"
        style={{
            top: '5%', // 60px on 1200px canvas
            left: '5%',
            width: '90%', // 1080px on 1200px canvas
            height: '67.5%', // 810px on 1200px canvas (4:3 aspect ratio of 1080px)
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
        role="img"
        aria-label="Image preview area"
      >
        {image ? (
          <img src={image} alt="User uploaded content preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 p-8">
            <PhotoIcon className="w-16 h-16 mx-auto mb-4" />
            <p>Upload an image to see the magic!</p>
          </div>
        )}
      </div>

      {/* Text Area: Fills the space below the image */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex flex-col text-center"
        style={{ top: '72.5%' /* 5% top padding + 67.5% image height */ }}
      >
        {/* Main text content (subtitle & title), centered in the available space */}
        <div className="flex-grow flex flex-col justify-center items-center px-4">
          <p className="text-xl sm:text-2xl" style={{ color: '#333' }}>
            {subtitle}
          </p>
          <h2 className={`text-3xl sm:text-4xl mt-2 break-words ${colorClassMap[titleColor]}`} style={{ fontFamily: "'Gowun Dodum', sans-serif" }}>
            {title}
          </h2>
        </div>
        
        {/* Copyright, aligned to the bottom */}
        <div className="text-center text-xs text-gray-500 pb-2 sm:pb-3">
          COPYRIGHT © 우리집도서관
        </div>
      </div>
    </div>
  );
};
