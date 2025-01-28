import { BlogWithUsers } from "@/types/Blog"
import { Blog } from "@prisma/client"
import { create } from "zustand"

export type BlogState = {
    blogs: Blog[],
    blogSelected: BlogWithUsers | null
}

export type BlogAction = {
    setBlogs: (blog: Blog[]) => void,
    setBlogSelected: (blog: BlogWithUsers | null) => void
}

export const useBlogAdminStore = create<BlogState & BlogAction>((set) => ({
    blogs: [],
    blogSelected: null,
    setBlogs: (blogs) => set({ blogs }),
    setBlogSelected: (blog) => set({ blogSelected: blog })
}))