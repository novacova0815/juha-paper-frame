import React, { Dispatch, SetStateAction } from 'react';
import { OutputFormat, OutputSize, TitleColor } from '../types';
import { DownloadIcon } from './Icons';

interface ControlsPanelProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  subtitle: string;
  setSubtitle: Dispatch<SetStateAction<string>>;
  outputSize: OutputSize;
  setOutputSize: Dispatch<SetStateAction<OutputSize>>;
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
  setIsFileNameManuallyEdited: Dispatch<SetStateAction<boolean>>;
  titleColor: TitleColor;
  setTitleColor: Dispatch<SetStateAction<TitleColor>>;
  handleDownload: () => void;
  isProcessing: boolean;
}

const ControlWrapper: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-orange-700 text-sm font-bold mb-2">{title}</label>
    {children}
  </div>
);

const TextInput: React.FC<{ id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ id, value, onChange, placeholder }) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-shadow"
  />
);

const SelectInput: React.FC<{ id: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ id, value, onChange, children }) => (
    <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-white border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-shadow appearance-none"
        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em' }}
    >
        {children}
    </select>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = (props) => {
  const colorOptions: { name: TitleColor; bg: string; ring: string }[] = [
      { name: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-500' },
      { name: 'brown', bg: 'bg-amber-800', ring: 'ring-amber-800' },
      { name: 'navy', bg: 'bg-blue-900', ring: 'ring-blue-900' },
      { name: 'pink', bg: 'bg-pink-600', ring: 'ring-pink-600' },
      { name: 'black', bg: 'bg-gray-800', ring: 'ring-gray-800' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 sticky top-8">
      <h3 className="text-2xl font-bold text-orange-800 mb-6 border-b-2 border-orange-200 pb-3">Customize Your Frame</h3>
      
      <ControlWrapper title="Subtitle (Upper Line)" id="subtitle-input">
        <TextInput id="subtitle-input" value={props.subtitle} onChange={(e) => props.setSubtitle(e.target.value)} placeholder="e.g., Reading Together, Growing Together" />
      </ControlWrapper>

      <ControlWrapper title="Title (Center Line)" id="title-input">
        <TextInput id="title-input" value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="e.g., 우리집 도서관" />
      </ControlWrapper>

      <ControlWrapper title="Title Color" id="color-select">
        <div className="flex space-x-3 pt-1">
          {colorOptions.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => props.setTitleColor(opt.name)}
              className={`w-8 h-8 rounded-full ${opt.bg} transition-all transform hover:scale-110 focus:outline-none ${props.titleColor === opt.name ? `ring-2 ring-offset-2 ${opt.ring}` : 'ring-2 ring-transparent'}`}
              aria-label={`Select ${opt.name} color`}
            />
          ))}
        </div>
      </ControlWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlWrapper title="Image Size" id="size-select">
          <SelectInput id="size-select" value={props.outputSize} onChange={(e) => props.setOutputSize(Number(e.target.value) as OutputSize)}>
            <option value={1200}>1200px</option>
            <option value={800}>800px</option>
            <option value={400}>400px</option>
          </SelectInput>
        </ControlWrapper>
        <ControlWrapper title="Image Format" id="format-select">
          <SelectInput id="format-select" value={props.outputFormat} onChange={(e) => props.setOutputFormat(e.target.value as OutputFormat)}>
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </SelectInput>
        </ControlWrapper>
      </div>

      <ControlWrapper title="File Name" id="filename-input">
        <TextInput 
          id="filename-input"
          value={props.fileName} 
          onChange={(e) => {
            props.setFileName(e.target.value);
            props.setIsFileNameManuallyEdited(true);
          }} 
          placeholder="e.g., my_polaroid_image"
        />
      </ControlWrapper>

      <button
        onClick={props.handleDownload}
        disabled={props.isProcessing}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:bg-orange-300 disabled:cursor-not-allowed disabled:scale-100"
        aria-label="Download the customized image"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        {props.isProcessing ? 'Processing...' : 'Download Image'}
      </button>
    </div>
  );
};
