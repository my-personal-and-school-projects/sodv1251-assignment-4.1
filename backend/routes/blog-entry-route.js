import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const blogEntryRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//get all blog entries
blogEntryRouter.get("/", async (req, res) => {
  const filePath = path.resolve(__dirname, "../data/blog-entries.json");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const blogEntries = JSON.parse(data);
    res.json(blogEntries);
  } catch (err) {
    console.error("Error handling blog entries data:", err);
    res.status(500).json({ error: "Failed to fetch blog entries data" });
  }
});

export default blogEntryRouter;
