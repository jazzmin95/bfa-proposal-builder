'use client'


import FileUploader from '@/components/FileUploader'

export default function Home() {
    const handleFileSelect = async (files: File[]) => {
        const file = files[0] // Get the first file
        // Handle the file upload here
        console.log('Selected file:', file)
    
        // Example: Upload to server
        try {
          const formData = new FormData()
          formData.append('file', file)
    
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
    
          if (!response.ok) {
            throw new Error('Upload failed')
          }
    
          console.log('File uploaded successfully')
        } catch (error) {
          console.error('Upload error:', error)
        }
      }
  return (
    <div className="h-full w-full flex items-center justify-center">
      <main className="flex flex-col items-center gap-8 w-full p-8">
        <h1 className="text-3xl font-semibold py-6">
          Start by uploading your RFP
        </h1>
        <FileUploader 
          onFileSelect={handleFileSelect}
          acceptedFileTypes={['.pdf','.doc','.docx']}
          maxSize={5 * 1024 * 1024} // 5MB
        />
      </main>
    </div>
  );
}
