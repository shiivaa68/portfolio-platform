import { Router } from "express";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword, signJwt } from "../lib/auth";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashed, role: "ADMIN" },
    });

    res.json({ id: user.id, email: user.email });
  } catch (err: any) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    res.json({ token });
  } catch (err: any) {
    next(err);
  }
});

export default router;
