import AuthLayout from "@/components/layout/AuthLayout";
import { intl } from "@/config/intl";
import { isNotAuthenticated } from "@/lib/isNotAuthenticated";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    await isNotAuthenticated()

    return (
        <html lang={intl.defaultLocale}>
            <body>
                <AuthLayout>
                    {children}
                </AuthLayout>
            </body>
        </html>
    );
}

export default Layout;