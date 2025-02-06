import { intl } from "@/config/intl";
import { auth } from "@/lib/auth";
import { redirect } from "@/lib/navigation";
import { SessionProvider } from "next-auth/react";
import HomeLayout from "@/components/layout/HomeLayout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    if (!session?.user) redirect({ href: "/auth/signin", locale: intl.defaultLocale })
    return (
        <SessionProvider session={session}>
            <HomeLayout>{children}</HomeLayout>
        </SessionProvider>
    );
};

export default Layout;