import express from "express";
import path from "path";
import dotenv from "dotenv";
import blogEntryRouter from "./routes/blog-entry-route.js";
import memberRouter from "./routes/member-router.js";

dotenv.config();
const app = express();

// Serve static assets in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "frontend", "public")));
  app.use("/src", express.static(path.join(process.cwd(), "frontend", "src")));
  app.use(
    "/components",
    express.static(path.join(process.cwd(), "frontend", "src", "components"))
  );
}

// Route for the new blog entry page
app.get("/new-blog-entry", (req, res) => {
  res.sendFile(
    path.resolve(
      process.cwd(),
      "frontend",
      "public",
      "pages",
      "new-blog-entry.html"
    )
  );
});

// blog entries route
app.use("/blog-entries", blogEntryRouter);

//member router
app.use("/members", memberRouter);

// Listen on port 5001
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
