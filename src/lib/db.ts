import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { db: PrismaClient }

const prisma = globalForPrisma.db || new PrismaClient();
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.db = prisma
