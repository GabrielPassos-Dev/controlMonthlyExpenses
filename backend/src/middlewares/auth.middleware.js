import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: "Token not provided" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Token malformed" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.userId

        next()

    } catch (error) {
        return res.status(401).json({ error: "Invalid token" })
    }
}