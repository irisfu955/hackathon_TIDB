import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeResumeAndJobDescription(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  try {
    const prompt = `
You are an expert resume writer and career coach. Analyze the provided resume and job description, then generate an optimized resume that:

1. Highlights relevant skills and experiences for the specific job
2. Uses keywords from the job description
3. Quantifies achievements where possible
4. Matches the job requirements
5. Maintains professional formatting

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please generate an optimized resume that better matches this job opportunity. Focus on:
- Relevant skills and experiences
- Keywords from the job description
- Quantified achievements
- Professional formatting
- ATS-friendly structure

Return the optimized resume in a clear, professional format.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and career coach specializing in optimizing resumes for specific job opportunities."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Error generating optimized resume';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate optimized resume');
  }
}

export async function extractTextFromPDF(base64Content: string): Promise<string> {
  try {
    const prompt = `
Extract all text content from this PDF resume. Return only the text content, maintaining the structure and formatting as much as possible.

PDF Content (Base64): ${base64Content}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting text from PDF documents. Extract all text content while maintaining structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Error extracting text from PDF';
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}