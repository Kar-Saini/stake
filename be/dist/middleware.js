"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const token = req.body;
    console.log(token);
    if (!token) {
        res.json({ message: "Unauthenticated" }).status(403);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "secret");
        console.log(decoded);
        req.id = decoded.id;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        console.log(error);
        res.json({ message: "Invalid token" }).status(403);
    }
}
exports.default = authMiddleware;
