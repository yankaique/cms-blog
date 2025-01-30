"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export const getDashboardData = async ({blodId}: {blodId: string}) => {
    const session = await auth()

    const totalUsers = await prisma.blogUser.count({where: {blogId: blodId}})
    const totalPosts = await prisma.post.count({where: {blogId: blodId}})
    const totalPostsMadeByMe = await prisma.post.count({where: {blogId: blodId, userId: session?.user?.id}})

    return { totalUsers, totalPosts, totalPostsMadeByMe }
}