import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { analyzeResumeAndJobDescription, extractTextFromPDF } from "@/lib/llm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType, fileSize, base64Content, jobDescription } =
      await request.json();

    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
    // Extract text from PDF
    const resumeText = await extractTextFromPDF(base64Content);

    // Generate optimized resume
    const optimizedResume = await analyzeResumeAndJobDescription(
      resumeText,
      jobDescription
    );

    // Save both original and optimized resume
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName,
        fileType,
        fileSize,
        base64Content,
        jobDescription,
        optimizedResume, // Add this field to your schema
        originalResumeText: resumeText, // Add this field to your schema
      },
    });

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      optimizedResume,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
