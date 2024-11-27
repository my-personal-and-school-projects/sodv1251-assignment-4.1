import { Router } from "express";
import members from "../data/members.js";

const memberRouter = Router();

//get all Members
memberRouter.get("/", (req, res) => {
  res.json(members);
});

//get Member by id
memberRouter.get("/:id", (req, res) => {
  const member = customers.find((m) => m.id === parseInt(req.params.id));

  if (!member) {
    return res.status(404).send("Member not Found");
  } else {
    res.json(member);
  }
});

export default memberRouter;
