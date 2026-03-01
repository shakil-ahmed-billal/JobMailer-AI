import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { auth } from "./lib/auth";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();

app.use(morgan("dev"));

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel Preview/Prod patterns
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "x-requested-with",
    ],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());

// Better-Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// API routes
app.use("/api/v1", router);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("JobMailer AI Server is running 🚀");
});

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;
