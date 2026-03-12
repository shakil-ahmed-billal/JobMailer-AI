import { prisma } from "../../lib/prisma";

interface CreateCompanyData {
  name: string;
  company?: string;
  webLink?: string;
  location?: string;
}

interface GetCompaniesOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  location?: string;
}

const createCompany = async (userId: string, data: CreateCompanyData) => {
  return await prisma.topCompany.create({
    data: { ...data, userId },
  });
};

const getCompanies = async (userId: string, options: GetCompaniesOptions = {}) => {
  const { page = 1, limit = 10, search, type, location } = options;

  const validPage = Math.max(1, Number(page));
  const validLimit = Math.min(100, Math.max(1, Number(limit)));
  const skip = (validPage - 1) * validLimit;

  const where: any = { userId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.company = type;
  if (location) where.location = { contains: location, mode: "insensitive" };

  const [data, total] = await Promise.all([
    prisma.topCompany.findMany({
      where,
      skip,
      take: validLimit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.topCompany.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    },
  };
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
