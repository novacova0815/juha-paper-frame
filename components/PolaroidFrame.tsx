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
    <div className="bg-amber-50 rounded-lg shadow-2xl border border-gray-200 p-4 w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 aspect-square flex flex-col">
      <div 
        className="bg-gray-100 border-2 border-gray-200 flex items-center justify-center w-full aspect-[4/3] relative shadow-md"
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
      <div className="flex-grow pt-4 text-center flex flex-col justify-between">
        <div>
           <p className="inline-block text-lg sm:text-xl bg-yellow-200 text-yellow-800 px-3 sm:px-4 py-1 rounded-md mb-2 sm:mb-3">
            {subtitle}
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold break-words ${colorClassMap[titleColor]}`} style={{ fontFamily: "'Gowun Dodum', sans-serif" }}>
            {title}
          </h2>
        </div>
        <div className="text-center text-xs text-gray-500">
          COPYRIGHT © 우리집도서관
        </div>
      </div>
    </div>
  );
};