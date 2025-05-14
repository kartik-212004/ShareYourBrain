import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/config.js"
export function middleware(req, res, next) {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Token missing" });
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET)

    } catch (error) {
        console.log(error)
        return res.json({ message: error.message, status: 401 })
    }

    next()
}