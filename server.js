import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { requireAuth, requireTeacher } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("module6db");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
connectDB();

// AUTH ROUTES
app.use("/auth", authRoutes);

// GET all items (students + teachers)
app.get("/api/items", requireAuth, async (req, res) => {
  const items = await db.collection("items").find().toArray();
  res.json(items);
});

// POST create item (teachers only)
app.post("/api/items", requireTeacher, async (req, res) => {
  const result = await db.collection("items").insertOne(req.body);
  res.json(result);
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running with authentication!");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
