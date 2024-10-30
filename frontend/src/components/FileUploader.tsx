import React, { useCallback, useState } from 'react';
import { Card, CardBody, CardFooter, Divider, Progress } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  maxSize = 10485760, // 10MB default
  acceptedFileTypes = ['image/*', 'application/pdf'],
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadProgress(0);
    setUploadedFiles(acceptedFiles);
    if (onFileSelect) {
      onFileSelect(acceptedFiles);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });
  return (
    <Card>
    <CardBody>
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 cursor-pointer transition-all duration-200 ${
          isDragging || isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-4xl text-gray-400">
            📁
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              Drag and drop your files here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse
            </p>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress
              size="sm"
              value={uploadProgress}
              color="primary"
              className="max-w-md"
            />
          )}
        </div>
    </div></div>
    </CardBody>
    <Divider/>
    <CardFooter> 
      <div className="p-4 bg-transparent">
        <p className="text-sm text-gray-600 mb-2">
          {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} {uploadProgress === 100 ? 'uploaded' : 'selected'}
        </p>
        {uploadedFiles.length > 0 && uploadProgress === 100 && (
          uploadedFiles.map((file, index) => (
            <div key={index} className="text-sm">
              {file.name}
            </div>
          ))
        )}
      </div>
    </CardFooter>
    </Card>
  );
};

export default FileUploader;
