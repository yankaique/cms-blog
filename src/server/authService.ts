"use server"

import { signIn as authSignIn} from "@/lib/auth"
import prisma from "@/lib/db"
import { redirect } from "@/lib/navigation"
import { intl } from "@/config/intl";

export const signIn = async ({data}: {data: { email: string }}) => {    
    const user = await prisma.user.findUnique({where: {email: data.email}})

    if(!user) return { error: "ACCOUNT_NOT_FOUND" }

    await authSignIn("nodemailer", {email: data.email, redirect: false})

    redirect({ href: "/auth/verify-email", locale: intl.defaultLocale })
}

export const signUp = async ({data}: {data: { name: string, email: string }}) => {    
    const user = await prisma.user.findUnique({where: {email: data.email}})
    await prisma.user.create({data: {name: data.name, email: data.email}})

    if(user) return { error: "ACCOUNT_ALREADY_EXISTS" }

    await authSignIn("nodemailer", {email: data.email, redirect: false})

    redirect({ href: "/auth/verify-email", locale: intl.defaultLocale })
}