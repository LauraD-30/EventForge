import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { errorHandler } from "./middleware/error.js";

// NEW: user store + password hashing
import { insertUser, nextId, findByEmail } from "./data/users.memory.js";
import { hashPassword } from "./utils/password.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// NEW: seed demo users in memory so login works after every restart
(async function seedDemoUsers() {
  const demoUsers = [
    { email: "alice@example.com", role: "GUEST" },
    { email: "organizer@example.com", role: "ORGANIZER" },
    { email: "admin@example.com", role: "ADMIN" },
  ];

  for (const { email, role } of demoUsers) {
    if (!findByEmail(email)) {
      const passwordHash = await hashPassword("secret12");
      insertUser({ id: nextId(), email, passwordHash, role });
    }
  }

  console.log(
    "Seeded demo users (password for all: secret12):",
    demoUsers.map(u => `${u.email} [${u.role}]`).join(", ")
  );
})();

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", requireAuth, eventsRouter);

// optional alias if you want /api/users/me
app.get("/api/users/me", requireAuth, (req, res) =>
  res.json({ data: req.user })
);

// 404 handler
app.use((req, res) =>
  res.status(404).json({ error: "Not Found", path: req.originalUrl })
);

// central error handler
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`API running on http://localhost:${port}`)
);
