import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/config.js"
export function middleware(req, res, next) {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("No token found")
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.id
        next()

    } catch (error) {
        console.log(error)
        return res.json({ message: error.message, status: 401 })
    }

}