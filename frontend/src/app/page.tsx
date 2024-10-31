'use client'

import { Button, Card, ConfigProvider, Space, Typography } from 'antd';
import FileUploader from '@/components/FileUploader'
import { notification } from 'antd';
import { useState } from 'react'
import axios from 'axios';

export default function Home() {
    const [response, setResponse] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileSelect = async (files: File[]) => {
        const file = files[0]
        console.log(file)
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('proposal_type', 'research')
    
          const response = await axios.post('http://localhost:8000/upload_RFP', formData, {
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              setUploadProgress(progress);
            },
          });
    
          if (response.status !== 200) {
            throw new Error('Upload failed')
          }
    
          const data = response.data
          setResponse(data.result)
          api.success({
            message: 'Success',
            description: 'File uploaded successfully'
          });
        } catch (error) {
          api.error({
            message: 'Error',
            description: error instanceof Error ? error.message : 'An unknown error occurred'
          });
        } finally {
          setIsUploading(false);
        }
    }
    
    return (
      <ConfigProvider>
        {contextHolder}
        <div>
          <Space
            direction="vertical"
            style={{
              minHeight: "100vh",
              display: "flex",
              padding: "4rem 10rem",
              alignItems: "center",
            }}
          >
            <Typography.Title
              level={2}
              style={{
                fontFamily: "Lexend",
                fontWeight: "500",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              BFA Proposal Builder
            </Typography.Title>
            <Card
              style={{
                backgroundColor: "#f5f5f5",
                width: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem"
              }}
            >
              <Space align="center">
                <Button shape="circle" type="default">
                  1
                </Button>
                <Typography.Title
                  level={4}
                  style={{
                    fontFamily: "Space Mono",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  Let&apos;s start by uploading your RFP
                </Typography.Title>
              </Space>
              <FileUploader
                onFileSelect={handleFileSelect}
                maxSize={5 * 1024 * 1024}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
              {response && <p className="mt-4 max-w-2xl text-lg">{response}</p>}
            </Card>
          </Space>
        </div>
      </ConfigProvider>
    );
}
