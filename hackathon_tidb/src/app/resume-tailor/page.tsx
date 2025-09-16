"use client";
import React, { useState } from "react";
import DragNDrop from "../components/DragNDrop";
import { useSession, signIn } from "next-auth/react";
 import dynamic from 'next/dynamic'

 const PdfRender = dynamic(() => import('../components/PdfRender'), { ssr: false });
const ResumeTailorPage = () => {
  const { data: session, status } = useSession();
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<string>('');
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Show login message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cream">
        <h1 className="text-2xl mb-4">Please log in to use Resume Tailor</h1>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const handleFileUpload = (file: File | null, base64?: string) => {
    setUploadedFile(file);
    if (base64) {
      setFileBase64(base64);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      alert("Please upload a file first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/resume", {
        // NEW: API call
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          fileSize: uploadedFile.size,
          base64Content: fileBase64, // NEW: Send base64 to database
          jobDescription: jobDescription,
        }),
      });
      const result = await response.json();
    
      if (response.ok) {
        alert('Resume optimized successfully!');
        setOptimizedResume(result.optimizedResume);
        setJobDescription("");
        setUploadedFile(null);
        setFileBase64("");
      }
    } catch (error) {
      alert("Error optimizing resume");
    } finally {
      setIsSubmitting(false);
    }


  };

  return (
    <div>
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center bg-cream overflow-hidden"
    >
      <DragNDrop onFileUpload={handleFileUpload} />
      <textarea
        name="description"
        id="description"
        placeholder="Enter your job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full max-w-xl h-40 p-3 m-3 border-2 border-gray-300 rounded-lg"
      ></textarea>

      <button
        type="submit"
        className=" text-lg text-navyblue bg-creamyblue px-4 py-2 m-3 rounded-md hover:bg-navyblue hover:text-creamyblue transition-all duration-300"
      >
        {" "}
        Tailor Your Resume{" "}
      </button>
    </form>
   {optimizedResume && ( <div className='flex flex-col bg-cream grid grid-cols-2'>
      <div className='flex flex-col items-center justify-center'>
      <PdfRender />
      </div>
      <div className='flex flex-col items-center justify-center'>
      <PdfRender />
      </div>
    </div>)}
    </div>

   
  );
};

export default ResumeTailorPage;
