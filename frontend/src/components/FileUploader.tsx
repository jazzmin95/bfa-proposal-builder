import React, { useCallback } from "react";
import { Progress, Typography, Card, Space } from "antd";
import { FileFilled } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  maxSize = 10485760,
  isUploading = false,
  uploadProgress = 0,
  acceptedFileTypes = [".pdf", ".doc", ".docx"],
}) => {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
    <Space direction="vertical">
      <div {...getRootProps()}>
        <Card style={{ width: "100%", margin: "1rem 0 0 0" }}>
          <input {...getInputProps()} />
          <FileFilled
            style={{ fontSize: "48px", padding: "16px", cursor: "pointer" }}
          />
          <Typography.Title
            level={5}
            style={{ fontFamily: "Lexend", fontWeight: 400, lineHeight: 1.6 }}
          >
            Drag and drop your files here or click to browse
          </Typography.Title>

          {isUploading && (
            <Progress percent={uploadProgress} className="max-w-md" />
          )}
        </Card>
      </div>

      <Typography.Text
        style={{ fontSize: "12px", fontFamily: "Lexend", fontWeight: 600, padding: "0 1rem", textTransform: "uppercase" }}
      >
        Accepted file types: {acceptedFileTypes?.join(", ")}
      </Typography.Text>
    </Space>
  );
};

export default FileUploader;
