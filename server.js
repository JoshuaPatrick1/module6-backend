import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

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

// GET all items
app.get("/api/items", async (req, res) => {
  const items = await db.collection("items").find().toArray();
  res.json(items);
});

// POST create item
app.post("/api/items", async (req, res) => {
  const result = await db.collection("items").insertOne(req.body);
  res.json(result);
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
