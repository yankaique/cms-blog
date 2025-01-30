import { auth } from "@/lib/auth";
import { redirect } from "@/lib/navigation";
import { intl } from "@/config/intl";

export const isNotAuthenticated = async () => {
    const session = await auth()
    
    if(session?.user) redirect({ href: "/", locale: intl.defaultLocale })
};