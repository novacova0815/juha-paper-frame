
import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import { PolaroidFrame } from './components/PolaroidFrame';
import { ControlsPanel } from './components/ControlsPanel';
import { UploadIcon } from './components/Icons';
import { OutputFormat, OutputSize, TitleColor } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('우리집 도서관');
  const [subtitle, setSubtitle] = useState('Reading Together, Growing Together');
  const [outputSize, setOutputSize] = useState<OutputSize>(1200);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('webp');
  const [fileName, setFileName] = useState('우리집_도서관');
  const [isFileNameManuallyEdited, setIsFileNameManuallyEdited] = useState(false);
  const [titleColor, setTitleColor] = useState<TitleColor>('pink');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFileNameManuallyEdited) {
      const newFileName = title.replace(/[\\/?%*:|"<>.]/g, '_').replace(/\s+/g, '_');
      setFileName(newFileName || 'image');
    }
  }, [title, isFileNameManuallyEdited]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError('Could not process image.');
            return;
          }

          const targetAspectRatio = 4 / 3;
          let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
          const sourceAspectRatio = img.width / img.height;

          if (sourceAspectRatio > targetAspectRatio) { // Wider than 4:3, crop sides
            sourceWidth = img.height * targetAspectRatio;
            sourceX = (img.width - sourceWidth) / 2;
          } else { // Taller than 4:3, crop top/bottom
            sourceHeight = img.width / targetAspectRatio;
            sourceY = (img.height - sourceHeight) / 2;
          }
          
          canvas.width = 1200; // A base 4:3 size for the preview image data
          canvas.height = 900;

          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 1200, 900);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setImage(dataUrl);
        };
        img.onerror = () => {
          setError('Could not load image file.');
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
    if(e.target) e.target.value = '';
  };

  const handleDownload = useCallback(async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      await document.fonts.load('62px "Gowun Dodum"');
      await document.fonts.load('48px "Gowun Dodum"');
      await document.fonts.load('20px "Gowun Dodum"');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const colorMap: Record<TitleColor, string> = {
        orange: '#f97316',
        brown: '#78350f',
        navy: '#1e3a8a',
        pink: '#db2777',
        black: '#1f2937',
      };

      const scale = outputSize / 1200;
      canvas.width = outputSize;
      canvas.height = outputSize;

      if (outputFormat === 'jpeg' || outputFormat === 'webp') {
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      const shadowPadding = 30 * scale;
      const frameSize = outputSize - (shadowPadding * 2);
      const frameX = shadowPadding;
      const frameY = shadowPadding;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 15 * scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10 * scale;
      
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(frameX, frameY, frameSize, frameSize);
      ctx.restore();

      const contentScale = frameSize / 1200;

      const img = new Image();
      img.src = image;

      img.onload = () => {
        const padding = 60 * contentScale;
        const imageWidth = frameSize - (padding * 2);
        const imageHeight = imageWidth * (3 / 4);
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8 * contentScale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4 * contentScale;
        ctx.drawImage(img, frameX + padding, frameY + padding, imageWidth, imageHeight);
        ctx.restore();

        const textStartY = padding + imageHeight;
        const remainingSpace = frameSize - textStartY;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const subtitleY = textStartY + remainingSpace * 0.35;
        ctx.fillStyle = '#333333';
        ctx.font = `${48 * contentScale}px "Gowun Dodum"`;
        ctx.fillText(subtitle, frameX + frameSize / 2, frameY + subtitleY);

        const copyrightY = frameSize - (25 * contentScale);
        const titleY = subtitleY + (copyrightY - subtitleY) / 2;
        
        ctx.fillStyle = colorMap[titleColor];
        ctx.font = `${62 * contentScale}px "Gowun Dodum"`;
        ctx.fillText(title, frameX + frameSize / 2, frameY + titleY);
        
        const copyrightX = frameSize / 2;
        ctx.fillStyle = '#6b7280';
        ctx.font = `${20 * contentScale}px "Gowun Dodum"`;
        ctx.fillText('COPYRIGHT © 우리집도서관', frameX + copyrightX, frameY + copyrightY);

        const dataUrl = canvas.toDataURL(`image/${outputFormat}`, outputFormat === 'jpeg' ? 0.92 : undefined);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setError('Failed to load image for download.');
        setIsProcessing(false);
      };

    } catch (err) {
        console.error(err);
        setError(`An error occurred during download: ${err instanceof Error ? err.message : String(err)}`);
        setIsProcessing(false);
    }
  }, [image, title, subtitle, outputSize, outputFormat, fileName, titleColor]);

  return (
    <div className="bg-orange-50 min-h-screen" style={{ fontFamily: "'Gowun Dodum', sans-serif" }}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-800 tracking-tight">Juha's Paper Frame</h1>
          <p className="text-orange-600 mt-2 text-lg">우리집 도서관 스튜디오</p>
        </header>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-4xl mx-auto" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3 flex flex-col items-center gap-6">
            <PolaroidFrame image={image} title={title} subtitle={subtitle} titleColor={titleColor} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
              aria-hidden="true"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              aria-label={image ? 'Change image' : 'Upload image'}
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              {image ? 'Change Image' : 'Upload Image'}
            </button>
          </div>
          <div className="lg:col-span-2">
            <ControlsPanel
              title={title}
              setTitle={setTitle}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              outputSize={outputSize}
              setOutputSize={setOutputSize}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              fileName={fileName}
              setFileName={setFileName}
              setIsFileNameManuallyEdited={setIsFileNameManuallyEdited}
              titleColor={titleColor}
              setTitleColor={setTitleColor}
              handleDownload={handleDownload}
              isProcessing={isProcessing}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
