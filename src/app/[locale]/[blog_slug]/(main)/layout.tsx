import BlogLayout from "@/components/layout/BlogLayout";
import { intl } from "@/config/intl";
import { redirect } from "@/lib/navigation";
import { getBlog } from "@/server/blogService";
import { Metadata } from "next";

type Props = {
    children: React.ReactNode;
    params: { blog_slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const blog = await getBlog({ slug: params.blog_slug });
    return {
        title: blog.data?.title ?? 'Not found',
        description: blog.data?.subtitle,
    };
}

const Layout = async ({ children, params }: Props) => {
    const blog = await getBlog({ slug: params.blog_slug });
    if(!blog.data) redirect({ href: "/", locale: intl.defaultLocale })
    return (
        <BlogLayout blog={blog.data!}>
            {children}
        </BlogLayout>
    )
}

export default Layout