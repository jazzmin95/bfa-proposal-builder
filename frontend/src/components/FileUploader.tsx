import React, { useCallback, useState } from "react";
import { Progress } from "@nextui-org/react";
import { Card, Space } from "antd";
import { useDropzone } from "react-dropzone";
import { FileFilled } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  maxSize = 10485760,
  isUploading = false,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      if (onFileSelect) {
        onFileSelect(acceptedFiles);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });
  return (
    <>
      <Space direction="vertical" size="small">
        <Card
          style={{ width: 300 }}
          title="Start by uploading your RFP"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <FileFilled style={{ fontSize: "48px", padding: "16px",  cursor: "pointer" }} />

          <Title level={5}>
            Drag and drop your files here or click to browse
          </Title>

          {isUploading && (
            <Progress
              size="sm"
              value={uploadProgress}
              color="primary"
              className="max-w-md"
            />
          )}
        </Card>{" "}
        <Card style={{ width: 300 }}>
          <span key="status">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}{" "}
            {isUploading ? "uploading..." : "selected"}
            <p key="files">
              {uploadedFiles.length > 0 &&
                !isUploading &&
                uploadedFiles.map((file, index) => (
                  <span key={index}>{file.name}</span>
                ))}
            </p>
          </span>
        </Card>
      </Space>
    </>
  );
};

export default FileUploader;
