'use client';
import { useState } from 'react';
import { PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label = "Image", placeholder = "Enter image URL or upload file" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Toggle Upload Method */}
      <div className="flex space-x-4 mb-3">
        <label className="flex items-center">
          <input
            type="radio"
            value="url"
            checked={uploadMethod === 'url'}
            onChange={() => setUploadMethod('url')}
            className="mr-2"
          />
          <span className="text-sm">URL</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="upload"
            checked={uploadMethod === 'upload'}
            onChange={() => setUploadMethod('upload')}
            className="mr-2"
          />
          <span className="text-sm">Upload File</span>
        </label>
      </div>

      {uploadMethod === 'url' ? (
        /* URL Input */
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      ) : (
        /* File Upload */
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <span className="text-sm text-gray-500">or drag and drop</span>
          </div>
          
          {value && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Generated URL will appear here"
            />
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-3">
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute inset-0 items-center justify-center bg-gray-100 hidden">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
      </p>
    </div>
  );
}