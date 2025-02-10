import AdminLayout from "@/components/layout/AdminLayout";
import { intl } from "@/config/intl";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { redirect } from "@/lib/navigation";
import { getBlog } from "@/server/admin/blogService";
import { User } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
    children: React.ReactNode;
    params: { blog_slug: string }
}

const Layout = async ({ children, params }: Props) => {
    const session = await isAuthenticated()
    const blog = await getBlog({ slug: params.blog_slug, user: session?.user as User })

    if(blog?.error || !blog.data) redirect({ href: "/", locale: intl.defaultLocale })

    return (
        <html lang={intl.defaultLocale}>
            <body>
                <SessionProvider session={session}>
                    <AdminLayout 
                        blog={blog.data!} 
                        user={session?.user as User}>
                            {children}
                        </AdminLayout>
                </SessionProvider>
            </body>
        </html>
    );
};

export default Layout;