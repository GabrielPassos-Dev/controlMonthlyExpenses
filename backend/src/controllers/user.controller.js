import prisma from "../lib/prisma.js";

export async function updateSalaryUser(req, res) {
    try {
        const userId = req.userId
        const { salary } = req.body

        if (salary < 0 || salary == null) {
            return res.status(400).json({ error: "Salary is required" })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { salary },
            select: {
                id: true,
                salary: true
            }
        })

        return res.json(updatedUser)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}