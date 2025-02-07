import { Prisma } from "@prisma/client";

export type PostWithUser = Prisma.PostGetPayload<{
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true
            }
        }
    }
}>