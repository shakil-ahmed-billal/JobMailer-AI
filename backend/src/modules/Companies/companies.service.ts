import { prisma } from "../../lib/prisma";

interface CreateCompanyData {
  name: string;
  company?: string;
  webLink?: string;
  location?: string;
}

const createCompany = async (userId: string, data: CreateCompanyData) => {
  return await prisma.topCompany.create({
    data: {
      ...data,
      userId,
    },
  });
};

const getCompanies = async (userId: string) => {
  return await prisma.topCompany.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const getCompanyById = async (userId: string, id: string) => {
  return await prisma.topCompany.findFirst({
    where: { id, userId },
  });
};

const updateCompany = async (userId: string, id: string, data: Partial<CreateCompanyData>) => {
  // Check ownership
  const company = await prisma.topCompany.findFirst({
    where: { id, userId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return await prisma.topCompany.update({
    where: { id },
    data,
  });
};

const deleteCompany = async (userId: string, id: string) => {
  // Check ownership
  const company = await prisma.topCompany.findFirst({
    where: { id, userId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return await prisma.topCompany.delete({
    where: { id },
  });
};

export const TopCompaniesService = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
