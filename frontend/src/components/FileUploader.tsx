import React, { useCallback, useState } from 'react';
import { Card, CardBody, CardFooter, Divider, Progress } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number;
  acceptedFileTypes?: string[];
  isUploading?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  maxSize = 10485760, 
  isUploading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    if (onFileSelect) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });
  return (
    <Card>
    <CardBody>
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        aria-label="File upload dropzone"
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
          {isUploading && (
            <Progress
              size="sm"
              isIndeterminate
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
          {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} {isUploading ? 'uploading...' : 'selected'}
        </p>
        {uploadedFiles.length > 0 && !isUploading && (
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
