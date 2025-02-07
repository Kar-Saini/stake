import express from "express";
import bcrypt from "bcrypt";
import prisma from "./utils/utils";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import OUTPUTS from "./utils/outputs";
import { MULTIPLIERS } from "./utils/constants";
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3001;

app.get("/", (_, res) => {
  res.json({ message: "Healthy Server" });
});
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await prisma.user.findFirst({ where: { email } });
    if (!userExists) {
      res.status(401).json({ message: "Inalid user" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      userExists?.password as string
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { id: userExists?.id, role: userExists?.role },
      "secret"
    );
    res.json({
      message: "User logged in",
      id: userExists?.id,
      balance: userExists?.balance,
      name: userExists?.name,
      email: userExists?.email,
      role: userExists?.role,
      token,
    });
  } catch (error) {
    res.json({ message: "Error while logging in" }).status(400);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(403).json({ message: "Email already exist" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "user",
      },
    });
    res.json({ message: "User created", id: (await newUser).id });
  } catch (error) {
    res.status(400).json({ message: "Error while creating user" });
  }
});
app.post("/bet", async (req, res) => {
  try {
    const { betAmount }: { betAmount: number } = req.body;
    const decoded = jwt.verify(req.body.token, "secret") as JwtPayload & {
      id: string;
      role: "admin" | "user";
    };
    const id = decoded.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userBalance = user.balance;
    if (betAmount < userBalance) {
      let outcome = 0;
      for (let i = 0; i < 14; i++) {
        if (Math.random() > 0.5) {
          outcome++;
        }
      }
      const multiplier: number = MULTIPLIERS[outcome];
      const finalBetMoney = betAmount * multiplier;
      const result = await prisma.$transaction(async () => {
        try {
          const updatedUser = await prisma.user.update({
            where: { id },
            data: {
              balance: userBalance - betAmount + finalBetMoney,
            },
          });
          console.log("Balance updated");
          console.log(updatedUser.balance);
          const betTrxn = await prisma.transaction.create({
            data: {
              betAmount: betAmount,
              betResult: finalBetMoney,
              userId: id,
            },
          });
          return { updatedUser, betTrxn };
        } catch (error) {
          console.log("Error");
          console.log(error);
        }
      });
      const allPossiblesX = OUTPUTS[outcome];
      const randomIdx = Math.ceil(Math.random() * allPossiblesX.length);
      const startX = allPossiblesX[randomIdx];
      const updatedbalance = await prisma.user.findUnique({
        where: { id },
        select: { balance: true },
      });
      res.json({ multiplier, startX, updatedbalance });
    } else {
      res.json({ message: "insufficent balance" });
      return;
    }
  } catch (error) {}
});
app.listen(PORT, () => console.log("Server listening on " + PORT));
