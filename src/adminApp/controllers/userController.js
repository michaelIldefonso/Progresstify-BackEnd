
import { Request, Response } from 'express';
import { prisma } from '../prismaClient'; // Assuming Prisma is used for DB access

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: {
                    select: {
                        name: true, // Assuming the role table has a 'name' field
                    },
                },
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};