import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public: get all projects
router.get("/", async (_, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err: any) {
    next(err);
  }
});

// Protected routes
router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const { title, description, imageUrl, link } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const project = await prisma.project.create({
      data: { title, description, imageUrl, link },
    });
    res.json(project);
  } catch (err: any) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, link } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: { title, description, imageUrl, link },
    });
    res.json(project);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }
    next(err);
  }
});

export default router;
