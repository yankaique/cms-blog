import { BlogPostsPage } from "@/components/pages/BlogPosts";
import { getBlogPost } from "@/server/blogService";
import { notFound } from "next/navigation";

type Props = {
    params: {
        blog_slug: string;
        post_slug: string;
    }
}

const BlogPost = async({ params }: Props) => {
    const post = await getBlogPost({ blogSlug: params.blog_slug, postSlug: params.post_slug });

    if (!post.data) {
        notFound();
    }

    return (
        <BlogPostsPage post={post.data!} />
    )
}

export default BlogPost;