import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  cloudName: string;
  uploadPreset: string;
}

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
  progress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  cloudName,
  uploadPreset,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    return null;
  };

  const uploadToCloudinary = async (file: File, index: number): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      setFiles(prev => prev.map((f, i) =>
        i === index
          ? { ...f, status: 'success' as const, url: data.secure_url, progress: 100 }
          : f
      ));
    } catch (error) {
      setFiles(prev => prev.map((f, i) =>
        i === index
          ? {
              ...f,
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ));
    }
  };

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);

    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validatedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        validatedFiles.push({
          file,
          status: 'error',
          error,
        });
      } else {
        validatedFiles.push({
          file,
          status: 'pending',
        });
      }
    }

    setFiles(prev => [...prev, ...validatedFiles]);

    for (let i = 0; i < validatedFiles.length; i++) {
      if (validatedFiles[i].status === 'pending') {
        await uploadToCloudinary(validatedFiles[i].file, files.length + i);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getUploadedUrls = (): string[] => {
    return files
      .filter(f => f.status === 'success' && f.url)
      .map(f => f.url!);
  };

  const handleCompleteUpload = () => {
    const urls = getUploadedUrls();
    if (onUploadComplete) {
      onUploadComplete(urls);
    }
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }
        `}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          {isDragging ? 'Drop files here' : 'Upload Files'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Drag and drop files or click to browse
        </p>
        <button
          type="button"
          onClick={handleUploadClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <p className="text-xs text-slate-400 mt-4">
          Supported formats: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} (Max {maxSizeMB}MB each, up to {maxFiles} files)
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-slate-900">Uploaded Files</h4>
              <p className="text-sm text-slate-600">
                {successCount} successful, {uploadingCount} uploading, {errorCount} failed
              </p>
            </div>
            {successCount > 0 && (
              <button
                type="button"
                onClick={handleCompleteUpload}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirm Upload
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {files.map((fileItem, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {fileItem.status === 'success' && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    {fileItem.status === 'error' && (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    )}
                    {fileItem.status === 'uploading' && (
                      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    )}
                    {fileItem.status === 'pending' && (
                      <File className="h-6 w-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-slate-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                      {fileItem.status === 'success' && (
                        <span className="text-xs text-green-600 font-medium">Uploaded</span>
                      )}
                      {fileItem.status === 'uploading' && (
                        <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                      )}
                      {fileItem.status === 'error' && (
                        <span className="text-xs text-red-600 font-medium">{fileItem.error}</span>
                      )}
                    </div>
                    {fileItem.status === 'uploading' && fileItem.progress !== undefined && (
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
