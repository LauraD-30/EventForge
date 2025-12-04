import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// backend/data/events.json
// backend/data/events.json
const filePath = path.join(__dirname, "..", "..", "data", "events.json");





// or maybe dummyEvents.json – whatever it is


router.get("/", (req, res, next) => {
  fs.readFile(filePath, "utf-8", (err, text) => {
    if (err) return next(err);

    try {
      const events = JSON.parse(text);
      return res.json({ data: events });
    } catch (e) {
      return next(e);
    }
  });
});

export default router;
