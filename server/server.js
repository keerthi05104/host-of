import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import shareRoutes from "./routes/shareRoutes.js";
import { ensureUploadDir } from "./services/fileStorage.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { cleanupExpiredShares } from "./services/cleanupService.js";


const app = express();
const port = Number(process.env.PORT || 5000);
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({ origin: origin.split(",").map(value => value.trim()), methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "20kb" }));

const shareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please wait a little and try again." }
});
app.get("/api/health", (req, res) => res.json({ success: true, message: "Send Me API is running." }));
app.use("/api/shares", shareLimiter, shareRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await ensureUploadDir();
  await connectDB();
  // Run once when the backend starts.
void cleanupExpiredShares();

// Check for expired shares every hour.
setInterval(() => {
  void cleanupExpiredShares();
}, 60 * 60 * 1000);

  app.listen(port, () => console.log(`Send Me API listening on http://localhost:${port}`));
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
