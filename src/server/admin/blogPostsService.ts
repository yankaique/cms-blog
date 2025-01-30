"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { getBlogUser } from "@/server/admin/blogUserService"
import { revalidatePath } from "next/cache"

export const getBlogPosts = async ({blogSlug}: {blogSlug: string}) => {
    const session = await auth()
    const user = session?.user

    if(!user) return { error: "UNAUTHORIZED" }

    const blog = await prisma.blog.findUnique({where: {slug: blogSlug}, select: {id: true}})
    const blogUser = await getBlogUser({userId: user.id as string, blogId: blog?.id as string})

    let where: Record<string, unknown> = {
        blog: {slug: blogSlug},
        deletedAt: null
    }

    if(blogUser.data?.role === "AUTHOR") {
        where = {
            ...where,
            userId: user.id
        }
    }

    const blogPosts = await prisma.post.findMany({where, include: {user: true}})

    return { data: blogPosts }
}

export const createBlogPost = async ({data}: {data: {title: string, subtitle?: string, slug: string, body: string, blogId: string}}) => {
    const session = await auth()
    const user = session?.user

    if(!user) return { error: "UNAUTHORIZED" }

    const postExists = await prisma.post.count({where: {slug: data.slug}})

    if(postExists) return { error: "SLUG_ALREADY_EXISTS" }

    await prisma.post.create({
        data: {
            title: data.title,
            subtitle: data.subtitle,
            slug: data.slug,
            body: data.body,
            blogId: data.blogId,
            userId: user.id as string,
        }
    })

    revalidatePath('/admin/posts')
}

export const updateBlogPost = async ({postId, data}: {postId: string, data: {title: string, subtitle?: string, slug: string, body: string}}) => {
    const session = await auth()
    const user = session?.user

    if(!user) return { error: "UNAUTHORIZED" }

    const post = await prisma.post.findUnique({where: {id: postId}})

    if (post?.slug !== data.slug) {
        const postExists = await prisma.post.count({where: {slug: data.slug}})
        if (postExists) return { error: "SLUG_ALREADY_EXISTS" }
    }

    await prisma.post.update({
        where: {id: postId},
        data: {
            title: data.title,
            subtitle: data.subtitle,
            slug: data.slug,
            body: data.body,
        }
    })

    revalidatePath('/admin/posts')
}


export const deleteBlogPost = async ({postId}: {postId: string}) => {
    const session = await auth()
    const user = session?.user

    if(!user) return { error: "UNAUTHORIZED" }

    await prisma.post.update({where: {id: postId}, data: {deletedAt: new Date()}})

    revalidatePath('/admin/posts')
}