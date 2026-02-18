import { prisma } from "../../lib/prisma";

interface UpdateProfileData {
  name?: string;
  profileBio?: string;
  resumeLink?: string;
  linkedinLink?: string;
  portfolioLink?: string;
  resumeContent?: string;
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
}

const updateProfile = async (userId: string, data: UpdateProfileData) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profileBio: true,
      resumeLink: true,
      linkedinLink: true,
      portfolioLink: true,
      resumeContent: true,
      skills: true,
      experience: true,
      education: true,
      certifications: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileBio: true,
      resumeLink: true,
      linkedinLink: true,
      portfolioLink: true,
      resumeContent: true,
      skills: true,
      experience: true,
      education: true,
      certifications: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const UsersService = {
  updateProfile,
  getProfile,
};
