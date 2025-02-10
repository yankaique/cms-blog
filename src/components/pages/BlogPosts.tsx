"use client"

import { PostWithUser } from "@/types/Post"
import dayjs from "dayjs"

type Props = {
    post: PostWithUser
}

export const BlogPostsPage = ({ post }: Props) => {
    return (
        <div className="container mx-auto px-12 py-8 h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="mb-2 text-gray-600 ">
                <span className="font-semibold">
                    {post.user.name}
                </span>
                -
                {dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
    )
}