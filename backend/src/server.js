import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { errorHandler } from "./middleware/error.js";

// NEW: user store + password hashing
import { insertUser, nextId, findByEmail } from "./data/users.memory.js";
import { comparePassword, hashPassword } from "./utils/password.js";

//NEW: Stripe API
import Stripe from "stripe";

dotenv.config();
const app = express();


const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// NEW: seed demo users in memory so login works after every restart
(async function seedDemoUsers() {
  const demoUsers = [
    { email: "admin@example.com", role: "ADMIN" },
    { email: "alice@example.com", role: "GUEST" },
    { email: "organizer@example.com", role: "ORGANIZER" },
    { email: "primaDance@example.com", role: "ORGANIZER" },
    { email: "cody@example.com", role: "GUEST" }
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


//STRIPE CONFIG
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body; 
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
    });
    
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
      console.error("Stripe error:", err);
      res.send({ error: err.message });
  }
  console.log("Received request to create payment intent for amount:", amount);
});

const ordersFile = path.join(process.cwd(), "orders.json");

app.post("/api/save-order", requireAuth, async (req, res) => {
  const { eventId, quantity, amount, paymentIntentId } = req.body;
  const userId = req.user.id;

  try {
    // Save orders to orders.json
     let orders = [];
        if (fs.existsSync(ordersFile)) {
          const data = fs.readFileSync(ordersFile, "utf-8");
          orders = JSON.parse(data);
        }

    // Create new order object
    const newOrder = {
      id: Date.now(),
      userId,
      eventId,
      quantity,
      amount,
      paymentIntentId,
      createdAt: new Date().toISOString(),
    };

    // Append to orders array
    orders.push(newOrder);

    // Write back to file
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    console.log("New Order:", { userId, eventId, quantity, amount, paymentIntentId });

    res.send({ success: true });
  } catch (err) {
    console.error("Save order error:", err);
    res.status(500).send({ error: err.message });
  }

//NEW: Quickly Generated To Save Time**********

  // Get organizer's events
app.get("/api/organizer/events", requireAuth, (req, res) => {
  // Replace with DB or JSON file logic
  const eventsFile = path.join(process.cwd(), "data", "events.json");
  const allEvents = JSON.parse(fs.readFileSync(eventsFile, "utf-8"));
  const userEvents = allEvents.filter(event => event.organizerId === req.user.id);
  res.send(userEvents);
});

// Create new event
app.post("/api/organizer/events", (req, res) => {
  const { title, date, price } = req.body;
  const eventsFile = path.join(process.cwd(), "data", "events.json");
  const events = JSON.parse(fs.readFileSync(eventsFile, "utf-8"));

  const newEvent = {
    id: Date.now(),
    title,
    date,
    price,
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));

  res.send(newEvent);
});
});