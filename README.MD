# JobMailer AI 🚀

JobMailer AI is a powerful, AI-driven job application management system designed to streamline your career search. It combines robust job tracking with intelligent email generation to help you apply faster and more effectively.

## ✨ Key Features

### 🔐 Advanced Authentication

- Powered by **Better-Auth** for secure and seamless user verification.
- Supports **Social Auth** (Google) and traditional Email/Password login.
- Persistent session management with cross-framework support (Next.js + Express).

### 📋 Job Application Tracker

- Comprehensive CRUD for job applications.
- Track application status: `Draft`, `Applied`, `Interview`, `Offer`, `Rejected`.
- Store company details, job descriptions, links, and salary information.
- Filter and organize your pipeline with ease.

### 🤖 AI-Powered Email Assistant

- **Dual AI Support**: Seamlessly switch between **OpenAI (ChatGPT)** and **Google Gemini**.
- **Context-Aware Generation**: Automatically generates personalized cover letters and application emails using your profile (skills, experience) and the specific job description.
- **Smart Replies**: Generate professional follow-up emails and status updates based on custom instructions.

### 📄 Resume Management

- Upload and manage multiple resumes.
- Organize resumes by job roles (e.g., Frontend Developer, Backend Engineer).
- Quick access to the right version of your CV for every application.

### 📅 Task & Interview Management

- Create granular tasks for each job application (e.g., "Prepare for Technical Round").
- Set deadlines and track submission statuses (`Pending`, `Submitted`, `Overdue`).
- Stay on top of your interview schedule and follow-ups.

### 👤 Comprehensive Profiles

- Store detailed information: Skills, Education, Experience, and Certifications.
- External links: LinkedIn, Portfolio, and digital Resume.
- Unified data source for high-quality AI content generation.

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **UI Architecture**: React 19, Tailwind CSS 4.0
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Components**: Radix UI, Shadcn UI, Lucide Icons
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend

- **Engine**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Authentication**: [Better-Auth](https://www.better-auth.com/)
- **Bundler**: [Tsup](https://tsup.egoist.dev/) (ESM & Node targeting)

### AI & Integration

- **LLMs**: OpenAI API, Google Generative AI (Gemini)
- **Deployment**: Vercel (Edge & Serverless functions)
- **Mailing**: Nodemailer (SMTP)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database (e.g., Neon DB)
- API keys for OpenAI/Gemini

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shakil-ahmed-billal/JobMailer-AI.git
   cd JobMailer-AI
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   pnpm install
   cp .env.example .env # Update your DATABASE_URL and API keys
   pnpm prisma:generate
   pnpm prisma:migrate dev
   pnpm dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   pnpm install
   cp .env.example .env.local # Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_BACKEND_URL
   pnpm dev
   ```

---

## 📦 Project Structure

```text
├── backend
│   ├── prisma       # Database schema & migrations
│   ├── src
│   │   ├── lib      # Auth & Prisma clients
│   │   ├── modules  # Feature-based logic (Jobs, Emails, Tasks)
│   │   └── routes   # API endpoint definitions
│   └── vercel.json  # Backend deployment config
├── frontend
│   ├── src
│   │   ├── app      # Next.js App Router (Dashboard, Auth, Profile)
│   │   ├── components # Shared UI components
│   │   └── lib      # API clients & state logic
│   └── next.config.ts # Frontend configuration
└── README.MD        # Documentation
```

---

## 🌐 Deployment

The system is optimized for **Vercel**.

- **Backend**: Deployed as serverless functions using `api/index.mjs`.
- **Frontend**: Standard Next.js Vercel deployment with API rewrites.

---

Built with ❤️ by [Shakil Ahmed Billal](https://github.com/shakil-ahmed-billal)
