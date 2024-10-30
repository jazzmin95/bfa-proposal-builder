'use client'

import FileUploader from '@/components/FileUploader'
import { useState } from 'react'

export default function Home() {
    const [response, setResponse] = useState<string>('');

    const handleFileSelect = async (files: File[]) => {
        const file = files[0]
        
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('proposal_type', 'research')
    
          const response = await fetch('http://localhost:8000/upload_RFP', {
            method: 'POST',
            body: formData,
          })
    
          if (!response.ok) {
            throw new Error('Upload failed')
          }
    
          const data = await response.json()
          setResponse(data.result)
        } catch (error) {
          console.error('Upload error:', error)
          setResponse('Error uploading file')
        }
    }
    
    return (
      <div className="h-full w-full flex items-center justify-center">
        <main className="flex flex-col items-center gap-10 w-full p-10">
          <FileUploader 
            onFileSelect={handleFileSelect}
            acceptedFileTypes={['.pdf','.doc','.docx']}
            maxSize={5 * 1024 * 1024}
          />
          {response && (
            <p className="mt-4 max-w-2xl text-lg">{response}</p>
          )}
        </main>
      </div>
    );
}
