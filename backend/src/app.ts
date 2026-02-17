import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import config from "./config";
import { auth } from "./lib/auth";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();

// parsers
// parsers
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
  next();
});
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [config.frontend_url, "http://localhost:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Better-Auth routes
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
