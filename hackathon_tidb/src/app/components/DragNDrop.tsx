"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';

interface DragNDropProps {
  onFileUpload: (file: File | null, base64?: string) => void;
}

const DragNDrop = ({ onFileUpload }: DragNDropProps) => {
  const [uppy, setUppy] = useState<Uppy | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:type;base64, prefix
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };
 
  const handleFileUpload = useCallback(async (file: any) => {
    const fileData = file.data as File;
    setCurrentFile(fileData);
    try {
      const base64 = await convertToBase64(fileData);
      onFileUpload(fileData, base64);
    } catch (error) {
      console.error('Error converting to base64:', error);
      onFileUpload(fileData);
    }
  }, [onFileUpload]);

  useEffect(() => {
    const newUppy = new Uppy({
      restrictions: {
        allowedFileTypes: ['.pdf', '.doc', '.docx'],
        maxFileSize: 10 * 1024 * 1024,
        maxNumberOfFiles: 1
      }
    }).use(DragDrop, { 
      target: '#drag-drop',
      width: '100%',
      height: '200px'
    });

    newUppy.on('file-added', handleFileUpload);

    newUppy.on('file-removed', () => {
      setCurrentFile(null);
      onFileUpload(null);
    });

    setUppy(newUppy);

    return () => {
      if (newUppy) {
        newUppy.getFiles().forEach(file => {
          newUppy.removeFile(file.id);
        });
      }
    };
  }, []); // Remove onFileUpload from dependencies

  const removeFile = () => {
    if (uppy && currentFile) {
      const files = uppy.getFiles();
      if (files.length > 0) {
        uppy.removeFile(files[0].id);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto m-6">
      <div id="drag-drop" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-gray-500">Drag and drop files here</p>
        <p className="text-sm text-gray-400 mt-2">PDF, DOC, DOCX (max 10MB)</p>
        
        {/* Show uploaded file info */}
        {uppy && uppy.getFiles().length > 0 && (
          <div className="mt-4 text-left">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-700">
                <strong>File:</strong> {uppy.getFiles()[0].name}
              </p>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 text-sm mt-2"
              >
                Remove File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragNDrop;