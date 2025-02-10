"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export const getDashboardData = async ({blogId}: {blogId: string}) => {
    const session = await auth()

    const totalUsers = await prisma.blogUser.count({where: {blogId: blogId}})
    const totalPosts = await prisma.post.count({where: {blogId: blogId, deletedAt: null}})
    const totalPostsMadeByMe = await prisma.post.count({where: {blogId: blogId, userId: session?.user?.id, deletedAt: null}})

    return { totalUsers, totalPosts, totalPostsMadeByMe }
}