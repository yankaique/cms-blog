import AuthLayout from "@/components/layout/AuthLayout";
import { isNotAuthenticated } from "@/lib/isNotAuthenticated";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    await isNotAuthenticated()

    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}

export default Layout;