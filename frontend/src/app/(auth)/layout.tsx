export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary-foreground"
            >
              <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 5 5h4c3 0 6-2 6-2s3 2 6 2h1a2 2 0 0 1 2 2j" />
              <path d="M6 19v2" />
              <path d="M18 19v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">JobMailer AI</h1>
          <p className="text-muted-foreground">
            Automate your job applications with AI
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
