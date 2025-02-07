"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = __importDefault(require("./utils/utils"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const outputs_1 = __importDefault(require("./utils/outputs"));
const constants_1 = require("./utils/constants");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3001;
app.get("/", (_, res) => {
    res.json({ message: "Healthy Server" });
});
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userExists = yield utils_1.default.user.findFirst({ where: { email } });
        if (!userExists) {
            res.status(401).json({ message: "Inalid user" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, userExists === null || userExists === void 0 ? void 0 : userExists.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid Password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: userExists === null || userExists === void 0 ? void 0 : userExists.id, role: userExists === null || userExists === void 0 ? void 0 : userExists.role }, "secret");
        res.json({
            message: "User logged in",
            id: userExists === null || userExists === void 0 ? void 0 : userExists.id,
            balance: userExists === null || userExists === void 0 ? void 0 : userExists.balance,
            name: userExists === null || userExists === void 0 ? void 0 : userExists.name,
            email: userExists === null || userExists === void 0 ? void 0 : userExists.email,
            role: userExists === null || userExists === void 0 ? void 0 : userExists.role,
            token,
        });
    }
    catch (error) {
        res.json({ message: "Error while logging in" }).status(400);
    }
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userExists = yield utils_1.default.user.findUnique({ where: { email } });
        if (userExists) {
            res.status(403).json({ message: "Email already exist" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield utils_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "user",
            },
        });
        res.json({ message: "User created", id: (yield newUser).id });
    }
    catch (error) {
        res.status(400).json({ message: "Error while creating user" });
    }
}));
app.post("/bet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { betAmount } = req.body;
        const decoded = jsonwebtoken_1.default.verify(req.body.token, "secret");
        const id = decoded.id;
        const user = yield utils_1.default.user.findUnique({ where: { id } });
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
            const multiplier = constants_1.MULTIPLIERS[outcome];
            const finalBetMoney = betAmount * multiplier;
            const result = yield utils_1.default.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const updatedUser = yield utils_1.default.user.update({
                        where: { id },
                        data: {
                            balance: userBalance - betAmount + finalBetMoney,
                        },
                    });
                    console.log("Balance updated");
                    console.log(updatedUser.balance);
                    const betTrxn = yield utils_1.default.transaction.create({
                        data: {
                            betAmount: betAmount,
                            betResult: finalBetMoney,
                            userId: id,
                        },
                    });
                    return { updatedUser, betTrxn };
                }
                catch (error) {
                    console.log("Error");
                    console.log(error);
                }
            }));
            const allPossiblesX = outputs_1.default[outcome];
            const randomIdx = Math.ceil(Math.random() * allPossiblesX.length);
            const startX = allPossiblesX[randomIdx];
            const updatedbalance = yield utils_1.default.user.findUnique({
                where: { id },
                select: { balance: true },
            });
            res.json({ multiplier, startX, updatedbalance });
        }
        else {
            res.json({ message: "insufficent balance" });
            return;
        }
    }
    catch (error) { }
}));
app.listen(PORT, () => console.log("Server listening on " + PORT));
