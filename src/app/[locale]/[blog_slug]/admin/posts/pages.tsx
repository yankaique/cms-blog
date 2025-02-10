import { Metadata } from "next"
import { getBlogPosts } from "@/server/admin/blogPostsService"
import { PostPage } from "@/components/pages/admin/Posts"

export const metadata: Metadata = {
    title: "Publicações | Dashboard",
}

type Props = {
    params: { blog_slug: string }
}

const AdminPosts = async ({ params }: Props) => {
    const posts = await getBlogPosts({ blogSlug: params.blog_slug })

    return (
        <div>
            <PostPage posts={posts.data!} />
        </div>
    )
}

export default AdminPosts

