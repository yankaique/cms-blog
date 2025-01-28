import { Blog } from "@prisma/client"
import { create } from "zustand"

export type BlogState = {
    blog: Blog | null
}

export type BlogAction = {
    setBlog: (blog: Blog | null) => void
}

export const useBlogStore = create<BlogState & BlogAction>((set) => ({
    blog: null,
    setBlog: (blog) => set({ blog })
}))