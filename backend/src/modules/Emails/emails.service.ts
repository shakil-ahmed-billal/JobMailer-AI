import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import {
  AIProvider,
  EmailSendStatus,
  EmailType,
} from "../../../generated/prisma/client";
import { emailTransporter } from "../../config/email.config";
import { geminiConfig } from "../../config/gemini.config";
import { openaiConfig } from "../../config/openai.config";
import { prisma } from "../../lib/prisma";

const openai = new OpenAI({ apiKey: openaiConfig.apiKey });
const genAI = geminiConfig.apiKey
  ? new GoogleGenerativeAI(geminiConfig.apiKey)
  : null;

interface GenerateApplicationEmailInput {
  jobData: {
    companyName: string;
    jobTitle: string;
    jobRole: string;
    jobDescription: string;
    companyEmail: string;
  };
  userData: {
    name: string;
    email: string;
    profileBio?: string;
    resumeContent?: string;
    skills?: string;
    experience?: string;
    education?: string;
    certifications?: string;
    linkedinLink?: string;
    portfolioLink?: string;
  };
  aiProvider: AIProvider;
}

interface GenerateReplyEmailInput {
  originalEmail: {
    subject: string;
    content: string;
  };
  userPrompt: string;
  userData: {
    name: string;
    resumeContent?: string;
    skills?: string;
  };
  aiProvider: AIProvider;
}

function buildApplicationPrompt(input: GenerateApplicationEmailInput): string {
  const { jobData, userData } = input;

  return `You are a professional career assistant specializing in writing compelling job application emails.

Write a professional job application email with the following information:

CANDIDATE INFORMATION:
Name: ${userData.name}
Email: ${userData.email}
${userData.profileBio ? `Bio: ${userData.profileBio}` : ""}
${userData.skills ? `Skills: ${userData.skills}` : ""}
${userData.experience ? `Experience Summary: ${userData.experience}` : ""}
${userData.education ? `Education: ${userData.education}` : ""}
${userData.certifications ? `Certifications: ${userData.certifications}` : ""}
${userData.linkedinLink ? `LinkedIn: ${userData.linkedinLink}` : ""}
${userData.portfolioLink ? `Portfolio: ${userData.portfolioLink}` : ""}

FULL RESUME CONTENT:
${userData.resumeContent || "Resume content not provided"}

JOB INFORMATION:
Company Name: ${jobData.companyName}
Job Role: ${jobData.jobRole}
Job Title: ${jobData.jobTitle}
Job Description:
${jobData.jobDescription}

REQUIREMENTS:
- Keep tone professional and confident
- Length: 150-250 words
- Show strong alignment with job requirements
- Mention relevant skills from resume that match the job description
- Highlight specific experience that relates to the role
- Do not sound generic or templated
- Do not mention AI or automation
- Show genuine interest in the position and company
- Include a professional closing

FORMAT:
Return the email in this exact format:
SUBJECT: [Your subject line]

[Email body]

Generate the email now.`;
}

function buildReplyPrompt(input: GenerateReplyEmailInput): string {
  const { originalEmail, userPrompt, userData } = input;

  return `You are a professional career assistant. Generate a professional email reply based on the following:

ORIGINAL EMAIL:
Subject: ${originalEmail.subject}
Content:
${originalEmail.content}

USER'S INSTRUCTIONS: ${userPrompt}

SENDER INFORMATION:
Name: ${userData.name}
${userData.skills ? `Skills: ${userData.skills}` : ""}
${userData.resumeContent ? `Resume Context:\n${userData.resumeContent}` : ""}

REQUIREMENTS:
- Has a clear subject line (return as "SUBJECT: [subject]")
- Addresses the recipient professionally
- Follows the user's instructions precisely
- Maintains a professional and appropriate tone
- Keep it concise and to the point (100-200 words)
- Do not mention AI or automation

FORMAT:
SUBJECT: [Your subject line]

[Email body]`;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: openaiConfig.model,
    messages: [
      {
        role: "system",
        content:
          "You are an expert at writing professional job application emails and replies.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: openaiConfig.maxTokens,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
}

async function generateWithGemini(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ model: geminiConfig.model });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      maxOutputTokens: geminiConfig.maxTokens,
      temperature: 0.7,
    },
  });

  const response = await result.response;
  return response.text();
}

function parseEmailResponse(response: string): {
  subject: string;
  content: string;
} {
  const subjectMatch = response.match(/SUBJECT:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Application Email";

  const content = response
    .replace(/SUBJECT:\s*.+/i, "")
    .trim()
    .replace(/^[-\s]*/gm, ""); // Remove leading dashes/spaces

  return { subject, content };
}

const generateApplicationEmail = async (
  input: GenerateApplicationEmailInput,
) => {
  const { aiProvider } = input;
  const prompt = buildApplicationPrompt(input);

  try {
    let response: string;

    if (aiProvider === AIProvider.OPENAI) {
      response = await generateWithOpenAI(prompt);
    } else if (aiProvider === AIProvider.GEMINI) {
      response = await generateWithGemini(prompt);
    } else {
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }

    const { subject, content } = parseEmailResponse(response);

    return { subject, content };
  } catch (error: any) {
    const providerName = aiProvider === AIProvider.OPENAI ? "OpenAI" : "Gemini";
    console.error(`${providerName} generation error:`, error.message);
    throw new Error(`${providerName} generation failed: ${error.message}`);
  }
};

const generateReplyEmail = async (input: GenerateReplyEmailInput) => {
  const { aiProvider } = input;
  const prompt = buildReplyPrompt(input);

  try {
    let response: string;

    if (aiProvider === AIProvider.OPENAI) {
      response = await generateWithOpenAI(prompt);
    } else if (aiProvider === AIProvider.GEMINI) {
      response = await generateWithGemini(prompt);
    } else {
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }

    const { subject, content } = parseEmailResponse(response);

    return { subject, content };
  } catch (error: any) {
    const providerName = aiProvider === AIProvider.OPENAI ? "OpenAI" : "Gemini";
    throw new Error(`${providerName} generation failed: ${error.message}`);
  }
};

const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  userId: string,
  jobId: string,
  emailType: EmailType,
  aiProvider: AIProvider,
  attachment?: {
    filename: string;
    path: string;
    contentType?: string;
  },
) => {
  try {
    // Get user info for "from" field
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Send email via SMTP
    await emailTransporter.sendMail({
      from: `"${user.name}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: content,
      html: content.replace(/\n/g, "<br>"),
      ...(attachment && { attachments: [attachment] }),
    });

    // Store email in database with aiProvider
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
        aiProvider,
        emailType,
        status: EmailSendStatus.SENT,
        sentAt: new Date(),
      },
    });

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: {
        emailSendStatus: EmailSendStatus.SENT,
        ...(emailType === EmailType.APPLICATION && {
          applyStatus: "APPLIED",
          applyDate: new Date(),
          status: "APPLIED",
        }),
      },
    });

    return email;
  } catch (error: any) {
    // Store failed email with aiProvider
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
        aiProvider,
        emailType,
        status: EmailSendStatus.FAILED,
      },
    });

    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const getEmails = async (
  userId: string,
  filters: { emailType?: EmailType; jobId?: string } = {},
) => {
  const where: any = { userId };

  if (filters.emailType) where.emailType = filters.emailType;
  if (filters.jobId) where.jobId = filters.jobId;

  return await prisma.email.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
        },
      },
    },
  });
};

const getEmailById = async (userId: string, emailId: string) => {
  return await prisma.email.findFirst({
    where: {
      id: emailId,
      userId,
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
          companyEmail: true,
        },
      },
    },
  });
};

export const EmailsService = {
  generateApplicationEmail,
  generateReplyEmail,
  sendEmail,
  getEmails,
  getEmailById,
};
