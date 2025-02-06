"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Button, Empty, Tooltip } from "antd"
import { ExportOutlined, PlusOutlined } from "@ant-design/icons"
import { Blog } from "@prisma/client"
import { Link } from "@/lib/navigation"
import NewBlog from "@/components/NewBlog"

type Props = {
    blogs: Blog[]
}

export const HomePage = ({ blogs }: Props) => {
    const [newBlogOpen, setNewBlogOpen] = useState(false)
    const { data: session } = useSession()

    const translation = useTranslations("HomePage")
    const handleShowNewBlog = () => setNewBlogOpen(true)

    return (
        <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-3xl p-4 rounded-lg">
            <NewBlog open={newBlogOpen} setOpen={setNewBlogOpen} />

            <div className="text-center border-b border-b-slate-200 dark:border-b-zinc-700 pb-3 space-y-1">
                <span className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
                    {translation("title", {name: session?.user?.name})}
                </span>
                <p className="ml-4">
                    {translation("description")}
                </p>
            </div>

            <div className="py-4 px-1">
                <Button type="primary" block onClick={handleShowNewBlog}>
                    <PlusOutlined />
                    {translation("btn_label")}
                </Button>
                {blogs.length > 0 ? (
                    <div className="flex items-center flex-wrap gap-4 mt-12">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/${blog.slug}/admin`}
                                className="text-slate-600 dark:text-slate-300"
                            > 
                                <Tooltip title={translation("tooltip_label")} arrow={false}>
                                    <div className="space-y-2 border border-slate-300 
                                        dark:border-zinc-700 w-fit py-3 px-5 rounded-lg cursor-pointer hover:dark:bg-slate-800/60">
                                        <div className="flex items-center gap-4">
                                            <ExportOutlined classID="text-xl"/>
                                            <span className="font-semibold max-w-36 truncate">{blog.title}</span>
                                        </div>
                                    </div>
                                </Tooltip>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Empty
                        className="mt-8 mb-4"
                    />
                )}
            </div>
        </div>
    )
}