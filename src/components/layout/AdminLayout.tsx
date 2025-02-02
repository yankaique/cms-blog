"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardOutlined, FileTextOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, MenuProps, Select, Spin } from "antd";
import { User } from "next-auth";
import { useTranslations } from "next-intl";
import { getMyBlogs } from "@/server/admin/blogService";
import { useBlogAdminStore } from "@/stores/blogAdminStore";
import { BlogWithUsers } from "@/types/Blog";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { hasPermission } from "@/lib/permissions";
import { ToggleTheme } from "./ToggleTheme";
import { LocaleDropdown } from "./LocaleDropdown";
import Logo from "@/assets/logo.svg"
import ShortLogo from "@/assets/shortLogo.svg"

type Props = {
    children: React.ReactNode;
    blog: BlogWithUsers;
    user: User;
}

const  { Header, Content, Sider } = Layout;

const AdminLayout: React.FC<Props> = ({ children, blog, user }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [restricted, setRestricted] = useState(true)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const { blogs, setBlogs, setBlogSelected } = useBlogAdminStore()

    const translation = useTranslations("Layout")
    const permissionDenied = !hasPermission({blogUsers: blog.users, userId: user.id as string, roles: ["OWNER", "ADMIN"]})
    const handleCollapse = () => setCollapsed(!collapsed)
    const formatedPathname = '/' + pathname.split('/').slice(2).join('/')
    const handleChangeBlog = (slug: string) => router.replace(`/${slug}/${formatedPathname}`)
    const menuItems: MenuProps['items'] = [{
        key: '/admin',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => router.push(`/${blog.slug}/admin`)
    },
    {
        key: '/admin/posts',
        icon: <FileTextOutlined />,
        label: translation('posts'),
        onClick: () => router.push(`/${blog.slug}/admin/posts`)
    },
    {
        key: '/admin/users',
        icon: <UserOutlined />,
        label: translation('users'),
        disabled: permissionDenied,
        onClick: () => router.push(`/${blog.slug}/admin/users`)
    },
    {
        key: '/admin/settings',
        icon: <SettingOutlined />,
        label: translation('settings'),
        disabled: permissionDenied,
        onClick: () => router.push(`/${blog.slug}/admin/settings`)
    },
    ]

    const breadcrumbItems:{ pathname: string, items: { title: string, href: string }[] }[] = [{
        pathname: '/admin',
        items: [{
            title: 'Dashboard',
            href: '/admin',
        }]
    },
    {
        pathname: '/admin/posts',
        items: [ {
            title: 'Dashboard',
            href: '/admin',
        },{
            title: translation('posts'),
            href: '/admin/posts',
        }]
    },
    {
        pathname: '/admin/users',
        items: [
            {
                title: 'Dashboard',
                href: '/admin',
            },
            {
                title: translation('users'),
                href: '/admin/users',
            },
        ],
    },
    {
        pathname: '/admin/settings',
        items: [{
            title: 'Dashboard',
            href: '/admin',
        },{
            title: translation('settings'),
            href: '/admin/settings',
        }],
    }]

    useEffect(() => {
        setBlogSelected(blog)
        const handleGetBlog = async () => {
            setLoading(true)
            const blogs = await getMyBlogs()
            setLoading(false)
            setBlogs(blogs.data as BlogWithUsers[])
        }
        handleGetBlog()
    }, [blog])

    useEffect(() => {
        if(formatedPathname.includes('/users') || formatedPathname.includes('/settings') && permissionDenied) {
            router.replace(`/${blog.slug}/admin`)
        }else{
            setRestricted(false)
        }
    }, [blog, formatedPathname])

    return (
        <Layout className="h-screen overflow-hidden">
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed} 
                onCollapse={handleCollapse}
                className="bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-b-zinc-800"
            >
                <Link 
                    href="/"
                    className="
                        flex items-center justify-center 
                        border-b border-slate-200 dark:border-b-zinc-800 mb-4"
                >
                    <Image
                        src={Logo} 
                        width={150} 
                        alt="logo" 
                        priority 
                        className={`duration-300 absolute ${collapsed ? 'opacity-0' : 'opacity-100'}`}
                    />

                    <Image
                        src={ShortLogo} 
                        width={40} 
                        alt="logo" 
                        priority 
                        className={`py-[13.5px] transition ${collapsed ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>
                <div className="px-2 pb-4 border-b border-slate-200 dark:border-b-zinc-800">
                    <Select
                        showSearch
                        className="w-full"
                        defaultValue={blog.slug}
                        onChange={handleChangeBlog}
                        loading={loading}
                        options={blogs.map(blog => ({label: blog.title, value: blog.slug}))}
                    /> 
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[formatedPathname]}
                    selectedKeys={[formatedPathname]}
                    items={menuItems}
                    className="h-full border-r-0 bg-white dark:bg-slate-950"
                />
            </Sider>
            <Layout className="dark:bg-slate-900">
                <Header className="
                    flex 
                    justify-between 
                    items-center 
                    p-0
                    pr-14
                    gap-4 
                    bg-white 
                    dark:bg-slate-950
                    border-b
                    border-slate-200
                    dark:border-b-zinc-800
                ">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={handleCollapse}
                        className="size-16"
                    />
                    <div className="flex items-center gap-4">
                        <LocaleDropdown />
                        <ToggleTheme />
                    </div>
                </Header>
                <Content className="px-4 pb-2 flex flex-col overflow-auto">
                    <Breadcrumb 
                        className="my-4"
                        items={breadcrumbItems.find(item => item.pathname === formatedPathname)?.items}
                        itemRender={
                            (route) => (
                                <Link href={`/${blog.slug}${route.href || ""}`}>{route.title}</Link>
                            )
                        }
                    />
                    <div className="flex-1 relative rounded-lg bg-white dark:bg-slate-950">
                        <Spin 
                            className="flex items-center justify-center size-full absolute bg-white dark:bg-slate-950"
                            spinning={restricted}
                            size="large"
                        />
                        {!restricted && children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminLayout