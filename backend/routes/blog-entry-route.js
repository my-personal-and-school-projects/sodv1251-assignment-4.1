import { Router } from "express";
import blogEntries from "../data/blog-entries.js";

const blogEntryRouter = Router();

//get all blog entries
blogEntryRouter.get("/", (req, res) => {
  res.json(blogEntries);
});

//get customer by id
blogEntryRouter.get("/:id", (req, res) => {
  const blogEntry = blogEntries.find(
    (entry) => entry.id === parseInt(req.params.id)
  );

  if (!blogEntry) {
    return res.status(404).send("Blog Entry not Found");
  } else {
    res.json(blogEntry);
  }
});

export default blogEntryRouter;
