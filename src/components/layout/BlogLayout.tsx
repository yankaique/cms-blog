"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Layout } from "antd"
import { Link } from "@/lib/navigation"
import Logo from "@/assets/imgs/logo.svg"
import { Blog } from "@prisma/client"
import { useBlogStore } from "@/stores/blogStore"
import { LocaleDropdown } from "./LocaleDropdown"
import { ToggleTheme } from "./ToggleTheme"
const { Header, Content } = Layout

type Props = {
    children: React.ReactNode
    blog: Blog
}

const BlogLayout: React.FC<Props> = ({ children, blog }) => {
    const { setBlog} = useBlogStore()

    useEffect(() => {
        setBlog(blog)
    }, [blog])
    return (
        <Layout className="h-screen overflow-hidden">
            <Header className="
                flex 
                justify-between 
                bg-white 
                dark:bg-slate-950
                border-b
                border-slate-200
                dark:border-b-zinc-800
            ">
                <div className="flex items-center justify-between container px-8">
                    <Link href={`/${blog.slug}`}>
                        <Image src={Logo} width={150} alt="logo" priority />
                    </Link>
                </div>
                <Link href="/">
                    <Image src={Logo} width={150} alt="logo" priority />
                </Link>
                <div className="flex items-center gap-8">
                    <LocaleDropdown />
                    <ToggleTheme />
                </div>
            </Header>
            <Content>
                <div className="
                    size-full
                    flex
                    items-center
                    justify-center
                    overflow-auto
                    container
                    px-8
                    mx-auto
                ">
                    {children}
                </div>
            </Content>
        </Layout>
    )
}

export default BlogLayout;