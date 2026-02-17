import OpenAI from "openai";
import {
  EmailSendStatus,
  EmailType,
  PrismaClient,
} from "../../../generated/prisma/client";
import { emailTransporter } from "../../config/email.config";
import { openaiConfig } from "../../config/openai.config";
import { prisma } from "../../lib/prisma";


const openai = new OpenAI({ apiKey: openaiConfig.apiKey });

interface GenerateApplicationEmailInput {
  jobData: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    companyEmail: string;
  };
  userData: {
    name: string;
    email: string;
    profileBio?: string;
    resumeLink?: string;
    linkedinLink?: string;
  };
}

interface GenerateReplyEmailInput {
  originalEmail: {
    subject: string;
    content: string;
  };
  userPrompt: string;
  userData: {
    name: string;
  };
}

const generateApplicationEmail = async (
  input: GenerateApplicationEmailInput,
) => {
  const { jobData, userData } = input;

  const prompt = `You are a professional job application email writer. Generate a compelling job application email with the following information:

Company: ${jobData.companyName}
Job Title: ${jobData.jobTitle}
Job Description: ${jobData.jobDescription}

Applicant Information:
Name: ${userData.name}
Email: ${userData.email}
${userData.profileBio ? `Bio: ${userData.profileBio}` : ""}
${userData.resumeLink ? `Resume: ${userData.resumeLink}` : ""}
${userData.linkedinLink ? `LinkedIn: ${userData.linkedinLink}` : ""}

Generate a professional, concise email that:
1. Has a clear subject line (return as "SUBJECT: [subject]")
2. Addresses the hiring manager professionally
3. Shows genuine interest in the position
4. Highlights relevant qualifications from the bio
5. Mentions attached resume/LinkedIn if provided
6. Includes a professional closing
7. Keep it under 250 words

Format:
SUBJECT: [Your subject line]

[Email body]`;

  try {
    const completion = await openai.chat.completions.create({
      model: openaiConfig.model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert at writing professional job application emails.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: openaiConfig.maxTokens,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || "";

    // Parse subject and content
    const subjectMatch = response.match(/SUBJECT:\s*(.+)/i);
    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : `Application for ${jobData.jobTitle}`;

    const content = response.replace(/SUBJECT:\s*.+/i, "").trim();

    return { subject, content };
  } catch (error: any) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

const generateReplyEmail = async (input: GenerateReplyEmailInput) => {
  const { originalEmail, userPrompt, userData } = input;

  const prompt = `Generate a professional email reply based on the following:

Original Email Subject: ${originalEmail.subject}
Original Email Content:
${originalEmail.content}

User's Instructions: ${userPrompt}

Sender Name: ${userData.name}

Generate a professional reply that:
1. Has a clear subject line (return as "SUBJECT: [subject]")
2. Addresses the recipient professionally
3. Follows the user's instructions
4. Maintains a professional tone
5. Keep it concise and to the point

Format:
SUBJECT: [Your subject line]

[Email body]`;

  try {
    const completion = await openai.chat.completions.create({
      model: openaiConfig.model,
      messages: [
        {
          role: "system",
          content: "You are an expert at writing professional email replies.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: openaiConfig.maxTokens,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || "";

    // Parse subject and content
    const subjectMatch = response.match(/SUBJECT:\s*(.+)/i);
    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : `Re: ${originalEmail.subject}`;

    const content = response.replace(/SUBJECT:\s*.+/i, "").trim();

    return { subject, content };
  } catch (error: any) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  userId: string,
  jobId: string,
  emailType: EmailType,
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
    });

    // Store email in database
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
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
    // Store failed email
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
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
