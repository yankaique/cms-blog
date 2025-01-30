import { auth } from "@/lib/auth";
import { redirect } from "@/lib/navigation";
import { intl } from "@/config/intl";

export const isAuthenticated = async () => {
    const session = await auth()

    if(!session?.user) redirect({ href: "/auth/signin", locale: intl.defaultLocale })

    return session;
};