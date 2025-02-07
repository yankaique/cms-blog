"use client"

import { AdminHero } from "@/components/AdminHero"
import EditBlogPost from "@/components/EditBlogPost"
import NewBlogPost from "@/components/NewBlogPost"
import { deleteBlogPost } from "@/server/admin/blogPostsService"
import { PostWithUser } from "@/types/Post"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, Table, Tag } from "antd"
import { TableProps } from "antd/lib"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Props = {
    posts: PostWithUser[]   
}

type DataType = PostWithUser & {
    key: string
}

export const PostPage = ({posts}: Props) => {
    const [loading, setLoading] = useState(false)
    const [newBlogPostOpen, setNewBlogPostOpen] = useState(false)
    const [editBlogPost, setEditBlogPost] = useState<PostWithUser>()

    const pageTranslation = useTranslations("PostPage")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    
    const handleDeletePost = async (id: string) => {
        setLoading(true)
        await deleteBlogPost({postId: id})
        setLoading(false)
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: formTranslation("title_label"),
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['descend', 'ascend'],
            ellipsis: true
        },
        {
            title: formTranslation("slug_label"),
            dataIndex: 'slug',
            key: 'slug',
            sorter: (a, b) => a.slug.localeCompare(b.slug),
            sortDirections: ['descend', 'ascend'],
            ellipsis: true
        },
        {
            title: formTranslation("author_label"),
            dataIndex: ['user', 'name'],
            key: 'user.name',
            sorter: (a, b) => a.user.name.localeCompare(b.user.name),
            sortDirections: ['descend', 'ascend'],
            ellipsis: true,
            render: (_: any, record: PostWithUser) => (
                <Space>
                    <Tag color="blue">{record.user.name}</Tag>
                    <Tag color="gold">{record.user.email}</Tag>
                </Space>
            )
        },
        {
            title: commonTranslation("actions_label"),
            key: 'actions',
            width: '8%',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        className="text-blue-700"
                        onClick={() => setEditBlogPost(record)}
                    >
                        <EditOutlined className="text-lg" />
                    </Button>
                    <Popconfirm
                        title={pageTranslation("remove_post_label")}
                        description={pageTranslation("remove_post_description")}
                        rootClassName="max-w-72"
                        onConfirm={() => handleDeletePost(record.id)}
                        okText={commonTranslation("continue")}
                        cancelText={commonTranslation("cancel")}
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                        >
                            <DeleteOutlined className="text-lg" />
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <>
            <NewBlogPost
                open={newBlogPostOpen}
                setOpen={setNewBlogPostOpen}
            />

            <EditBlogPost
                open={!!editBlogPost}
                onClose={() => setEditBlogPost(undefined)}
                defaultValues={editBlogPost!}
            />

            <div className="space-y-6 pb-5">
                <AdminHero
                    title={pageTranslation("title")}
                    description={pageTranslation("description")}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => setNewBlogPostOpen(true)}
                        >
                            {pageTranslation("new_post_label")}
                        </Button>   
                    }
                />

                <div className="px-4">
                    <Table
                        loading={loading}
                        columns={columns}
                        pagination={false}
                        dataSource={posts.map((post) => ({...post, key: post.id}))}
                    />
                </div>
            </div>
        </>
    )
}