
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesAccepted,
  maxFiles = 5,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    'application/pdf': ['.pdf'],
  },
  className,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
  }, [files, maxFiles, onFilesAccepted]);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    accept,
  });
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors text-center cursor-pointer",
          isDragActive && "bg-primary/5",
          isDragAccept && "border-primary/50 bg-primary/5",
          isDragReject && "border-destructive/50 bg-destructive/5",
          !isDragActive && "hover:bg-accent",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Upload Receipts</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Drop your receipt files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports images (JPG, PNG) and PDF files
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium mb-3">Uploaded Files ({files.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-accent/50 rounded-md p-2 pr-3 group animate-fade-in">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[180px] sm:max-w-xs">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-destructive/10"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button size="sm" className="gap-1.5">
              <Check className="h-4 w-4" />
              <span>Process Receipts</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
