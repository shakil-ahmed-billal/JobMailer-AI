var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.0",
  "engineVersion": "ab56fe763f921d033a6c195e7ddeb3e255bdbb57",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ============= Enums =============\nenum JobStatus {\n  DRAFT\n  APPLIED\n  INTERVIEW\n  REJECTED\n  OFFER\n}\n\nenum JobRole {\n  FRONTEND_DEVELOPER\n  FRONTEND_ENGINEER\n  BACKEND_DEVELOPER\n  BACKEND_ENGINEER\n  MERN_STACK_DEVELOPER\n  FULL_STACK_DEVELOPER\n  SOFTWARE_ENGINEER\n  CMS_DEVELOPER\n}\n\nenum ApplyStatus {\n  NOT_APPLIED\n  APPLIED\n}\n\nenum ResponseStatus {\n  NO_RESPONSE\n  REPLIED\n  REJECTED\n  ACCEPTED\n}\n\nenum EmailSendStatus {\n  NOT_SENT\n  SENT\n  FAILED\n}\n\nenum EmailType {\n  APPLICATION\n  REPLY\n}\n\nenum TaskStatus {\n  PENDING\n  SUBMITTED\n  OVERDUE\n}\n\nenum AIProvider {\n  OPENAI\n  GEMINI\n}\n\n// ============= Models =============\nmodel User {\n  id             String   @id\n  name           String\n  email          String\n  emailVerified  Boolean  @default(false)\n  image          String?\n  profileBio     String?\n  resumeLink     String?\n  linkedinLink   String?\n  portfolioLink  String?\n  resumeContent  String?  @db.Text\n  skills         String?  @db.Text\n  experience     String?  @db.Text\n  education      String?  @db.Text\n  certifications String?  @db.Text\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  sessions     Session[]\n  accounts     Account[]\n  jobs         Job[]\n  tasks        Task[]\n  emails       Email[]\n  resumes      Resume[]\n  topCompanies TopCompany[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Job {\n  id              String  @id @default(uuid())\n  userId          String\n  companyName     String\n  companyEmail    String\n  jobTitle        String\n  jobDescription  String  @db.Text\n  companyWebsite  String?\n  companyLinkedin String?\n  companyNumber   String?\n  location        String?\n  salary          String?\n  notes           String? @db.Text\n  jobRole         JobRole @default(SOFTWARE_ENGINEER)\n\n  status          JobStatus       @default(DRAFT)\n  applyStatus     ApplyStatus     @default(NOT_APPLIED)\n  responseStatus  ResponseStatus  @default(NO_RESPONSE)\n  emailSendStatus EmailSendStatus @default(NOT_SENT)\n\n  applyDate DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tasks  Task[]\n  emails Email[]\n\n  @@index([userId])\n  @@index([status])\n  @@index([applyStatus])\n  @@map("job")\n}\n\nmodel Resume {\n  id        String   @id @default(uuid())\n  userId    String\n  jobRole   JobRole\n  fileUrl   String\n  publicId  String?\n  fileName  String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, jobRole])\n  @@index([userId])\n  @@index([jobRole])\n  @@map("resume")\n}\n\nmodel Email {\n  id         String          @id @default(uuid())\n  userId     String\n  jobId      String\n  subject    String\n  content    String          @db.Text\n  aiProvider AIProvider      @default(OPENAI)\n  emailType  EmailType\n  status     EmailSendStatus @default(NOT_SENT)\n  sentAt     DateTime?\n  createdAt  DateTime        @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n  job  Job  @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([jobId])\n  @@index([emailType])\n  @@index([aiProvider])\n  @@map("email")\n}\n\nmodel Task {\n  id           String     @id @default(uuid())\n  userId       String\n  jobId        String\n  title        String\n  taskLink     String?\n  deadline     DateTime\n  submitStatus TaskStatus @default(PENDING)\n  description  String?    @db.Text\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n  job  Job  @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([jobId])\n  @@index([deadline])\n  @@map("task")\n}\n\nmodel TopCompany {\n  id        String   @id @default(uuid())\n  userId    String\n  name      String\n  company   String?\n  webLink   String?\n  location  String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("top_company")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"profileBio","kind":"scalar","type":"String"},{"name":"resumeLink","kind":"scalar","type":"String"},{"name":"linkedinLink","kind":"scalar","type":"String"},{"name":"portfolioLink","kind":"scalar","type":"String"},{"name":"resumeContent","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"String"},{"name":"education","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"jobs","kind":"object","type":"Job","relationName":"JobToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToUser"},{"name":"emails","kind":"object","type":"Email","relationName":"EmailToUser"},{"name":"resumes","kind":"object","type":"Resume","relationName":"ResumeToUser"},{"name":"topCompanies","kind":"object","type":"TopCompany","relationName":"TopCompanyToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Job":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"companyName","kind":"scalar","type":"String"},{"name":"companyEmail","kind":"scalar","type":"String"},{"name":"jobTitle","kind":"scalar","type":"String"},{"name":"jobDescription","kind":"scalar","type":"String"},{"name":"companyWebsite","kind":"scalar","type":"String"},{"name":"companyLinkedin","kind":"scalar","type":"String"},{"name":"companyNumber","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"salary","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"jobRole","kind":"enum","type":"JobRole"},{"name":"status","kind":"enum","type":"JobStatus"},{"name":"applyStatus","kind":"enum","type":"ApplyStatus"},{"name":"responseStatus","kind":"enum","type":"ResponseStatus"},{"name":"emailSendStatus","kind":"enum","type":"EmailSendStatus"},{"name":"applyDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"JobToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"JobToTask"},{"name":"emails","kind":"object","type":"Email","relationName":"EmailToJob"}],"dbName":"job"},"Resume":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"jobRole","kind":"enum","type":"JobRole"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"fileName","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ResumeToUser"}],"dbName":"resume"},"Email":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"jobId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"aiProvider","kind":"enum","type":"AIProvider"},{"name":"emailType","kind":"enum","type":"EmailType"},{"name":"status","kind":"enum","type":"EmailSendStatus"},{"name":"sentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"EmailToUser"},{"name":"job","kind":"object","type":"Job","relationName":"EmailToJob"}],"dbName":"email"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"jobId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"taskLink","kind":"scalar","type":"String"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"submitStatus","kind":"enum","type":"TaskStatus"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TaskToUser"},{"name":"job","kind":"object","type":"Job","relationName":"JobToTask"}],"dbName":"task"},"TopCompany":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"company","kind":"scalar","type":"String"},{"name":"webLink","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TopCompanyToUser"}],"dbName":"top_company"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","job","tasks","emails","_count","jobs","resumes","topCompanies","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Job.findUnique","Job.findUniqueOrThrow","Job.findFirst","Job.findFirstOrThrow","Job.findMany","Job.createOne","Job.createMany","Job.createManyAndReturn","Job.updateOne","Job.updateMany","Job.updateManyAndReturn","Job.upsertOne","Job.deleteOne","Job.deleteMany","Job.groupBy","Job.aggregate","Resume.findUnique","Resume.findUniqueOrThrow","Resume.findFirst","Resume.findFirstOrThrow","Resume.findMany","Resume.createOne","Resume.createMany","Resume.createManyAndReturn","Resume.updateOne","Resume.updateMany","Resume.updateManyAndReturn","Resume.upsertOne","Resume.deleteOne","Resume.deleteMany","Resume.groupBy","Resume.aggregate","Email.findUnique","Email.findUniqueOrThrow","Email.findFirst","Email.findFirstOrThrow","Email.findMany","Email.createOne","Email.createMany","Email.createManyAndReturn","Email.updateOne","Email.updateMany","Email.updateManyAndReturn","Email.upsertOne","Email.deleteOne","Email.deleteMany","Email.groupBy","Email.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TopCompany.findUnique","TopCompany.findUniqueOrThrow","TopCompany.findFirst","TopCompany.findFirstOrThrow","TopCompany.findMany","TopCompany.createOne","TopCompany.createMany","TopCompany.createManyAndReturn","TopCompany.updateOne","TopCompany.updateMany","TopCompany.updateManyAndReturn","TopCompany.upsertOne","TopCompany.deleteOne","TopCompany.deleteMany","TopCompany.groupBy","TopCompany.aggregate","AND","OR","NOT","id","userId","name","company","webLink","location","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","jobId","title","taskLink","deadline","TaskStatus","submitStatus","description","subject","content","AIProvider","aiProvider","EmailType","emailType","EmailSendStatus","status","sentAt","JobRole","jobRole","fileUrl","publicId","fileName","companyName","companyEmail","jobTitle","jobDescription","companyWebsite","companyLinkedin","companyNumber","salary","notes","JobStatus","ApplyStatus","applyStatus","ResponseStatus","responseStatus","emailSendStatus","applyDate","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","profileBio","resumeLink","linkedinLink","portfolioLink","resumeContent","skills","experience","education","certifications","every","some","none","userId_jobRole","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany"]'),
  graph: "twRLkAEaBAAArAIAIAUAAK0CACAHAACvAgAgCAAAsAIAIAoAAK4CACALAACxAgAgDAAAsgIAIKMBAACpAgAwpAEAACsAEKUBAACpAgAwpgEBAAAAAagBAQChAgAhrAFAAKICACGtAUAAogIAIe0BAQAAAAHuASAAqgIAIe8BAQCrAgAh8AEBAKsCACHxAQEAqwIAIfIBAQCrAgAh8wEBAKsCACH0AQEAqwIAIfUBAQCrAgAh9gEBAKsCACH3AQEAqwIAIfgBAQCrAgAhAQAAAAEAIAwDAAC0AgAgowEAAMUCADCkAQAAAwAQpQEAAMUCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIeABQACiAgAh6gEBAKECACHrAQEAqwIAIewBAQCrAgAhAwMAAIAEACDrAQAAxgIAIOwBAADGAgAgDAMAALQCACCjAQAAxQIAMKQBAAADABClAQAAxQIAMKYBAQAAAAGnAQEAoQIAIawBQACiAgAhrQFAAKICACHgAUAAogIAIeoBAQAAAAHrAQEAqwIAIewBAQCrAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAAC0AgAgowEAAMQCADCkAQAABwAQpQEAAMQCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIeEBAQChAgAh4gEBAKECACHjAQEAqwIAIeQBAQCrAgAh5QEBAKsCACHmAUAAvAIAIecBQAC8AgAh6AEBAKsCACHpAQEAqwIAIQgDAACABAAg4wEAAMYCACDkAQAAxgIAIOUBAADGAgAg5gEAAMYCACDnAQAAxgIAIOgBAADGAgAg6QEAAMYCACARAwAAtAIAIKMBAADEAgAwpAEAAAcAEKUBAADEAgAwpgEBAAAAAacBAQChAgAhrAFAAKICACGtAUAAogIAIeEBAQChAgAh4gEBAKECACHjAQEAqwIAIeQBAQCrAgAh5QEBAKsCACHmAUAAvAIAIecBQAC8AgAh6AEBAKsCACHpAQEAqwIAIQMAAAAHACABAAAIADACAAAJACAaAwAAtAIAIAcAAK8CACAIAACwAgAgowEAAMACADCkAQAACwAQpQEAAMACADCmAQEAoQIAIacBAQChAgAhqwEBAKsCACGsAUAAogIAIa0BQACiAgAhxwEAAMEC2AEiygEAALcCygEizgEBAKECACHPAQEAoQIAIdABAQChAgAh0QEBAKECACHSAQEAqwIAIdMBAQCrAgAh1AEBAKsCACHVAQEAqwIAIdYBAQCrAgAh2QEAAMIC2QEi2wEAAMMC2wEi3AEAALsCxwEi3QFAALwCACEKAwAAgAQAIAcAAPwDACAIAAD9AwAgqwEAAMYCACDSAQAAxgIAINMBAADGAgAg1AEAAMYCACDVAQAAxgIAINYBAADGAgAg3QEAAMYCACAaAwAAtAIAIAcAAK8CACAIAACwAgAgowEAAMACADCkAQAACwAQpQEAAMACADCmAQEAAAABpwEBAKECACGrAQEAqwIAIawBQACiAgAhrQFAAKICACHHAQAAwQLYASLKAQAAtwLKASLOAQEAoQIAIc8BAQChAgAh0AEBAKECACHRAQEAoQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCrAgAh1gEBAKsCACHZAQAAwgLZASLbAQAAwwLbASLcAQAAuwLHASLdAUAAvAIAIQMAAAALACABAAAMADACAAANACAPAwAAtAIAIAYAAL0CACCjAQAAvgIAMKQBAAAPABClAQAAvgIAMKYBAQChAgAhpwEBAKECACGsAUAAogIAIa0BQACiAgAhuQEBAKECACG6AQEAoQIAIbsBAQCrAgAhvAFAAKICACG-AQAAvwK-ASK_AQEAqwIAIQQDAACABAAgBgAAgQQAILsBAADGAgAgvwEAAMYCACAPAwAAtAIAIAYAAL0CACCjAQAAvgIAMKQBAAAPABClAQAAvgIAMKYBAQAAAAGnAQEAoQIAIawBQACiAgAhrQFAAKICACG5AQEAoQIAIboBAQChAgAhuwEBAKsCACG8AUAAogIAIb4BAAC_Ar4BIr8BAQCrAgAhAwAAAA8AIAEAABAAMAIAABEAIA8DAAC0AgAgBgAAvQIAIKMBAAC4AgAwpAEAABMAEKUBAAC4AgAwpgEBAKECACGnAQEAoQIAIawBQACiAgAhuQEBAKECACHAAQEAoQIAIcEBAQChAgAhwwEAALkCwwEixQEAALoCxQEixwEAALsCxwEiyAFAALwCACEDAwAAgAQAIAYAAIEEACDIAQAAxgIAIA8DAAC0AgAgBgAAvQIAIKMBAAC4AgAwpAEAABMAEKUBAAC4AgAwpgEBAAAAAacBAQChAgAhrAFAAKICACG5AQEAoQIAIcABAQChAgAhwQEBAKECACHDAQAAuQLDASLFAQAAugLFASLHAQAAuwLHASLIAUAAvAIAIQMAAAATACABAAAUADACAAAVACABAAAADwAgAQAAABMAIAMAAAAPACABAAAQADACAAARACADAAAAEwAgAQAAFAAwAgAAFQAgDAMAALQCACCjAQAAtgIAMKQBAAAbABClAQAAtgIAMKYBAQChAgAhpwEBAKECACGsAUAAogIAIa0BQACiAgAhygEAALcCygEiywEBAKECACHMAQEAqwIAIc0BAQChAgAhAgMAAIAEACDMAQAAxgIAIA0DAAC0AgAgowEAALYCADCkAQAAGwAQpQEAALYCADCmAQEAAAABpwEBAKECACGsAUAAogIAIa0BQACiAgAhygEAALcCygEiywEBAKECACHMAQEAqwIAIc0BAQChAgAh_AEAALUCACADAAAAGwAgAQAAHAAwAgAAHQAgDAMAALQCACCjAQAAswIAMKQBAAAfABClAQAAswIAMKYBAQChAgAhpwEBAKECACGoAQEAoQIAIakBAQCrAgAhqgEBAKsCACGrAQEAqwIAIawBQACiAgAhrQFAAKICACEEAwAAgAQAIKkBAADGAgAgqgEAAMYCACCrAQAAxgIAIAwDAAC0AgAgowEAALMCADCkAQAAHwAQpQEAALMCADCmAQEAAAABpwEBAKECACGoAQEAoQIAIakBAQCrAgAhqgEBAKsCACGrAQEAqwIAIawBQACiAgAhrQFAAKICACEDAAAAHwAgAQAAIAAwAgAAIQAgAQAAAAMAIAEAAAAHACABAAAACwAgAQAAAA8AIAEAAAATACABAAAAGwAgAQAAAB8AIAEAAAABACAaBAAArAIAIAUAAK0CACAHAACvAgAgCAAAsAIAIAoAAK4CACALAACxAgAgDAAAsgIAIKMBAACpAgAwpAEAACsAEKUBAACpAgAwpgEBAKECACGoAQEAoQIAIawBQACiAgAhrQFAAKICACHtAQEAoQIAIe4BIACqAgAh7wEBAKsCACHwAQEAqwIAIfEBAQCrAgAh8gEBAKsCACHzAQEAqwIAIfQBAQCrAgAh9QEBAKsCACH2AQEAqwIAIfcBAQCrAgAh-AEBAKsCACERBAAA-QMAIAUAAPoDACAHAAD8AwAgCAAA_QMAIAoAAPsDACALAAD-AwAgDAAA_wMAIO8BAADGAgAg8AEAAMYCACDxAQAAxgIAIPIBAADGAgAg8wEAAMYCACD0AQAAxgIAIPUBAADGAgAg9gEAAMYCACD3AQAAxgIAIPgBAADGAgAgAwAAACsAIAEAACwAMAIAAAEAIAMAAAArACABAAAsADACAAABACADAAAAKwAgAQAALAAwAgAAAQAgFwQAAPIDACAFAADzAwAgBwAA9QMAIAgAAPYDACAKAAD0AwAgCwAA9wMAIAwAAPgDACCmAQEAAAABqAEBAAAAAawBQAAAAAGtAUAAAAAB7QEBAAAAAe4BIAAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAABARIAADAAIBCmAQEAAAABqAEBAAAAAawBQAAAAAGtAUAAAAAB7QEBAAAAAe4BIAAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAABARIAADIAMAESAAAyADAXBAAAnQMAIAUAAJ4DACAHAACgAwAgCAAAoQMAIAoAAJ8DACALAACiAwAgDAAAowMAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhAgAAAAEAIBIAADUAIBCmAQEAygIAIagBAQDKAgAhrAFAAMwCACGtAUAAzAIAIe0BAQDKAgAh7gEgAJwDACHvAQEAywIAIfABAQDLAgAh8QEBAMsCACHyAQEAywIAIfMBAQDLAgAh9AEBAMsCACH1AQEAywIAIfYBAQDLAgAh9wEBAMsCACH4AQEAywIAIQIAAAArACASAAA3ACACAAAAKwAgEgAANwAgAwAAAAEAIBkAADAAIBoAADUAIAEAAAABACABAAAAKwAgDQkAAJkDACAfAACbAwAgIAAAmgMAIO8BAADGAgAg8AEAAMYCACDxAQAAxgIAIPIBAADGAgAg8wEAAMYCACD0AQAAxgIAIPUBAADGAgAg9gEAAMYCACD3AQAAxgIAIPgBAADGAgAgE6MBAAClAgAwpAEAAD4AEKUBAAClAgAwpgEBAPUBACGoAQEA9QEAIawBQAD3AQAhrQFAAPcBACHtAQEA9QEAIe4BIACmAgAh7wEBAPYBACHwAQEA9gEAIfEBAQD2AQAh8gEBAPYBACHzAQEA9gEAIfQBAQD2AQAh9QEBAPYBACH2AQEA9gEAIfcBAQD2AQAh-AEBAPYBACEDAAAAKwAgAQAAPQAwHgAAPgAgAwAAACsAIAEAACwAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAJgDACCmAQEAAAABpwEBAAAAAawBQAAAAAGtAUAAAAAB4AFAAAAAAeoBAQAAAAHrAQEAAAAB7AEBAAAAAQESAABGACAIpgEBAAAAAacBAQAAAAGsAUAAAAABrQFAAAAAAeABQAAAAAHqAQEAAAAB6wEBAAAAAewBAQAAAAEBEgAASAAwARIAAEgAMAkDAACXAwAgpgEBAMoCACGnAQEAygIAIawBQADMAgAhrQFAAMwCACHgAUAAzAIAIeoBAQDKAgAh6wEBAMsCACHsAQEAywIAIQIAAAAFACASAABLACAIpgEBAMoCACGnAQEAygIAIawBQADMAgAhrQFAAMwCACHgAUAAzAIAIeoBAQDKAgAh6wEBAMsCACHsAQEAywIAIQIAAAADACASAABNACACAAAAAwAgEgAATQAgAwAAAAUAIBkAAEYAIBoAAEsAIAEAAAAFACABAAAAAwAgBQkAAJQDACAfAACWAwAgIAAAlQMAIOsBAADGAgAg7AEAAMYCACALowEAAKQCADCkAQAAVAAQpQEAAKQCADCmAQEA9QEAIacBAQD1AQAhrAFAAPcBACGtAUAA9wEAIeABQAD3AQAh6gEBAPUBACHrAQEA9gEAIewBAQD2AQAhAwAAAAMAIAEAAFMAMB4AAFQAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAACTAwAgpgEBAAAAAacBAQAAAAGsAUAAAAABrQFAAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAQESAABcACANpgEBAAAAAacBAQAAAAGsAUAAAAABrQFAAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAA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asBAQDLAgAhrAFAAMwCACGtAUAAzAIAIccBAADrAtgBIsoBAADlAsoBIs4BAQDKAgAhzwEBAMoCACHQAQEAygIAIdEBAQDKAgAh0gEBAMsCACHTAQEAywIAIdQBAQDLAgAh1QEBAMsCACHWAQEAywIAIdkBAADsAtkBItsBAADtAtsBItwBAADcAscBIt0BQADdAgAhAgAAAAsAIBIAAJIBACACAAAACwAgEgAAkgEAIAMAAAANACAZAACLAQAgGgAAkAEAIAEAAAANACABAAAACwAgCgkAAOgCACAfAADqAgAgIAAA6QIAIKsBAADGAgAg0gEAAMYCACDTAQAAxgIAINQBAADGAgAg1QEAAMYCACDWAQAAxgIAIN0BAADGAgAgF6MBAACVAgAwpAEAAJkBABClAQAAlQIAMKYBAQD1AQAhpwEBAPUBACGrAQEA9gEAIawBQAD3AQAhrQFAAPcBACHHAQAAlgLYASLKAQAAkgLKASLOAQEA9QEAIc8BAQD1AQAh0AEBAPUBACHRAQEA9QEAIdIBAQD2AQAh0wEBAPYBACHUAQEA9gEAIdUBAQD2AQAh1gEBAPYBACHZAQAAlwLZASLbAQAAmALbASLcAQAAhwLHASLdAUAAiAIAIQMAAAALACABAACYAQAwHgAAmQEAIAMAAAALACABAAAMADACAAANACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAkDAADnAgAgpgEBAAAAAacBAQAAAAGsAUAAAAABrQFAAAAAAcoBAAAAygECywEBAAAAAcwBAQAAAAHNAQEAAAABARIAAKEBACAIpgEBAAAAAacBAQAAAAGsAUAAAAABrQFAAAAAAcoBAAAAygECywEBAAAAAcwBAQAAAAHNAQEAAAABARIAAKMBADABEgAAowEAMAkDAADmAgAgpgEBAMoCACGnAQEAygIAIawBQADMAgAhrQFAAMwCACHKAQAA5QLKASLLAQEAygIAIcwBAQDLAgAhzQEBAMoCACECAAAAHQAgEgAApgEAIAimAQEAygIAIacBAQDKAgAhrAFAAMwCACGtAUAAzAIAIcoBAADlAsoBIssBAQDKAgAhzAEBAMsCACHNAQEAygIAIQIAAAAbACASAACoAQAgAgAAABsAIBIAAKgBACADAAAAHQAgGQAAoQEAIBoAAKYBACABAAAAHQAgAQAAABsAIAQJAADiAgAgHwAA5AIAICAAAOMCACDMAQAAxgIAIAujAQAAkQIAMKQBAACvAQAQpQEAAJECADCmAQEA9QEAIacBAQD1AQAhrAFAAPcBACGtAUAA9wEAIcoBAACSAsoBIssBAQD1AQAhzAEBAPYBACHNAQEA9QEAIQMAAAAbACABAACuAQAwHgAArwEAIAMAAAAbACABAAAcADACAAAdACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAwDAADgAgAgBgAA4QIAIKYBAQAAAAGnAQEAAAABrAFAAAAAAbkBAQAAAAHAAQEAAAABwQEBAAAAAcMBAAAAwwECxQEAAADFAQLHAQAAAMcBAsgBQAAAAAEBEgAAtwEAIAqmAQEAAAABpwEBAAAAAawBQAAAAAG5AQEAAAABwAEBAAAAAcEBAQAAAAHDAQAAAMMBAsUBAAAAxQECxwEAAADHAQLIAUAAAAABARIAALkBADABEgAAuQEAMAwDAADeAgAgBgAA3wIAIKYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIbkBAQDKAgAhwAEBAMoCACHBAQEAygIAIcMBAADaAsMBIsUBAADbAsUBIscBAADcAscBIsgBQADdAgAhAgAAABUAIBIAALwBACAKpgEBAMoCACGnAQEAygIAIawBQADMAgAhuQEBAMoCACHAAQEAygIAIcEBAQDKAgAhwwEAANoCwwEixQEAANsCxQEixwEAANwCxwEiyAFAAN0CACECAAAAEwAgEgAAvgEAIAIAAAATACASAAC-AQAgAwAAABUAIBkAALcBACAaAAC8AQAgAQAAABUAIAEAAAATACAECQAA1wIAIB8AANkCACAgAADYAgAgyAEAAMYCACANowEAAIQCADCkAQAAxQEAEKUBAACEAgAwpgEBAPUBACGnAQEA9QEAIawBQAD3AQAhuQEBAPUBACHAAQEA9QEAIcEBAQD1AQAhwwEAAIUCwwEixQEAAIYCxQEixwEAAIcCxwEiyAFAAIgCACEDAAAAEwAgAQAAxAEAMB4AAMUBACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABEAIAEAAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACAMAwAA1QIAIAYAANYCACCmAQEAAAABpwEBAAAAAawBQAAAAAGtAUAAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAFAAAAAAb4BAAAAvgECvwEBAAAAAQESAADNAQAgCqYBAQAAAAGnAQEAAAABrAFAAAAAAa0BQAAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AUAAAAABvgEAAAC-AQK_AQEAAAABARIAAM8BADABEgAAzwEAMAwDAADTAgAgBgAA1AIAIKYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIa0BQADMAgAhuQEBAMoCACG6AQEAygIAIbsBAQDLAgAhvAFAAMwCACG-AQAA0gK-ASK_AQEAywIAIQIAAAARACASAADSAQAgCqYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIa0BQADMAgAhuQEBAMoCACG6AQEAygIAIbsBAQDLAgAhvAFAAMwCACG-AQAA0gK-ASK_AQEAywIAIQIAAAAPACASAADUAQAgAgAAAA8AIBIAANQBACADAAAAEQAgGQAAzQEAIBoAANIBACABAAAAEQAgAQAAAA8AIAUJAADPAgAgHwAA0QIAICAAANACACC7AQAAxgIAIL8BAADGAgAgDaMBAACAAgAwpAEAANsBABClAQAAgAIAMKYBAQD1AQAhpwEBAPUBACGsAUAA9wEAIa0BQAD3AQAhuQEBAPUBACG6AQEA9QEAIbsBAQD2AQAhvAFAAPcBACG-AQAAgQK-ASK_AQEA9gEAIQMAAAAPACABAADaAQAwHgAA2wEAIAMAAAAPACABAAAQADACAAARACABAAAAIQAgAQAAACEAIAMAAAAfACABAAAgADACAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAkDAADOAgAgpgEBAAAAAacBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEAAAABrAFAAAAAAa0BQAAAAAEBEgAA4wEAIAimAQEAAAABpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQAAAAGsAUAAAAABrQFAAAAAAQESAADlAQAwARIAAOUBADAJAwAAzQIAIKYBAQDKAgAhpwEBAMoCACGoAQEAygIAIakBAQDLAgAhqgEBAMsCACGrAQEAywIAIawBQADMAgAhrQFAAMwCACECAAAAIQAgEgAA6AEAIAimAQEAygIAIacBAQDKAgAhqAEBAMoCACGpAQEAywIAIaoBAQDLAgAhqwEBAMsCACGsAUAAzAIAIa0BQADMAgAhAgAAAB8AIBIAAOoBACACAAAAHwAgEgAA6gEAIAMAAAAhACAZAADjAQAgGgAA6AEAIAEAAAAhACABAAAAHwAgBgkAAMcCACAfAADJAgAgIAAAyAIAIKkBAADGAgAgqgEAAMYCACCrAQAAxgIAIAujAQAA9AEAMKQBAADxAQAQpQEAAPQBADCmAQEA9QEAIacBAQD1AQAhqAEBAPUBACGpAQEA9gEAIaoBAQD2AQAhqwEBAPYBACGsAUAA9wEAIa0BQAD3AQAhAwAAAB8AIAEAAPABADAeAADxAQAgAwAAAB8AIAEAACAAMAIAACEAIAujAQAA9AEAMKQBAADxAQAQpQEAAPQBADCmAQEA9QEAIacBAQD1AQAhqAEBAPUBACGpAQEA9gEAIaoBAQD2AQAhqwEBAPYBACGsAUAA9wEAIa0BQAD3AQAhDgkAAPkBACAfAAD_AQAgIAAA_wEAIK4BAQAAAAGvAQEAAAAEsAEBAAAABLEBAQAAAAGyAQEAAAABswEBAAAAAbQBAQAAAAG1AQEA_gEAIbYBAQAAAAG3AQEAAAABuAEBAAAAAQ4JAAD8AQAgHwAA_QEAICAAAP0BACCuAQEAAAABrwEBAAAABbABAQAAAAWxAQEAAAABsgEBAAAAAbMBAQAAAAG0AQEAAAABtQEBAPsBACG2AQEAAAABtwEBAAAAAbgBAQAAAAELCQAA-QEAIB8AAPoBACAgAAD6AQAgrgFAAAAAAa8BQAAAAASwAUAAAAAEsQFAAAAAAbIBQAAAAAGzAUAAAAABtAFAAAAAAbUBQAD4AQAhCwkAAPkBACAfAAD6AQAgIAAA-gEAIK4BQAAAAAGvAUAAAAAEsAFAAAAABLEBQAAAAAGyAUAAAAABswFAAAAAAbQBQAAAAAG1AUAA-AEAIQiuAQIAAAABrwECAAAABLABAgAAAASxAQIAAAABsgECAAAAAbMBAgAAAAG0AQIAAAABtQECAPkBACEIrgFAAAAAAa8BQAAAAASwAUAAAAAEsQFAAAAAAbIBQAAAAAGzAUAAAAABtAFAAAAAAbUBQAD6AQAhDgkAAPwBACAfAAD9AQAgIAAA_QEAIK4BAQAAAAGvAQEAAAAFsAEBAAAABbEBAQAAAAGyAQEAAAABswEBAAAAAbQBAQAAAAG1AQEA-wEAIbYBAQAAAAG3AQEAAAABuAEBAAAAAQiuAQIAAAABrwECAAAABbABAgAAAAWxAQIAAAABsgECAAAAAbMBAgAAAAG0AQIAAAABtQECAPwBACELrgEBAAAAAa8BAQAAAAWwAQEAAAAFsQEBAAAAAbIBAQAAAAGzAQEAAAABtAEBAAAAAbUBAQD9AQAhtgEBAAAAAbcBAQAAAAG4AQEAAAABDgkAAPkBACAfAAD_AQAgIAAA_wEAIK4BAQAAAAGvAQEAAAAEsAEBAAAABLEBAQAAAAGyAQEAAAABswEBAAAAAbQBAQAAAAG1AQEA_gEAIbYBAQAAAAG3AQEAAAABuAEBAAAAAQuuAQEAAAABrwEBAAAABLABAQAAAASxAQEAAAABsgEBAAAAAbMBAQAAAAG0AQEAAAABtQEBAP8BACG2AQEAAAABtwEBAAAAAbgBAQAAAAENowEAAIACADCkAQAA2wEAEKUBAACAAgAwpgEBAPUBACGnAQEA9QEAIawBQAD3AQAhrQFAAPcBACG5AQEA9QEAIboBAQD1AQAhuwEBAPYBACG8AUAA9wEAIb4BAACBAr4BIr8BAQD2AQAhBwkAAPkBACAfAACDAgAgIAAAgwIAIK4BAAAAvgECrwEAAAC-AQiwAQAAAL4BCLUBAACCAr4BIgcJAAD5AQAgHwAAgwIAICAAAIMCACCuAQAAAL4BAq8BAAAAvgEIsAEAAAC-AQi1AQAAggK-ASIErgEAAAC-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_AQAhtgEBAAAAAbcBAQAAAAG4AQEAAAABCK4BQAAAAAGvAUAAAAAEsAFAAAAABLEBQAAAAAGyAUAAAAABswFAAAAAAbQBQAAAAAG1AUAA-gEAIRCjAQAAowIAMKQBAABqABClAQAAowIAMKYBAQD1AQAhpwEBAPUBACGsAUAA9wEAIa0BQAD3AQAh4QEBAPUBACHiAQEA9QEAIeMBAQD2AQAh5AEBAPYBACHlAQEA9gEAIeYBQACIAgAh5wFAAIgCACHoAQEA9gEAIekBAQD2AQAhC6MBAACkAgAwpAEAAFQAEKUBAACkAgAwpgEBAPUBACGnAQEA9QEAIawBQAD3AQAhrQFAAPcBACHgAUAA9wEAIeoBAQD1AQAh6wEBAPYBACHsAQEA9gEAIROjAQAApQIAMKQBAAA-ABClAQAApQIAMKYBAQD1AQAhqAEBAPUBACGsAUAA9wEAIa0BQAD3AQAh7QEBAPUBACHuASAApgIAIe8BAQD2AQAh8AEBAPYBACHxAQEA9gEAIfIBAQD2AQAh8wEBAPYBACH0AQEA9gEAIfUBAQD2AQAh9gEBAPYBACH3AQEA9gEAIfgBAQD2AQAhBQkAAPkBACAfAACoAgAgIAAAqAIAIK4BIAAAAAG1ASAApwIAIQUJAAD5AQAgHwAAqAIAICAAAKgCACCuASAAAAABtQEgAKcCACECrgEgAAAAAbUBIACoAgAhGgQAAKwCACAFAACtAgAgBwAArwIAIAgAALACACAKAACuAgAgCwAAsQIAIAwAALICACCjAQAAqQIAMKQBAAArABClAQAAqQIAMKYBAQChAgAhqAEBAKECACGsAUAAogIAIa0BQACiAgAh7QEBAKECACHuASAAqgIAIe8BAQCrAgAh8AEBAKsCACHxAQEAqwIAIfIBAQCrAgAh8wEBAKsCACH0AQEAqwIAIfUBAQCrAgAh9gEBAKsCACH3AQEAqwIAIfgBAQCrAgAhAq4BIAAAAAG1ASAAqAIAIQuuAQEAAAABrwEBAAAABbABAQAAAAWxAQEAAAABsgEBAAAAAbMBAQAAAAG0AQEAAAABtQEBAP0BACG2AQEAAAABtwEBAAAAAbgBAQAAAAED-QEAAAMAIPoBAAADACD7AQAAAwAgA_kBAAAHACD6AQAABwAg-wEAAAcAIAP5AQAACwAg-gEAAAsAIPsBAAALACAD-QEAAA8AIPoBAAAPACD7AQAADwAgA_kBAAATACD6AQAAEwAg-wEAABMAIAP5AQAAGwAg-gEAABsAIPsBAAAbACAD-QEAAB8AIPoBAAAfACD7AQAAHwAgDAMAALQCACCjAQAAswIAMKQBAAAfABClAQAAswIAMKYBAQChAgAhpwEBAKECACGoAQEAoQIAIakBAQCrAgAhqgEBAKsCACGrAQEAqwIAIawBQACiAgAhrQFAAKICACEcBAAArAIAIAUAAK0CACAHAACvAgAgCAAAsAIAIAoAAK4CACALAACxAgAgDAAAsgIAIKMBAACpAgAwpAEAACsAEKUBAACpAgAwpgEBAKECACGoAQEAoQIAIawBQACiAgAhrQFAAKICACHtAQEAoQIAIe4BIACqAgAh7wEBAKsCACHwAQEAqwIAIfEBAQCrAgAh8gEBAKsCACHzAQEAqwIAIfQBAQCrAgAh9QEBAKsCACH2AQEAqwIAIfcBAQCrAgAh-AEBAKsCACH9AQAAKwAg_gEAACsAIAKnAQEAAAABygEAAADKAQIMAwAAtAIAIKMBAAC2AgAwpAEAABsAEKUBAAC2AgAwpgEBAKECACGnAQEAoQIAIawBQACiAgAhrQFAAKICACHKAQAAtwLKASLLAQEAoQIAIcwBAQCrAgAhzQEBAKECACEErgEAAADKAQKvAQAAAMoBCLABAAAAygEItQEAAJQCygEiDwMAALQCACAGAAC9AgAgowEAALgCADCkAQAAEwAQpQEAALgCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACG5AQEAoQIAIcABAQChAgAhwQEBAKECACHDAQAAuQLDASLFAQAAugLFASLHAQAAuwLHASLIAUAAvAIAIQSuAQAAAMMBAq8BAAAAwwEIsAEAAADDAQi1AQAAkALDASIErgEAAADFAQKvAQAAAMUBCLABAAAAxQEItQEAAI4CxQEiBK4BAAAAxwECrwEAAADHAQiwAQAAAMcBCLUBAACMAscBIgiuAUAAAAABrwFAAAAABbABQAAAAAWxAUAAAAABsgFAAAAAAbMBQAAAAAG0AUAAAAABtQFAAIoCACEcAwAAtAIAIAcAAK8CACAIAACwAgAgowEAAMACADCkAQAACwAQpQEAAMACADCmAQEAoQIAIacBAQChAgAhqwEBAKsCACGsAUAAogIAIa0BQACiAgAhxwEAAMEC2AEiygEAALcCygEizgEBAKECACHPAQEAoQIAIdABAQChAgAh0QEBAKECACHSAQEAqwIAIdMBAQCrAgAh1AEBAKsCACHVAQEAqwIAIdYBAQCrAgAh2QEAAMIC2QEi2wEAAMMC2wEi3AEAALsCxwEi3QFAALwCACH9AQAACwAg_gEAAAsAIA8DAAC0AgAgBgAAvQIAIKMBAAC-AgAwpAEAAA8AEKUBAAC-AgAwpgEBAKECACGnAQEAoQIAIawBQACiAgAhrQFAAKICACG5AQEAoQIAIboBAQChAgAhuwEBAKsCACG8AUAAogIAIb4BAAC_Ar4BIr8BAQCrAgAhBK4BAAAAvgECrwEAAAC-AQiwAQAAAL4BCLUBAACDAr4BIhoDAAC0AgAgBwAArwIAIAgAALACACCjAQAAwAIAMKQBAAALABClAQAAwAIAMKYBAQChAgAhpwEBAKECACGrAQEAqwIAIawBQACiAgAhrQFAAKICACHHAQAAwQLYASLKAQAAtwLKASLOAQEAoQIAIc8BAQChAgAh0AEBAKECACHRAQEAoQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCrAgAh1gEBAKsCACHZAQAAwgLZASLbAQAAwwLbASLcAQAAuwLHASLdAUAAvAIAIQSuAQAAANgBAq8BAAAA2AEIsAEAAADYAQi1AQAAngLYASIErgEAAADZAQKvAQAAANkBCLABAAAA2QEItQEAAJwC2QEiBK4BAAAA2wECrwEAAADbAQiwAQAAANsBCLUBAACaAtsBIhEDAAC0AgAgowEAAMQCADCkAQAABwAQpQEAAMQCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIeEBAQChAgAh4gEBAKECACHjAQEAqwIAIeQBAQCrAgAh5QEBAKsCACHmAUAAvAIAIecBQAC8AgAh6AEBAKsCACHpAQEAqwIAIQwDAAC0AgAgowEAAMUCADCkAQAAAwAQpQEAAMUCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIeABQACiAgAh6gEBAKECACHrAQEAqwIAIewBAQCrAgAhAAAAAAGCAgEAAAABAYICAQAAAAEBggJAAAAAAQUZAACzBAAgGgAAtgQAIP8BAAC0BAAggAIAALUEACCFAgAAAQAgAxkAALMEACD_AQAAtAQAIIUCAAABACAAAAABggIAAAC-AQIFGQAAqwQAIBoAALEEACD_AQAArAQAIIACAACwBAAghQIAAAEAIAUZAACpBAAgGgAArgQAIP8BAACqBAAggAIAAK0EACCFAgAADQAgAxkAAKsEACD_AQAArAQAIIUCAAABACADGQAAqQQAIP8BAACqBAAghQIAAA0AIAAAAAGCAgAAAMMBAgGCAgAAAMUBAgGCAgAAAMcBAgGCAkAAAAABBRkAAKEEACAaAACnBAAg_wEAAKIEACCAAgAApgQAIIUCAAABACAFGQAAnwQAIBoAAKQEACD_AQAAoAQAIIACAACjBAAghQIAAA0AIAMZAAChBAAg_wEAAKIEACCFAgAAAQAgAxkAAJ8EACD_AQAAoAQAIIUCAAANACAAAAABggIAAADKAQIFGQAAmgQAIBoAAJ0EACD_AQAAmwQAIIACAACcBAAghQIAAAEAIAMZAACaBAAg_wEAAJsEACCFAgAAAQAgAAAAAYICAAAA2AECAYICAAAA2QECAYICAAAA2wECBRkAAJMEACAaAACYBAAg_wEAAJQEACCAAgAAlwQAIIUCAAABACALGQAA_QIAMBoAAIIDADD_AQAA_gIAMIACAAD_AgAwgQIAAIADACCCAgAAgQMAMIMCAACBAwAwhAIAAIEDADCFAgAAgQMAMIYCAACDAwAwhwIAAIQDADALGQAA8QIAMBoAAPYCADD_AQAA8gIAMIACAADzAgAwgQIAAPQCACCCAgAA9QIAMIMCAAD1AgAwhAIAAPUCADCFAgAA9QIAMIYCAAD3AgAwhwIAAPgCADAKAwAA4AIAIKYBAQAAAAGnAQEAAAABrAFAAAAAAcABAQAAAAHBAQEAAAABwwEAAADDAQLFAQAAAMUBAscBAAAAxwECyAFAAAAAAQIAAAAVACAZAAD8AgAgAwAAABUAIBkAAPwCACAaAAD7AgAgARIAAJYEADAPAwAAtAIAIAYAAL0CACCjAQAAuAIAMKQBAAATABClAQAAuAIAMKYBAQAAAAGnAQEAoQIAIawBQACiAgAhuQEBAKECACHAAQEAoQIAIcEBAQChAgAhwwEAALkCwwEixQEAALoCxQEixwEAALsCxwEiyAFAALwCACECAAAAFQAgEgAA-wIAIAIAAAD5AgAgEgAA-gIAIA2jAQAA-AIAMKQBAAD5AgAQpQEAAPgCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACG5AQEAoQIAIcABAQChAgAhwQEBAKECACHDAQAAuQLDASLFAQAAugLFASLHAQAAuwLHASLIAUAAvAIAIQ2jAQAA-AIAMKQBAAD5AgAQpQEAAPgCADCmAQEAoQIAIacBAQChAgAhrAFAAKICACG5AQEAoQIAIcABAQChAgAhwQEBAKECACHDAQAAuQLDASLFAQAAugLFASLHAQAAuwLHASLIAUAAvAIAIQmmAQEAygIAIacBAQDKAgAhrAFAAMwCACHAAQEAygIAIcEBAQDKAgAhwwEAANoCwwEixQEAANsCxQEixwEAANwCxwEiyAFAAN0CACEKAwAA3gIAIKYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIcABAQDKAgAhwQEBAMoCACHDAQAA2gLDASLFAQAA2wLFASLHAQAA3ALHASLIAUAA3QIAIQoDAADgAgAgpgEBAAAAAacBAQAAAAGsAUAAAAABwAEBAAAAAcEBAQAAAAHDAQAAAMMBAsUBAAAAxQECxwEAAADHAQLIAUAAAAABCgMAANUCACCmAQEAAAABpwEBAAAAAawBQAAAAAGtAUAAAAABugEBAAAAAbsBAQAAAAG8AUAAAAABvgEAAAC-AQK_AQEAAAABAgAAABEAIBkAAIgDACADAAAAEQAgGQAAiAMAIBoAAIcDACABEgAAlQQAMA8DAAC0AgAgBgAAvQIAIKMBAAC-AgAwpAEAAA8AEKUBAAC-AgAwpgEBAAAAAacBAQChAgAhrAFAAKICACGtAUAAogIAIbkBAQChAgAhugEBAKECACG7AQEAqwIAIbwBQACiAgAhvgEAAL8CvgEivwEBAKsCACECAAAAEQAgEgAAhwMAIAIAAACFAwAgEgAAhgMAIA2jAQAAhAMAMKQBAACFAwAQpQEAAIQDADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIbkBAQChAgAhugEBAKECACG7AQEAqwIAIbwBQACiAgAhvgEAAL8CvgEivwEBAKsCACENowEAAIQDADCkAQAAhQMAEKUBAACEAwAwpgEBAKECACGnAQEAoQIAIawBQACiAgAhrQFAAKICACG5AQEAoQIAIboBAQChAgAhuwEBAKsCACG8AUAAogIAIb4BAAC_Ar4BIr8BAQCrAgAhCaYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIa0BQADMAgAhugEBAMoCACG7AQEAywIAIbwBQADMAgAhvgEAANICvgEivwEBAMsCACEKAwAA0wIAIKYBAQDKAgAhpwEBAMoCACGsAUAAzAIAIa0BQADMAgAhugEBAMoCACG7AQEAywIAIbwBQADMAgAhvgEAANICvgEivwEBAMsCACEKAwAA1QIAIKYBAQAAAAGnAQEAAAABrAFAAAAAAa0BQAAAAAG6AQEAAAABuwEBAAAAAbwBQAAAAAG-AQAAAL4BAr8BAQAAAAEDGQAAkwQAIP8BAACUBAAghQIAAAEAIAQZAAD9AgAw_wEAAP4CADCBAgAAgAMAIIUCAACBAwAwBBkAAPECADD_AQAA8gIAMIECAAD0AgAghQIAAPUCADAAAAAAAAAFGQAAjgQAIBoAAJEEACD_AQAAjwQAIIACAACQBAAghQIAAAEAIAMZAACOBAAg_wEAAI8EACCFAgAAAQAgAAAABRkAAIkEACAaAACMBAAg_wEAAIoEACCAAgAAiwQAIIUCAAABACADGQAAiQQAIP8BAACKBAAghQIAAAEAIAAAAAGCAiAAAAABCxkAAOYDADAaAADrAwAw_wEAAOcDADCAAgAA6AMAMIECAADpAwAgggIAAOoDADCDAgAA6gMAMIQCAADqAwAwhQIAAOoDADCGAgAA7AMAMIcCAADtAwAwCxkAANoDADAaAADfAwAw_wEAANsDADCAAgAA3AMAMIECAADdAwAgggIAAN4DADCDAgAA3gMAMIQCAADeAwAwhQIAAN4DADCGAgAA4AMAMIcCAADhAwAwCxkAAM4DADAaAADTAwAw_wEAAM8DADCAAgAA0AMAMIECAADRAwAgggIAANIDADCDAgAA0gMAMIQCAADSAwAwhQIAANIDADCGAgAA1AMAMIcCAADVAwAwCxkAAMUDADAaAADJAwAw_wEAAMYDADCAAgAAxwMAMIECAADIAwAgggIAAIEDADCDAgAAgQMAMIQCAACBAwAwhQIAAIEDADCGAgAAygMAMIcCAACEAwAwCxkAALwDADAaAADAAwAw_wEAAL0DADCAAgAAvgMAMIECAAC_AwAgggIAAPUCADCDAgAA9QIAMIQCAAD1AgAwhQIAAPUCADCGAgAAwQMAMIcCAAD4AgAwCxkAALADADAaAAC1AwAw_wEAALEDADCAAgAAsgMAMIECAACzAwAgggIAALQDADCDAgAAtAMAMIQCAAC0AwAwhQIAALQDADCGAgAAtgMAMIcCAAC3AwAwCxkAAKQDADAaAACpAwAw_wEAAKUDADCAAgAApgMAMIECAACnAwAgggIAAKgDADCDAgAAqAMAMIQCAACoAwAwhQIAAKgDADCGAgAAqgMAMIcCAACrAwAwB6YBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEAAAABrAFAAAAAAa0BQAAAAAECAAAAIQAgGQAArwMAIAMAAAAhACAZAACvAwAgGgAArgMAIAESAACIBAAwDAMAALQCACCjAQAAswIAMKQBAAAfABClAQAAswIAMKYBAQAAAAGnAQEAoQIAIagBAQChAgAhqQEBAKsCACGqAQEAqwIAIasBAQCrAgAhrAFAAKICACGtAUAAogIAIQIAAAAhACASAACuAwAgAgAAAKwDACASAACtAwAgC6MBAACrAwAwpAEAAKwDABClAQAAqwMAMKYBAQChAgAhpwEBAKECACGoAQEAoQIAIakBAQCrAgAhqgEBAKsCACGrAQEAqwIAIawBQACiAgAhrQFAAKICACELowEAAKsDADCkAQAArAMAEKUBAACrAwAwpgEBAKECACGnAQEAoQIAIagBAQChAgAhqQEBAKsCACGqAQEAqwIAIasBAQCrAgAhrAFAAKICACGtAUAAogIAIQemAQEAygIAIagBAQDKAgAhqQEBAMsCACGqAQEAywIAIasBAQDLAgAhrAFAAMwCACGtAUAAzAIAIQemAQEAygIAIagBAQDKAgAhqQEBAMsCACGqAQEAywIAIasBAQDLAgAhrAFAAMwCACGtAUAAzAIAIQemAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAAAAAawBQAAAAAGtAUAAAAABB6YBAQAAAAGsAUAAAAABrQFAAAAAAcoBAAAAygECywEBAAAAAcwBAQAAAAHNAQEAAAABAgAAAB0AIBkAALsDACADAAAAHQAgGQAAuwMAIBoAALoDACABEgAAhwQAMA0DAAC0AgAgowEAALYCADCkAQAAGwAQpQEAALYCADCmAQEAAAABpwEBAKECACGsAUAAogIAIa0BQACiAgAhygEAALcCygEiywEBAKECACHMAQEAqwIAIc0BAQChAgAh_AEAALUCACACAAAAHQAgEgAAugMAIAIAAAC4AwAgEgAAuQMAIAujAQAAtwMAMKQBAAC4AwAQpQEAALcDADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIcoBAAC3AsoBIssBAQChAgAhzAEBAKsCACHNAQEAoQIAIQujAQAAtwMAMKQBAAC4AwAQpQEAALcDADCmAQEAoQIAIacBAQChAgAhrAFAAKICACGtAUAAogIAIcoBAAC3AsoBIssBAQChAgAhzAEBAKsCACHNAQEAoQIAIQemAQEAygIAIawBQADMAgAhrQFAAMwCACHKAQAA5QLKASLLAQEAygIAIcwBAQDLAgAhzQEBAMoCACEHpgEBAMoCACGsAUAAzAIAIa0BQADMAgAhygEAAOUCygEiywEBAMoCACHMAQEAywIAIc0BAQDKAgAhB6YBAQAAAAGsAUAAAAABrQFAAAAAAcoBAAAAygECywEBAAAAAcwBAQAAAAHNAQEAAAABCgYAAOECACCmAQEAAAABrAFAAAAAAbkBAQAAAAHAAQEAAAABwQEBAAAAAcMBAAAAwwECxQEAAADFAQLHAQAAAMcBAsgBQAAAAAECAAAAFQAgGQAAxAMAIAMAAAAVACAZAADEAwAgGgAAwwMAIAESAACGBAAwAgAAABUAIBIAAMMDACACAAAA-QIAIBIAAMIDACAJpgEBAMoCACGsAUAAzAIAIbkBAQDKAgAhwAEBAMoCACHBAQEAygIAIcMBAADaAsMBIsUBAADbAsUBIscBAADcAscBIsgBQADdAgAhCgYAAN8CACCmAQEAygIAIawBQADMAgAhuQEBAMoCACHAAQEAygIAIcEBAQDKAgAhwwEAANoCwwEixQEAANsCxQEixwEAANwCxwEiyAFAAN0CACEKBgAA4QIAIKYBAQAAAAGsAUAAAAABuQEBAAAAAcABAQAAAAHBAQEAAAABwwEAAADDAQLFAQAAAMUBAscBAAAAxwECyAFAAAAAAQoGAADWAgAgpgEBAAAAAawBQAAAAAGtAUAAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAFAAAAAAb4BAAAAvgECvwEBAAAAAQIAAAARACAZAADNAwAgAwAAABEAIBkAAM0DACAaAADMAwAgARIAAIUEADACAAAAEQAgEgAAzAMAIAIAAACFAwAgEgAAywMAIAmmAQEAygIAIawBQADMAgAhrQFAAMwCACG5AQEAygIAIboBAQDKAgAhuwEBAMsCACG8AUAAzAIAIb4BAADSAr4BIr8BAQDLAgAhCgYAANQCACCmAQEAygIAIawBQADMAgAhrQFAAMwCACG5AQEAygIAIboBAQDKAgAhuwEBAMsCACG8AUAAzAIAIb4BAADSAr4BIr8BAQDLAgAhCgYAANYCACCmAQEAAAABrAFAAAAAAa0BQAAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AUAAAAABvgEAAAC-AQK_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_AQAA5wMAMIECAADpAwAghQIAAOoDADAEGQAA2gMAMP8BAADbAwAwgQIAAN0DACCFAgAA3gMAMAQZAADOAwAw_wEAAM8DADCBAgAA0QMAIIUCAADSAwAwBBkAAMUDADD_AQAAxgMAMIECAADIAwAghQIAAIEDADAEGQAAvAMAMP8BAAC9AwAwgQIAAL8DACCFAgAA9QIAMAQZAACwAwAw_wEAALEDADCBAgAAswMAIIUCAAC0AwAwBBkAAKQDADD_AQAApQMAMIECAACnAwAghQIAAKgDADAAAAAAAAAAEQQAAPkDACAFAAD6AwAgBwAA_AMAIAgAAP0DACAKAAD7AwAgCwAA_gMAIAwAAP8DACDvAQAAxgIAIPABAADGAgAg8QEAAMYCACDyAQAAxgIAIPMBAADGAgAg9AEAAMYCACD1AQAAxgIAIPYBAADGAgAg9wEAAMYCACD4AQAAxgIAIAoDAACABAAgBwAA_AMAIAgAAP0DACCrAQAAxgIAINIBAADGAgAg0wEAAMYCACDUAQAAxgIAINUBAADGAgAg1gEAAMYCACDdAQAAxgIAIAemAQEAAAABrAFAAAAAAa0BQAAAAAHgAUAAAAAB6gEBAAAAAesBAQAAAAHsAQEAAAABDKYBAQAAAAGsAUAAAAABrQFAAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAROmAQEAAAABqwEBAAAAAawBQAAAAAGtAUAAAAABxwEAAADYAQLKAQAAAMoBAs4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAdkBAAAA2QEC2wEAAADbAQLcAQAAAMcBAt0BQAAAAAEJpgEBAAAAAawBQAAAAAGtAUAAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAFAAAAAAb4BAAAAvgECvwEBAAAAAQmmAQEAAAABrAFAAAAAAbkBAQAAAAHAAQEAAAABwQEBAAAAAcMBAAAAwwECxQEAAADFAQLHAQAAAMcBAsgBQAAAAAEHpgEBAAAAAawBQAAAAAGtAUAAAAABygEAAADKAQLLAQEAAAABzAEBAAAAAc0BAQAAAAEHpgEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQAAAAGsAUAAAAABrQFAAAAAARYFAADzAwAgBwAA9QMAIAgAAPYDACAKAAD0AwAgCwAA9wMAIAwAAPgDACCmAQEAAAABqAEBAAAAAawBQAAAAAGtAUAAAAAB7QEBAAAAAe4BIAAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAABAgAAAAEAIBkAAIkEACADAAAAKwAgGQAAiQQAIBoAAI0EACAYAAAAKwAgBQAAngMAIAcAAKADACAIAAChAwAgCgAAnwMAIAsAAKIDACAMAACjAwAgEgAAjQQAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgUAAJ4DACAHAACgAwAgCAAAoQMAIAoAAJ8DACALAACiAwAgDAAAowMAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgQAAPIDACAHAAD1AwAgCAAA9gMAIAoAAPQDACALAAD3AwAgDAAA-AMAIKYBAQAAAAGoAQEAAAABrAFAAAAAAa0BQAAAAAHtAQEAAAAB7gEgAAAAAe8BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAECAAAAAQAgGQAAjgQAIAMAAAArACAZAACOBAAgGgAAkgQAIBgAAAArACAEAACdAwAgBwAAoAMAIAgAAKEDACAKAACfAwAgCwAAogMAIAwAAKMDACASAACSBAAgpgEBAMoCACGoAQEAygIAIawBQADMAgAhrQFAAMwCACHtAQEAygIAIe4BIACcAwAh7wEBAMsCACHwAQEAywIAIfEBAQDLAgAh8gEBAMsCACHzAQEAywIAIfQBAQDLAgAh9QEBAMsCACH2AQEAywIAIfcBAQDLAgAh-AEBAMsCACEWBAAAnQMAIAcAAKADACAIAAChAwAgCgAAnwMAIAsAAKIDACAMAACjAwAgpgEBAMoCACGoAQEAygIAIawBQADMAgAhrQFAAMwCACHtAQEAygIAIe4BIACcAwAh7wEBAMsCACHwAQEAywIAIfEBAQDLAgAh8gEBAMsCACHzAQEAywIAIfQBAQDLAgAh9QEBAMsCACH2AQEAywIAIfcBAQDLAgAh-AEBAMsCACEWBAAA8gMAIAUAAPMDACAHAAD1AwAgCAAA9gMAIAsAAPcDACAMAAD4AwAgpgEBAAAAAagBAQAAAAGsAUAAAAABrQFAAAAAAe0BAQAAAAHuASAAAAAB7wEBAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAQIAAAABACAZAACTBAAgCaYBAQAAAAGnAQEAAAABrAFAAAAAAa0BQAAAAAG6AQEAAAABuwEBAAAAAbwBQAAAAAG-AQAAAL4BAr8BAQAAAAEJpgEBAAAAAacBAQAAAAGsAUAAAAABwAEBAAAAAcEBAQAAAAHDAQAAAMMBAsUBAAAAxQECxwEAAADHAQLIAUAAAAABAwAAACsAIBkAAJMEACAaAACZBAAgGAAAACsAIAQAAJ0DACAFAACeAwAgBwAAoAMAIAgAAKEDACALAACiAwAgDAAAowMAIBIAAJkEACCmAQEAygIAIagBAQDKAgAhrAFAAMwCACGtAUAAzAIAIe0BAQDKAgAh7gEgAJwDACHvAQEAywIAIfABAQDLAgAh8QEBAMsCACHyAQEAywIAIfMBAQDLAgAh9AEBAMsCACH1AQEAywIAIfYBAQDLAgAh9wEBAMsCACH4AQEAywIAIRYEAACdAwAgBQAAngMAIAcAAKADACAIAAChAwAgCwAAogMAIAwAAKMDACCmAQEAygIAIagBAQDKAgAhrAFAAMwCACGtAUAAzAIAIe0BAQDKAgAh7gEgAJwDACHvAQEAywIAIfABAQDLAgAh8QEBAMsCACHyAQEAywIAIfMBAQDLAgAh9AEBAMsCACH1AQEAywIAIfYBAQDLAgAh9wEBAMsCACH4AQEAywIAIRYEAADyAwAgBQAA8wMAIAcAAPUDACAIAAD2AwAgCgAA9AMAIAwAAPgDACCmAQEAAAABqAEBAAAAAawBQAAAAAGtAUAAAAAB7QEBAAAAAe4BIAAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAABAgAAAAEAIBkAAJoEACADAAAAKwAgGQAAmgQAIBoAAJ4EACAYAAAAKwAgBAAAnQMAIAUAAJ4DACAHAACgAwAgCAAAoQMAIAoAAJ8DACAMAACjAwAgEgAAngQAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgQAAJ0DACAFAACeAwAgBwAAoAMAIAgAAKEDACAKAACfAwAgDAAAowMAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgMAAIkDACAHAACKAwAgpgEBAAAAAacBAQAAAAGrAQEAAAABrAFAAAAAAa0BQAAAAAHHAQAAANgBAsoBAAAAygECzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAAB2QEAAADZAQLbAQAAANsBAtwBAAAAxwEC3QFAAAAAAQIAAAANACAZAACfBAAgFgQAAPIDACAFAADzAwAgBwAA9QMAIAoAAPQDACALAAD3AwAgDAAA-AMAIKYBAQAAAAGoAQEAAAABrAFAAAAAAa0BQAAAAAHtAQEAAAAB7gEgAAAAAe8BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAECAAAAAQAgGQAAoQQAIAMAAAALACAZAACfBAAgGgAApQQAIBgAAAALACADAADuAgAgBwAA7wIAIBIAAKUEACCmAQEAygIAIacBAQDKAgAhqwEBAMsCACGsAUAAzAIAIa0BQADMAgAhxwEAAOsC2AEiygEAAOUCygEizgEBAMoCACHPAQEAygIAIdABAQDKAgAh0QEBAMoCACHSAQEAywIAIdMBAQDLAgAh1AEBAMsCACHVAQEAywIAIdYBAQDLAgAh2QEAAOwC2QEi2wEAAO0C2wEi3AEAANwCxwEi3QFAAN0CACEWAwAA7gIAIAcAAO8CACCmAQEAygIAIacBAQDKAgAhqwEBAMsCACGsAUAAzAIAIa0BQADMAgAhxwEAAOsC2AEiygEAAOUCygEizgEBAMoCACHPAQEAygIAIdABAQDKAgAh0QEBAMoCACHSAQEAywIAIdMBAQDLAgAh1AEBAMsCACHVAQEAywIAIdYBAQDLAgAh2QEAAOwC2QEi2wEAAO0C2wEi3AEAANwCxwEi3QFAAN0CACEDAAAAKwAgGQAAoQQAIBoAAKgEACAYAAAAKwAgBAAAnQMAIAUAAJ4DACAHAACgAwAgCgAAnwMAIAsAAKIDACAMAACjAwAgEgAAqAQAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgQAAJ0DACAFAACeAwAgBwAAoAMAIAoAAJ8DACALAACiAwAgDAAAowMAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgMAAIkDACAIAACLAwAgpgEBAAAAAacBAQAAAAGrAQEAAAABrAFAAAAAAa0BQAAAAAHHAQAAANgBAsoBAAAAygECzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAAB2QEAAADZAQLbAQAAANsBAtwBAAAAxwEC3QFAAAAAAQIAAAANACAZAACpBAAgFgQAAPIDACAFAADzAwAgCAAA9gMAIAoAAPQDACALAAD3AwAgDAAA-AMAIKYBAQAAAAGoAQEAAAABrAFAAAAAAa0BQAAAAAHtAQEAAAAB7gEgAAAAAe8BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAECAAAAAQAgGQAAqwQAIAMAAAALACAZAACpBAAgGgAArwQAIBgAAAALACADAADuAgAgCAAA8AIAIBIAAK8EACCmAQEAygIAIacBAQDKAgAhqwEBAMsCACGsAUAAzAIAIa0BQADMAgAhxwEAAOsC2AEiygEAAOUCygEizgEBAMoCACHPAQEAygIAIdABAQDKAgAh0QEBAMoCACHSAQEAywIAIdMBAQDLAgAh1AEBAMsCACHVAQEAywIAIdYBAQDLAgAh2QEAAOwC2QEi2wEAAO0C2wEi3AEAANwCxwEi3QFAAN0CACEWAwAA7gIAIAgAAPACACCmAQEAygIAIacBAQDKAgAhqwEBAMsCACGsAUAAzAIAIa0BQADMAgAhxwEAAOsC2AEiygEAAOUCygEizgEBAMoCACHPAQEAygIAIdABAQDKAgAh0QEBAMoCACHSAQEAywIAIdMBAQDLAgAh1AEBAMsCACHVAQEAywIAIdYBAQDLAgAh2QEAAOwC2QEi2wEAAO0C2wEi3AEAANwCxwEi3QFAAN0CACEDAAAAKwAgGQAAqwQAIBoAALIEACAYAAAAKwAgBAAAnQMAIAUAAJ4DACAIAAChAwAgCgAAnwMAIAsAAKIDACAMAACjAwAgEgAAsgQAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgQAAJ0DACAFAACeAwAgCAAAoQMAIAoAAJ8DACALAACiAwAgDAAAowMAIKYBAQDKAgAhqAEBAMoCACGsAUAAzAIAIa0BQADMAgAh7QEBAMoCACHuASAAnAMAIe8BAQDLAgAh8AEBAMsCACHxAQEAywIAIfIBAQDLAgAh8wEBAMsCACH0AQEAywIAIfUBAQDLAgAh9gEBAMsCACH3AQEAywIAIfgBAQDLAgAhFgQAAPIDACAFAADzAwAgBwAA9QMAIAgAAPYDACAKAAD0AwAgCwAA9wMAIKYBAQAAAAGoAQEAAAABrAFAAAAAAa0BQAAAAAHtAQEAAAAB7gEgAAAAAe8BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAECAAAAAQAgGQAAswQAIAMAAAArACAZAACzBAAgGgAAtwQAIBgAAAArACAEAACdAwAgBQAAngMAIAcAAKADACAIAAChAwAgCgAAnwMAIAsAAKIDACASAAC3BAAgpgEBAMoCACGoAQEAygIAIawBQADMAgAhrQFAAMwCACHtAQEAygIAIe4BIACcAwAh7wEBAMsCACHwAQEAywIAIfEBAQDLAgAh8gEBAMsCACHzAQEAywIAIfQBAQDLAgAh9QEBAMsCACH2AQEAywIAIfcBAQDLAgAh-AEBAMsCACEWBAAAnQMAIAUAAJ4DACAHAACgAwAgCAAAoQMAIAoAAJ8DACALAACiAwAgpgEBAMoCACGoAQEAygIAIawBQADMAgAhrQFAAMwCACHtAQEAygIAIe4BIACcAwAh7wEBAMsCACHwAQEAywIAIfEBAQDLAgAh8gEBAMsCACHzAQEAywIAIfQBAQDLAgAh9QEBAMsCACH2AQEAywIAIfcBAQDLAgAh-AEBAMsCACEIBAYCBQoDBxkFCBoGCQAKCg4ECx4IDCIJAQMAAQEDAAEEAwABBxIFCBYGCQAHAgMAAQYABAIDAAEGAAQCBxcACBgAAQMAAQEDAAEHBCMABSQAByYACCcACiUACygADCkAAAAAAwkADx8AECAAEQAAAAMJAA8fABAgABEBAwABAQMAAQMJABYfABcgABgAAAADCQAWHwAXIAAYAQMAAQEDAAEDCQAdHwAeIAAfAAAAAwkAHR8AHiAAHwAAAAMJACUfACYgACcAAAADCQAlHwAmIAAnAQMAAQEDAAEDCQAsHwAtIAAuAAAAAwkALB8ALSAALgEDAAEBAwABAwkAMx8ANCAANQAAAAMJADMfADQgADUCAwABBgAEAgMAAQYABAMJADofADsgADwAAAADCQA6HwA7IAA8AgMAAQYABAIDAAEGAAQDCQBBHwBCIABDAAAAAwkAQR8AQiAAQwEDAAEBAwABAwkASB8ASSAASgAAAAMJAEgfAEkgAEoNAgEOKgEPLQEQLgERLwETMQEUMwsVNAwWNgEXOAsYOQ0bOgEcOwEdPAshPw4iQBIjQQIkQgIlQwImRAInRQIoRwIpSQsqShMrTAIsTgstTxQuUAIvUQIwUgsxVRUyVhkzVwM0WAM1WQM2WgM3WwM4XQM5Xws6YBo7YgM8ZAs9ZRs-ZgM_ZwNAaAtBaxxCbCBDbiFEbyFFciFGcyFHdCFIdiFJeAtKeSJLeyFMfQtNfiNOfyFPgAEhUIEBC1GEASRShQEoU4YBBFSHAQRViAEEVokBBFeKAQRYjAEEWY4BC1qPASlbkQEEXJMBC12UASpelQEEX5YBBGCXAQthmgErYpsBL2OcAQhknQEIZZ4BCGafAQhnoAEIaKIBCGmkAQtqpQEwa6cBCGypAQttqgExbqsBCG-sAQhwrQELcbABMnKxATZzsgEGdLMBBnW0AQZ2tQEGd7YBBni4AQZ5ugELersBN3u9AQZ8vwELfcABOH7BAQZ_wgEGgAHDAQuBAcYBOYIBxwE9gwHIAQWEAckBBYUBygEFhgHLAQWHAcwBBYgBzgEFiQHQAQuKAdEBPosB0wEFjAHVAQuNAdYBP44B1wEFjwHYAQWQAdkBC5EB3AFAkgHdAUSTAd4BCZQB3wEJlQHgAQmWAeEBCZcB4gEJmAHkAQmZAeYBC5oB5wFFmwHpAQmcAesBC50B7AFGngHtAQmfAe4BCaAB7wELoQHyAUeiAfMBSw"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EmailScalarFieldEnum: () => EmailScalarFieldEnum,
  JobScalarFieldEnum: () => JobScalarFieldEnum,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ResumeScalarFieldEnum: () => ResumeScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TopCompanyScalarFieldEnum: () => TopCompanyScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.4.0",
  engine: "ab56fe763f921d033a6c195e7ddeb3e255bdbb57"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Job: "Job",
  Resume: "Resume",
  Email: "Email",
  Task: "Task",
  TopCompany: "TopCompany"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  profileBio: "profileBio",
  resumeLink: "resumeLink",
  linkedinLink: "linkedinLink",
  portfolioLink: "portfolioLink",
  resumeContent: "resumeContent",
  skills: "skills",
  experience: "experience",
  education: "education",
  certifications: "certifications",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var JobScalarFieldEnum = {
  id: "id",
  userId: "userId",
  companyName: "companyName",
  companyEmail: "companyEmail",
  jobTitle: "jobTitle",
  jobDescription: "jobDescription",
  companyWebsite: "companyWebsite",
  companyLinkedin: "companyLinkedin",
  companyNumber: "companyNumber",
  location: "location",
  salary: "salary",
  notes: "notes",
  jobRole: "jobRole",
  status: "status",
  applyStatus: "applyStatus",
  responseStatus: "responseStatus",
  emailSendStatus: "emailSendStatus",
  applyDate: "applyDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ResumeScalarFieldEnum = {
  id: "id",
  userId: "userId",
  jobRole: "jobRole",
  fileUrl: "fileUrl",
  publicId: "publicId",
  fileName: "fileName",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EmailScalarFieldEnum = {
  id: "id",
  userId: "userId",
  jobId: "jobId",
  subject: "subject",
  content: "content",
  aiProvider: "aiProvider",
  emailType: "emailType",
  status: "status",
  sentAt: "sentAt",
  createdAt: "createdAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  userId: "userId",
  jobId: "jobId",
  title: "title",
  taskLink: "taskLink",
  deadline: "deadline",
  submitStatus: "submitStatus",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TopCompanyScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  company: "company",
  webLink: "webLink",
  location: "location",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var JobStatus = {
  DRAFT: "DRAFT",
  APPLIED: "APPLIED",
  INTERVIEW: "INTERVIEW",
  REJECTED: "REJECTED",
  OFFER: "OFFER"
};
var JobRole = {
  FRONTEND_DEVELOPER: "FRONTEND_DEVELOPER",
  FRONTEND_ENGINEER: "FRONTEND_ENGINEER",
  BACKEND_DEVELOPER: "BACKEND_DEVELOPER",
  BACKEND_ENGINEER: "BACKEND_ENGINEER",
  MERN_STACK_DEVELOPER: "MERN_STACK_DEVELOPER",
  FULL_STACK_DEVELOPER: "FULL_STACK_DEVELOPER",
  SOFTWARE_ENGINEER: "SOFTWARE_ENGINEER",
  CMS_DEVELOPER: "CMS_DEVELOPER"
};
var ApplyStatus = {
  NOT_APPLIED: "NOT_APPLIED",
  APPLIED: "APPLIED"
};
var ResponseStatus = {
  NO_RESPONSE: "NO_RESPONSE",
  REPLIED: "REPLIED",
  REJECTED: "REJECTED",
  ACCEPTED: "ACCEPTED"
};
var EmailSendStatus = {
  NOT_SENT: "NOT_SENT",
  SENT: "SENT",
  FAILED: "FAILED"
};
var EmailType = {
  APPLICATION: "APPLICATION",
  REPLY: "REPLY"
};
var TaskStatus = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  OVERDUE: "OVERDUE"
};
var AIProvider = {
  OPENAI: "OPENAI",
  GEMINI: "GEMINI"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT || 8e3,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.CLIENT_URL,
  backend_url: process.env.BETTER_AUTH_URL,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};

// src/lib/prisma.ts
var connectionString = `${config_default.database_url}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  //...other options
  emailAndPassword: {
    enabled: true
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://job-mailer-ai.vercel.app",
    "https://api-job-mailer-ai.vercel.app"
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    trustHost: true,
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate entry. This record already exists.";
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  }
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation error";
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors
    });
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
};

// src/routes/index.ts
import { Router as Router7 } from "express";

// src/modules/Companies/companies.routes.ts
import { Router } from "express";

// src/errors/AppError.ts
var AppError = class extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/middlewares/auth.middleware.ts
var authenticate = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers)
    });
    if (!session) {
      throw new AppError(401, "Unauthorized. Please login to continue.");
    }
    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    next(error);
  }
};

// src/middlewares/validateRequest.ts
import { ZodError } from "zod";
var validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues
        });
      }
      next(error);
    }
  };
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};

// src/modules/Companies/companies.service.ts
var createCompany = async (userId, data) => {
  return await prisma.topCompany.create({
    data: { ...data, userId }
  });
};
var getCompanies = async (userId, options = {}) => {
  const { page = 1, limit = 10, search, type, location } = options;
  const validPage = Math.max(1, Number(page));
  const validLimit = Math.min(100, Math.max(1, Number(limit)));
  const skip = (validPage - 1) * validLimit;
  const where = { userId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    ];
  }
  if (type) where.company = type;
  if (location) where.location = { contains: location, mode: "insensitive" };
  const [data, total] = await Promise.all([
    prisma.topCompany.findMany({
      where,
      skip,
      take: validLimit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.topCompany.count({ where })
  ]);
  return {
    data,
    meta: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit)
    }
  };
};
var getCompanyById = async (userId, id) => {
  return await prisma.topCompany.findFirst({
    where: { id, userId }
  });
};
var updateCompany = async (userId, id, data) => {
  const company = await prisma.topCompany.findFirst({
    where: { id, userId }
  });
  if (!company) {
    throw new Error("Company not found");
  }
  return await prisma.topCompany.update({
    where: { id },
    data
  });
};
var deleteCompany = async (userId, id) => {
  const company = await prisma.topCompany.findFirst({
    where: { id, userId }
  });
  if (!company) {
    throw new Error("Company not found");
  }
  return await prisma.topCompany.delete({
    where: { id }
  });
};
var TopCompaniesService = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};

// src/modules/Companies/companies.controller.ts
var createCompany2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await TopCompaniesService.createCompany(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Top Company created successfully",
    data: result
  });
});
var getCompanies2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page, limit, search, type, location } = req.query;
  const result = await TopCompaniesService.getCompanies(userId, {
    page: page ? Number(page) : void 0,
    limit: limit ? Number(limit) : void 0,
    search,
    type,
    location
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top Companies retrieved successfully",
    data: result
  });
});
var getCompanyById2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await TopCompaniesService.getCompanyById(userId, id);
  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Top Company not found"
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top Company retrieved successfully",
    data: result
  });
});
var updateCompany2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await TopCompaniesService.updateCompany(userId, id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top Company updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var deleteCompany2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    await TopCompaniesService.deleteCompany(userId, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top Company deleted successfully"
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var TopCompaniesController = {
  createCompany: createCompany2,
  getCompanies: getCompanies2,
  getCompanyById: getCompanyById2,
  updateCompany: updateCompany2,
  deleteCompany: deleteCompany2
};

// src/modules/Companies/companies.validation.ts
import { z as z2 } from "zod";
var createCompanySchema = z2.object({
  body: z2.object({
    name: z2.string().min(1, "Name is required"),
    company: z2.string().optional(),
    webLink: z2.string().url("Invalid web link").optional().or(z2.literal("")),
    location: z2.string().optional()
  })
});
var updateCompanySchema = z2.object({
  body: z2.object({
    name: z2.string().optional(),
    company: z2.string().optional(),
    webLink: z2.string().url("Invalid web link").optional().or(z2.literal("")),
    location: z2.string().optional()
  })
});
var TopCompanyValidation = {
  createCompanySchema,
  updateCompanySchema
};

// src/modules/Companies/companies.routes.ts
var router = Router();
router.use(authenticate);
router.post("/", validateRequest(TopCompanyValidation.createCompanySchema), TopCompaniesController.createCompany);
router.get("/", TopCompaniesController.getCompanies);
router.get("/:id", TopCompaniesController.getCompanyById);
router.patch("/:id", validateRequest(TopCompanyValidation.updateCompanySchema), TopCompaniesController.updateCompany);
router.delete("/:id", TopCompaniesController.deleteCompany);
var companies_routes_default = router;

// src/modules/Emails/emails.routes.ts
import { Router as Router2 } from "express";

// src/utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: config_default.cloudinary.cloud_name,
  api_key: config_default.cloudinary.api_key,
  api_secret: config_default.cloudinary.api_secret
});
var uploadToCloudinary = async (buffer, folder, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: fileName.split(".")[0],
        // Remove extension for public_id
        access_mode: "public",
        type: "upload"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
var deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
var fetchFileBuffer = async (publicId) => {
  try {
    const metadata = await cloudinary.api.resource(publicId);
    const expiresAt = Math.floor(Date.now() / 1e3) + 3600;
    const url = cloudinary.utils.private_download_url(
      publicId,
      metadata.format,
      {
        resource_type: metadata.resource_type || "image",
        type: metadata.type || "upload",
        expires_at: expiresAt
      }
    );
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.status}`
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw error;
  }
};
var CloudinaryUtils = {
  uploadToCloudinary,
  deleteFromCloudinary,
  fetchFileBuffer
};
var cloudinaryUpload = cloudinary;

// src/modules/Resumes/resumes.service.ts
var getResumes = async (userId) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
};
var getResumeById = async (userId, id) => {
  return prisma.resume.findFirst({ where: { id, userId } });
};
var createResume = async (input) => {
  const { userId, jobRole, fileName, fileUrl, publicId } = input;
  const existing = await prisma.resume.findUnique({
    where: { userId_jobRole: { userId, jobRole } }
  });
  if (existing) {
    await CloudinaryUtils.deleteFromCloudinary(publicId);
    const err = new Error(
      "Resume already exists for this role. Please replace it instead."
    );
    err.statusCode = 409;
    throw err;
  }
  try {
    return await prisma.resume.create({
      data: {
        userId,
        jobRole,
        fileUrl,
        publicId,
        fileName
      }
    });
  } catch (dbError) {
    await CloudinaryUtils.deleteFromCloudinary(publicId);
    throw dbError;
  }
};
var updateResume = async (input) => {
  const { userId, id, jobRole, fileName, fileUrl, publicId } = input;
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    if (publicId) {
      await CloudinaryUtils.deleteFromCloudinary(publicId);
    }
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }
  const nextRole = jobRole ?? resume.jobRole;
  const nextFileUrl = fileUrl ?? resume.fileUrl;
  const nextPublicId = publicId ?? resume.publicId;
  const nextFileName = fileName ?? resume.fileName;
  try {
    const updated = await prisma.resume.update({
      where: { id },
      data: {
        jobRole: nextRole,
        fileUrl: nextFileUrl,
        publicId: nextPublicId,
        fileName: nextFileName
      }
    });
    if (publicId && resume.publicId && publicId !== resume.publicId) {
      await CloudinaryUtils.deleteFromCloudinary(resume.publicId);
    }
    return updated;
  } catch (e) {
    if (publicId) {
      await CloudinaryUtils.deleteFromCloudinary(publicId);
    }
    if (e instanceof prismaNamespace_exports.PrismaClientKnownRequestError && e.code === "P2002") {
      const err = new Error(
        "You already have a resume for that role. Delete it first or choose another role."
      );
      err.statusCode = 409;
      throw err;
    }
    throw e;
  }
};
var deleteResume = async (userId, id) => {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }
  if (resume.publicId) {
    await CloudinaryUtils.deleteFromCloudinary(resume.publicId);
  }
  await prisma.resume.delete({ where: { id } });
};
var getResumeFile = async (userId, id) => {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }
  return { resume, fileUrl: resume.fileUrl, publicId: resume.publicId };
};
var getResumeByUserAndRole = async (userId, jobRole) => {
  return prisma.resume.findUnique({
    where: { userId_jobRole: { userId, jobRole } }
  });
};
var ResumesService = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getResumeFile,
  getResumeByUserAndRole
};

// src/modules/Emails/emails.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// src/config/email.config.ts
import dotenv2 from "dotenv";
import nodemailer from "nodemailer";
dotenv2.config();
var emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
emailTransporter.verify(() => {
});

// src/config/gemini.config.ts
import dotenv3 from "dotenv";
dotenv3.config();
var geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || "",
  model: "gemini-2.0-flash",
  maxTokens: 1e3
};

// src/config/openai.config.ts
import dotenv4 from "dotenv";
dotenv4.config();
var openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || "",
  model: "gpt-4o-mini",
  maxTokens: 1e3
};

// src/modules/Emails/emails.service.ts
var openai = new OpenAI({ apiKey: openaiConfig.apiKey });
var genAI = geminiConfig.apiKey ? new GoogleGenerativeAI(geminiConfig.apiKey) : null;
function buildApplicationPrompt(input) {
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
function buildReplyPrompt(input) {
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
${userData.resumeContent ? `Resume Context:
${userData.resumeContent}` : ""}

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
async function generateWithOpenAI(prompt) {
  const completion = await openai.chat.completions.create({
    model: openaiConfig.model,
    messages: [
      {
        role: "system",
        content: "You are an expert at writing professional job application emails and replies."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: openaiConfig.maxTokens,
    temperature: 0.7
  });
  return completion.choices[0].message.content || "";
}
async function generateWithGemini(prompt) {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }
  const model = genAI.getGenerativeModel({ model: geminiConfig.model });
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      maxOutputTokens: geminiConfig.maxTokens,
      temperature: 0.7
    }
  });
  const response = await result.response;
  return response.text();
}
function parseEmailResponse(response) {
  const subjectMatch = response.match(/SUBJECT:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Application Email";
  const content = response.replace(/SUBJECT:\s*.+/i, "").trim().replace(/^[-\s]*/gm, "");
  return { subject, content };
}
var generateApplicationEmail = async (input) => {
  const { aiProvider } = input;
  const prompt = buildApplicationPrompt(input);
  try {
    let response;
    if (aiProvider === AIProvider.OPENAI) {
      response = await generateWithOpenAI(prompt);
    } else if (aiProvider === AIProvider.GEMINI) {
      response = await generateWithGemini(prompt);
    } else {
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
    const { subject, content } = parseEmailResponse(response);
    return { subject, content };
  } catch (error) {
    const providerName = aiProvider === AIProvider.OPENAI ? "OpenAI" : "Gemini";
    throw new Error(`${providerName} generation failed: ${error.message}`);
  }
};
var generateReplyEmail = async (input) => {
  const { aiProvider } = input;
  const prompt = buildReplyPrompt(input);
  try {
    let response;
    if (aiProvider === AIProvider.OPENAI) {
      response = await generateWithOpenAI(prompt);
    } else if (aiProvider === AIProvider.GEMINI) {
      response = await generateWithGemini(prompt);
    } else {
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
    const { subject, content } = parseEmailResponse(response);
    return { subject, content };
  } catch (error) {
    const providerName = aiProvider === AIProvider.OPENAI ? "OpenAI" : "Gemini";
    throw new Error(`${providerName} generation failed: ${error.message}`);
  }
};
var sendEmail = async (to, subject, content, userId, jobId, emailType, aiProvider, attachment) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });
    if (!user) {
      throw new Error("User not found");
    }
    let emailAttachments = [];
    if (attachment) {
      if (attachment.path.startsWith("http")) {
        try {
          let buffer;
          if (attachment.publicId) {
            buffer = await CloudinaryUtils.fetchFileBuffer(attachment.publicId);
          } else {
            const response = await fetch(attachment.path);
            if (!response.ok)
              throw new Error(`Direct fetch failed: ${response.status}`);
            buffer = Buffer.from(await response.arrayBuffer());
          }
          emailAttachments.push({
            filename: attachment.filename,
            content: buffer,
            contentType: attachment.contentType || "application/pdf"
          });
        } catch (fetchError) {
          throw new Error(`Email attachment failure: ${fetchError.message}`);
        }
      } else {
        emailAttachments.push(attachment);
      }
    }
    await emailTransporter.sendMail({
      from: `"${user.name}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: content,
      html: content.replace(/\n/g, "<br>"),
      attachments: emailAttachments
    });
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
        aiProvider,
        emailType,
        status: EmailSendStatus.SENT,
        sentAt: /* @__PURE__ */ new Date()
      }
    });
    await prisma.job.update({
      where: { id: jobId },
      data: {
        emailSendStatus: EmailSendStatus.SENT,
        ...emailType === EmailType.APPLICATION && {
          applyStatus: "APPLIED",
          applyDate: /* @__PURE__ */ new Date(),
          status: "APPLIED"
        }
      }
    });
    return email;
  } catch (error) {
    const email = await prisma.email.create({
      data: {
        userId,
        jobId,
        subject,
        content,
        aiProvider,
        emailType,
        status: EmailSendStatus.FAILED
      }
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
var getEmails = async (userId, filters = {}) => {
  const { emailType, jobId, page = "1", limit = "10" } = filters;
  const validPage = Math.max(1, Number(page) || 1);
  const validLimit = Math.max(1, Number(limit) || 10);
  const skip = (validPage - 1) * validLimit;
  const take = validLimit;
  const where = { userId };
  if (emailType) where.emailType = emailType;
  if (jobId) where.jobId = jobId;
  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            companyEmail: true,
            location: true
          }
        }
      }
    }),
    prisma.email.count({ where })
  ]);
  return {
    data: emails,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};
var getEmailById = async (userId, emailId) => {
  return await prisma.email.findFirst({
    where: {
      id: emailId,
      userId
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
          companyEmail: true
        }
      }
    }
  });
};
var deleteEmail = async (userId, emailId) => {
  return await prisma.email.delete({
    where: {
      id: emailId,
      userId
    }
  });
};
var EmailsService = {
  generateApplicationEmail,
  generateReplyEmail,
  sendEmail,
  getEmails,
  getEmailById,
  deleteEmail
};

// src/modules/Emails/emails.controller.ts
var generateApplicationEmail2 = catchAsync(
  async (req, res) => {
    const userId = req.user.id;
    const { jobId, aiProvider = AIProvider.OPENAI } = req.body;
    if (!Object.values(AIProvider).includes(aiProvider)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid AI provider. Must be OPENAI or GEMINI"
      });
    }
    const job = await prisma.job.findFirst({
      where: { id: jobId, userId }
    });
    if (!job) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Job not found"
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found"
      });
    }
    try {
      const result = await EmailsService.generateApplicationEmail({
        jobData: {
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          jobRole: job.jobRole,
          jobDescription: job.jobDescription,
          companyEmail: job.companyEmail
        },
        userData: {
          name: user.name,
          email: user.email,
          profileBio: user.profileBio || void 0,
          resumeContent: user.resumeContent || void 0,
          skills: user.skills || void 0,
          experience: user.experience || void 0,
          education: user.education || void 0,
          certifications: user.certifications || void 0,
          linkedinLink: user.linkedinLink || void 0,
          portfolioLink: user.portfolioLink || void 0
        },
        aiProvider
      });
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Application email generated successfully",
        data: result
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message
      });
    }
  }
);
var generateReplyEmail2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { emailId, userPrompt, aiProvider = AIProvider.OPENAI } = req.body;
  if (!Object.values(AIProvider).includes(aiProvider)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid AI provider. Must be OPENAI or GEMINI"
    });
  }
  const originalEmail = await EmailsService.getEmailById(userId, emailId);
  if (!originalEmail) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Email not found"
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found"
    });
  }
  try {
    const result = await EmailsService.generateReplyEmail({
      originalEmail: {
        subject: originalEmail.subject,
        content: originalEmail.content
      },
      userPrompt,
      userData: {
        name: user.name,
        resumeContent: user.resumeContent || void 0,
        skills: user.skills || void 0
      },
      aiProvider
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reply email generated successfully",
      data: { ...result, jobId: originalEmail.jobId }
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message
    });
  }
});
var sendEmail2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    jobId,
    subject,
    content,
    emailType,
    aiProvider = AIProvider.OPENAI
  } = req.body;
  if (!Object.values(AIProvider).includes(aiProvider)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid AI provider. Must be OPENAI or GEMINI"
    });
  }
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId }
  });
  if (!job) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Job not found"
    });
  }
  try {
    const resume = await ResumesService.getResumeByUserAndRole(
      userId,
      job.jobRole
    );
    if (!resume) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "No resume uploaded for this role. Please upload resume first."
      });
    }
    const { fileUrl } = await ResumesService.getResumeFile(userId, resume.id);
    const result = await EmailsService.sendEmail(
      job.companyEmail,
      subject,
      content,
      userId,
      jobId,
      emailType,
      aiProvider,
      {
        filename: resume.fileName,
        path: fileUrl,
        publicId: resume.publicId ?? void 0,
        contentType: "application/pdf"
      }
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Email sent successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message
    });
  }
});
var getEmails2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = req.query;
  const result = await EmailsService.getEmails(userId, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Emails retrieved successfully",
    data: result
  });
});
var getEmailById2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await EmailsService.getEmailById(userId, id);
  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Email not found"
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email retrieved successfully",
    data: result
  });
});
var deleteEmail2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await EmailsService.deleteEmail(userId, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email deleted successfully",
    data: result
  });
});
var EmailsController = {
  generateApplicationEmail: generateApplicationEmail2,
  generateReplyEmail: generateReplyEmail2,
  sendEmail: sendEmail2,
  getEmails: getEmails2,
  getEmailById: getEmailById2,
  deleteEmail: deleteEmail2
};

// src/modules/Emails/emails.validation.ts
import { z as z3 } from "zod";
var generateApplicationEmailSchema = z3.object({
  body: z3.object({
    jobId: z3.string().uuid(),
    aiProvider: z3.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI)
  })
});
var generateReplyEmailSchema = z3.object({
  body: z3.object({
    emailId: z3.string().uuid(),
    userPrompt: z3.string().min(1, "Prompt is required"),
    aiProvider: z3.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI)
  })
});
var sendEmailSchema = z3.object({
  body: z3.object({
    jobId: z3.string().uuid(),
    subject: z3.string().min(1, "Subject is required"),
    content: z3.string().min(1, "Content is required"),
    emailType: z3.nativeEnum(EmailType),
    aiProvider: z3.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI)
  })
});
var getEmailsSchema = z3.object({
  query: z3.object({
    emailType: z3.nativeEnum(EmailType).optional(),
    jobId: z3.string().uuid().optional(),
    page: z3.string().optional(),
    limit: z3.string().optional()
  })
});
var getEmailSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid()
  })
});

// src/modules/Emails/emails.routes.ts
var router2 = Router2();
router2.use(authenticate);
router2.post(
  "/generate-application",
  validateRequest(generateApplicationEmailSchema),
  EmailsController.generateApplicationEmail
);
router2.post(
  "/generate-reply",
  validateRequest(generateReplyEmailSchema),
  EmailsController.generateReplyEmail
);
router2.post(
  "/send",
  validateRequest(sendEmailSchema),
  EmailsController.sendEmail
);
router2.get("/", validateRequest(getEmailsSchema), EmailsController.getEmails);
router2.get(
  "/:id",
  validateRequest(getEmailSchema),
  EmailsController.getEmailById
);
router2.delete(
  "/:id",
  validateRequest(getEmailSchema),
  EmailsController.deleteEmail
);
var emails_routes_default = router2;

// src/modules/Jobs/jobs.routes.ts
import { Router as Router3 } from "express";

// src/modules/Jobs/jobs.service.ts
var createJob = async (userId, data) => {
  return await prisma.job.create({
    data: {
      ...data,
      userId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
var getJobs = async (userId, filters = {}) => {
  const {
    status,
    applyStatus,
    responseStatus,
    jobRole,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  } = filters;
  const validPage = Math.max(1, Number(page) || 1);
  const validLimit = Math.max(1, Number(limit) || 10);
  const skip = (validPage - 1) * validLimit;
  const take = validLimit;
  const where = { userId };
  if (status) where.status = status;
  if (applyStatus) where.applyStatus = applyStatus;
  if (responseStatus) where.responseStatus = responseStatus;
  if (jobRole) {
    const roles = jobRole.split(",").map((r) => r.trim()).filter(Boolean);
    if (roles.length > 0) where.jobRole = { in: roles };
  }
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } }
    ];
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            tasks: true,
            emails: true
          }
        }
      }
    }),
    prisma.job.count({ where })
  ]);
  return {
    data: jobs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};
var getJobById = async (userId, jobId) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId
    },
    include: {
      tasks: {
        orderBy: { deadline: "asc" }
      },
      emails: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
  return job;
};
var updateJob = async (userId, jobId, data) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId }
  });
  if (!job) {
    throw new Error("Job not found");
  }
  return await prisma.job.update({
    where: { id: jobId },
    data
  });
};
var deleteJob = async (userId, jobId) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId }
  });
  if (!job) {
    throw new Error("Job not found");
  }
  return await prisma.job.delete({
    where: { id: jobId }
  });
};
var getJobStats = async (userId) => {
  const totalJobs = await prisma.job.count({ where: { userId } });
  const appliedJobs = await prisma.job.count({
    where: { userId, applyStatus: "APPLIED" }
  });
  const emailsSent = await prisma.email.count({
    where: { userId, status: "SENT" }
  });
  const responseStats = await prisma.job.groupBy({
    by: ["responseStatus"],
    where: { userId },
    _count: true
  });
  const jobStatusStats = await prisma.job.groupBy({
    by: ["status"],
    where: { userId },
    _count: true
  });
  const interviewCount = jobStatusStats.find((s) => s.status === "INTERVIEW")?._count || 0;
  const totalResponses = responseStats.reduce((acc, curr) => {
    if (curr.responseStatus !== "NO_RESPONSE") return acc + curr._count;
    return acc;
  }, 0);
  const responseRate = appliedJobs > 0 ? Math.round(totalResponses / appliedJobs * 100) : 0;
  return {
    totalJobs,
    appliedJobs,
    emailsSent,
    // Keeping this if needed elsewhere
    responseStats,
    // Keeping this if needed elsewhere
    interviewCount,
    responseRate
  };
};
var JobsService = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
};

// src/modules/Jobs/jobs.controller.ts
var createJob2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await JobsService.createJob(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Job created successfully",
    data: result
  });
});
var getJobs2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = req.query;
  const result = await JobsService.getJobs(userId, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs retrieved successfully",
    data: result
  });
});
var getJobById2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await JobsService.getJobById(userId, id);
  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Job not found"
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job retrieved successfully",
    data: result
  });
});
var updateJob2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await JobsService.updateJob(userId, id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Job updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var deleteJob2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    await JobsService.deleteJob(userId, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var getJobStats2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await JobsService.getJobStats(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job statistics retrieved successfully",
    data: result
  });
});
var JobsController = {
  createJob: createJob2,
  getJobs: getJobs2,
  getJobById: getJobById2,
  updateJob: updateJob2,
  deleteJob: deleteJob2,
  getJobStats: getJobStats2
};

// src/modules/Jobs/jobs.validation.ts
import { z as z4 } from "zod";
var createJobSchema = z4.object({
  body: z4.object({
    companyName: z4.string().min(1, "Company name is required"),
    companyEmail: z4.string().email("Invalid email address"),
    jobTitle: z4.string().min(1, "Job title is required"),
    jobDescription: z4.string().min(1, "Job description is required"),
    jobRole: z4.nativeEnum(JobRole, { message: "Job role is required" }),
    companyWebsite: z4.string().url().optional().or(z4.literal("")),
    companyLinkedin: z4.string().url().optional().or(z4.literal("")),
    companyNumber: z4.string().optional(),
    location: z4.string().optional(),
    salary: z4.string().optional(),
    notes: z4.string().optional()
  })
});
var updateJobSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid()
  }),
  body: z4.object({
    companyName: z4.string().min(1).optional(),
    companyEmail: z4.string().email().optional(),
    jobTitle: z4.string().min(1).optional(),
    jobDescription: z4.string().min(1).optional(),
    jobRole: z4.nativeEnum(JobRole).optional(),
    companyWebsite: z4.string().url().optional().or(z4.literal("")),
    companyLinkedin: z4.string().url().optional().or(z4.literal("")),
    companyNumber: z4.string().optional(),
    location: z4.string().optional(),
    salary: z4.string().optional(),
    notes: z4.string().optional(),
    status: z4.nativeEnum(JobStatus).optional(),
    applyStatus: z4.nativeEnum(ApplyStatus).optional(),
    responseStatus: z4.nativeEnum(ResponseStatus).optional()
  })
});
var getJobSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid()
  })
});
var deleteJobSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid()
  })
});
var getJobsSchema = z4.object({
  query: z4.object({
    status: z4.nativeEnum(JobStatus).optional(),
    applyStatus: z4.nativeEnum(ApplyStatus).optional(),
    responseStatus: z4.nativeEnum(ResponseStatus).optional(),
    // Multi-select supported via comma-separated string, e.g. jobRole=FRONTEND_DEVELOPER,BACKEND_ENGINEER
    jobRole: z4.string().optional(),
    search: z4.string().optional(),
    startDate: z4.string().optional(),
    endDate: z4.string().optional(),
    page: z4.string().optional(),
    limit: z4.string().optional()
  })
});

// src/modules/Jobs/jobs.routes.ts
var router3 = Router3();
router3.use(authenticate);
router3.get("/stats", JobsController.getJobStats);
router3.get("/stats/overview", JobsController.getJobStats);
router3.post("/", validateRequest(createJobSchema), JobsController.createJob);
router3.get("/", validateRequest(getJobsSchema), JobsController.getJobs);
router3.get("/:id", validateRequest(getJobSchema), JobsController.getJobById);
router3.put("/:id", validateRequest(updateJobSchema), JobsController.updateJob);
router3.delete(
  "/:id",
  validateRequest(deleteJobSchema),
  JobsController.deleteJob
);
var jobs_routes_default = router3;

// src/modules/Resumes/resumes.routes.ts
import { Router as Router4 } from "express";

// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `job-mailer/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      access_mode: "public"
    };
  }
});
var multerUpload = multer({ storage });

// src/modules/Resumes/resumes.validation.ts
import { z as z5 } from "zod";
var resumeIdSchema = z5.object({
  params: z5.object({
    id: z5.string().uuid()
  })
});
var getResumesSchema = z5.object({
  query: z5.object({}).optional()
});
var createResumeBodySchema = z5.object({
  jobRole: z5.nativeEnum(JobRole, { message: "Job role is required" })
});
var updateResumeBodySchema = z5.object({
  jobRole: z5.nativeEnum(JobRole).optional()
});

// src/modules/Resumes/resumes.controller.ts
var getResumes2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await ResumesService.getResumes(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Resumes retrieved successfully",
    data: result
  });
});
var createResume2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const parsed = createResumeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    if (req.file) {
      await CloudinaryUtils.deleteFromCloudinary(req.file.filename);
    }
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid request"
    });
  }
  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Please upload a resume file"
    });
  }
  try {
    const result = await ResumesService.createResume({
      userId,
      jobRole: parsed.data.jobRole,
      fileName: file.originalname,
      fileUrl: file.path,
      publicId: file.filename
    });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Resume uploaded successfully",
      data: result
    });
  } catch (e) {
    sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to upload resume"
    });
  }
});
var updateResume2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = String(req.params.id);
  const parsed = updateResumeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    if (req.file) {
      await CloudinaryUtils.deleteFromCloudinary(req.file.filename);
    }
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid request"
    });
  }
  const file = req.file;
  try {
    const result = await ResumesService.updateResume({
      userId,
      id,
      jobRole: parsed.data.jobRole,
      fileName: file?.originalname,
      fileUrl: file?.path,
      publicId: file?.filename
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resume updated successfully",
      data: result
    });
  } catch (e) {
    sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to update resume"
    });
  }
});
var deleteResume2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = String(req.params.id);
  try {
    await ResumesService.deleteResume(userId, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resume deleted successfully"
    });
  } catch (e) {
    sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to delete resume"
    });
  }
});
var downloadResumeFile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = String(req.params.id);
  try {
    const { publicId, resume } = await ResumesService.getResumeFile(userId, id);
    if (!publicId) {
      throw new Error("Resume public ID not found");
    }
    const buffer = await CloudinaryUtils.fetchFileBuffer(publicId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${resume.fileName}"`
    );
    return res.send(buffer);
  } catch (e) {
    return sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to download resume"
    });
  }
});
var ResumesController = {
  getResumes: getResumes2,
  createResume: createResume2,
  updateResume: updateResume2,
  deleteResume: deleteResume2,
  downloadResumeFile
};

// src/modules/Resumes/resumes.routes.ts
var router4 = Router4();
router4.use(authenticate);
router4.get("/", ResumesController.getResumes);
router4.post("/", multerUpload.single("file"), ResumesController.createResume);
router4.put("/:id", multerUpload.single("file"), ResumesController.updateResume);
router4.delete(
  "/:id",
  validateRequest(resumeIdSchema),
  ResumesController.deleteResume
);
router4.get(
  "/:id/file",
  validateRequest(resumeIdSchema),
  ResumesController.downloadResumeFile
);
var resumes_routes_default = router4;

// src/modules/Tasks/tasks.route.ts
import { Router as Router5 } from "express";

// src/modules/Tasks/tasks.service.ts
var createTask = async (userId, data) => {
  const job = await prisma.job.findFirst({
    where: { id: data.jobId, userId }
  });
  if (!job) {
    throw new Error("Job not found");
  }
  const now = /* @__PURE__ */ new Date();
  const deadline = new Date(data.deadline);
  const submitStatus = deadline < now ? TaskStatus.OVERDUE : TaskStatus.PENDING;
  return await prisma.task.create({
    data: {
      ...data,
      userId,
      submitStatus,
      deadline: new Date(data.deadline)
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true
        }
      }
    }
  });
};
var getTasks = async (userId, filters = {}) => {
  const { jobId, submitStatus, page = 1, limit = 10 } = filters;
  const validPage = Math.max(1, Number(page) || 1);
  const validLimit = Math.max(1, Number(limit) || 10);
  const skip = (validPage - 1) * validLimit;
  const take = validLimit;
  const where = { userId };
  if (jobId) where.jobId = jobId;
  if (submitStatus) where.submitStatus = submitStatus;
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { deadline: "asc" },
      include: {
        job: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true
          }
        }
      }
    }),
    prisma.task.count({ where })
  ]);
  return {
    data: tasks,
    meta: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit)
    }
  };
};
var getTasksByJobId = async (userId, jobId) => {
  return await prisma.task.findMany({
    where: {
      userId,
      jobId
    },
    orderBy: { deadline: "asc" },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true
        }
      }
    }
  });
};
var getTaskById = async (userId, taskId) => {
  return await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true
        }
      }
    }
  });
};
var updateTask = async (userId, taskId, data) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const updateData = { ...data };
  if (data.deadline) {
    updateData.deadline = new Date(data.deadline);
  }
  return await prisma.task.update({
    where: { id: taskId },
    data: updateData
  });
};
var deleteTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  return await prisma.task.delete({
    where: { id: taskId }
  });
};
var getUpcomingTasks = async (userId, limit = 5) => {
  const now = /* @__PURE__ */ new Date();
  const oneWeekFromNow = /* @__PURE__ */ new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  return await prisma.task.findMany({
    where: {
      userId,
      deadline: {
        gte: now,
        lte: oneWeekFromNow
      },
      submitStatus: TaskStatus.PENDING
    },
    orderBy: { deadline: "asc" },
    take: limit,
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true
        }
      }
    }
  });
};
var TasksService = {
  createTask,
  getTasks,
  getTasksByJobId,
  getTaskById,
  updateTask,
  deleteTask,
  getUpcomingTasks
};

// src/modules/Tasks/tasks.controller.ts
var createTask2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await TasksService.createTask(userId, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Task created successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message
    });
  }
});
var getTasks2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = req.query;
  const result = await TasksService.getTasks(userId, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result
  });
});
var getTaskById2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await TasksService.getTaskById(userId, id);
  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Task not found"
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: result
  });
});
var updateTask2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await TasksService.updateTask(
      userId,
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var deleteTask2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    await TasksService.deleteTask(userId, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
});
var getUpcomingTasks2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await TasksService.getUpcomingTasks(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Upcoming tasks retrieved successfully",
    data: result
  });
});
var getTasksByJobId2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await TasksService.getTasksByJobId(userId, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result
  });
});
var TasksController = {
  createTask: createTask2,
  getTasks: getTasks2,
  getTasksByJobId: getTasksByJobId2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  deleteTask: deleteTask2,
  getUpcomingTasks: getUpcomingTasks2
};

// src/modules/Tasks/tasks.validation.ts
import { z as z6 } from "zod";
var createTaskSchema = z6.object({
  body: z6.object({
    jobId: z6.string().uuid(),
    title: z6.string().min(1, "Title is required"),
    taskLink: z6.string().url().optional().or(z6.literal("")),
    deadline: z6.string().datetime(),
    description: z6.string().optional(),
    submitStatus: z6.nativeEnum(TaskStatus).optional()
  })
});
var updateTaskSchema = z6.object({
  params: z6.object({
    id: z6.string().uuid()
  }),
  body: z6.object({
    title: z6.string().min(1).optional(),
    taskLink: z6.string().url().optional().or(z6.literal("")),
    deadline: z6.string().datetime().optional(),
    submitStatus: z6.nativeEnum(TaskStatus).optional(),
    description: z6.string().optional()
  })
});
var getTaskSchema = z6.object({
  params: z6.object({
    id: z6.string().uuid()
  })
});
var deleteTaskSchema = z6.object({
  params: z6.object({
    id: z6.string().uuid()
  })
});
var getTasksSchema = z6.object({
  query: z6.object({
    jobId: z6.string().uuid().optional(),
    submitStatus: z6.nativeEnum(TaskStatus).optional(),
    page: z6.string().optional(),
    limit: z6.string().optional()
  })
});

// src/modules/Tasks/tasks.route.ts
var router5 = Router5();
router5.use(authenticate);
router5.get("/upcoming", TasksController.getUpcomingTasks);
router5.post("/", validateRequest(createTaskSchema), TasksController.createTask);
router5.get("/", validateRequest(getTasksSchema), TasksController.getTasks);
router5.get("/:id", validateRequest(getTaskSchema), TasksController.getTaskById);
router5.get(
  "/job/:id",
  validateRequest(getTaskSchema),
  TasksController.getTasksByJobId
);
router5.put(
  "/:id",
  validateRequest(updateTaskSchema),
  TasksController.updateTask
);
router5.delete(
  "/:id",
  validateRequest(deleteTaskSchema),
  TasksController.deleteTask
);
var tasks_route_default = router5;

// src/modules/Users/users.routes.ts
import { Router as Router6 } from "express";

// src/modules/Users/users.service.ts
var updateProfile = async (userId, data) => {
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
      updatedAt: true
    }
  });
};
var getProfile = async (userId) => {
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
      updatedAt: true
    }
  });
};
var getRecentActivity = async (userId, limit = 5) => {
  const [jobs, tasks, emails] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        createdAt: true,
        applyStatus: true
      }
    }),
    prisma.task.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: { id: true, title: true, updatedAt: true, submitStatus: true }
    }),
    prisma.email.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, subject: true, emailType: true, createdAt: true }
    })
  ]);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true }
  });
  const userName = user?.name || "You";
  const activities = [];
  jobs.forEach((job) => {
    activities.push({
      id: `job-${job.id}`,
      user: { name: userName, image: "/avatars/01.png" },
      action: job.applyStatus === "APPLIED" ? "applied to" : "saved a job at",
      target: `${job.jobTitle} at ${job.companyName}`,
      time: job.createdAt.toISOString(),
      type: "job",
      timestamp: new Date(job.createdAt).getTime()
    });
  });
  tasks.forEach((task) => {
    activities.push({
      id: `task-${task.id}`,
      user: { name: userName, image: "/avatars/01.png" },
      action: task.submitStatus === "SUBMITTED" ? "completed task" : "updated task",
      target: task.title,
      time: task.updatedAt.toISOString(),
      type: "task",
      timestamp: new Date(task.updatedAt).getTime()
    });
  });
  emails.forEach((email) => {
    activities.push({
      id: `email-${email.id}`,
      user: { name: "System", image: "/avatars/02.png" },
      action: email.emailType === "APPLICATION" ? "sent application email titled" : "sent reply email titled",
      target: `"${email.subject}"`,
      time: email.createdAt.toISOString(),
      type: "email",
      timestamp: new Date(email.createdAt).getTime()
    });
  });
  return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit).map(({ timestamp, ...rest }) => rest);
};
var UsersService = {
  updateProfile,
  getProfile,
  getRecentActivity
};

// src/modules/Users/users.controller.ts
var updateProfile2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await UsersService.updateProfile(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var getProfile2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await UsersService.getProfile(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result
  });
});
var getRecentActivity2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await UsersService.getRecentActivity(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recent activity retrieved successfully",
    data: result
  });
});
var UsersController = {
  updateProfile: updateProfile2,
  getProfile: getProfile2,
  getRecentActivity: getRecentActivity2
};

// src/modules/Users/users.validation.ts
import { z as z7 } from "zod";
var updateProfileSchema = z7.object({
  body: z7.object({
    name: z7.string().min(1).optional(),
    profileBio: z7.string().optional(),
    resumeLink: z7.string().url().optional().or(z7.literal("")),
    linkedinLink: z7.string().url().optional().or(z7.literal("")),
    portfolioLink: z7.string().url().optional().or(z7.literal("")),
    resumeContent: z7.string().optional(),
    skills: z7.string().optional(),
    experience: z7.string().optional(),
    education: z7.string().optional(),
    certifications: z7.string().optional()
  })
});

// src/modules/Users/users.routes.ts
var router6 = Router6();
router6.use(authenticate);
router6.get("/profile", UsersController.getProfile);
router6.get("/activity", UsersController.getRecentActivity);
router6.put(
  "/profile",
  validateRequest(updateProfileSchema),
  UsersController.updateProfile
);
var users_routes_default = router6;

// src/routes/index.ts
var router7 = Router7();
router7.use("/jobs", jobs_routes_default);
router7.use("/emails", emails_routes_default);
router7.use("/tasks", tasks_route_default);
router7.use("/resumes", resumes_routes_default);
router7.use("/users", users_routes_default);
router7.use("/companies", companies_routes_default);
var routes_default = router7;

// src/app.ts
var app = express();
app.use(morgan("dev"));
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.send("JobMailer AI Server is running \u{1F680}");
});
app.use(globalErrorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
