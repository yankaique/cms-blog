"use client"

import { AdminHero } from "@/components/AdminHero"
import NewBlogUser from "@/components/NewBlogUser"
import { deleteBlogUser, updateBlogUserRole } from "@/server/admin/blogUserService"
import { BlogUsersWithUsers } from "@/types/Blog"
import { DeleteOutlined } from "@ant-design/icons"
import { BlogUser } from "@prisma/client"
import { Button, Popconfirm, Select, Table, Tag } from "antd"
import { TableProps } from "antd/lib"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Props = {
    users: BlogUsersWithUsers[]   
}

type DataType = BlogUsersWithUsers & {
    key: string
}

export const UsersPage = ({users}: Props) => {
    const [loading, setLoading] = useState(false)
    const [newBlogUserOpen, setNewBlogUserOpen] = useState(false)
    const session = useSession()

    const pageTranslation = useTranslations("UsersPage")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    
    const handleChangeRole = async (blogUserId: string, role: BlogUser['role']) => {
        setLoading(true)
        await updateBlogUserRole({blogUserId, data: {role}})
        setLoading(false) 
    }

    const handleDeleteUser = async (blogUserId: string) => {
        setLoading(true)
        await deleteBlogUser({blogUserId})
        setLoading(false)
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: formTranslation("user_name_label"),
            dataIndex: ['user', 'name'],
            key: 'name',
            sorter: (a, b) => a.user.name!.localeCompare(b.user.name!)!,
            sortDirections: ['descend', 'ascend'],
            ellipsis: true
        },
        {
            title: formTranslation("user_email_label"),
            dataIndex: ['user', 'email'],
            key: 'email',
            sorter: (a, b) => a.user.email!.localeCompare(b.user.email!)!,
            sortDirections: ['descend', 'ascend'],
            ellipsis: true
        },
        {
            title: formTranslation("user_role_label"),
            dataIndex: 'role',
            key: 'role',
            width: '12%',
            render: (_, record) => (
                <div className='pr-2'>
                    {record.role === "OWNER" ? (
                        <Tag color="gold">{record.role}</Tag>
                    ) : (
                        <Select
                            defaultValue={record.role} 
                            className='w-full'
                            variant="borderless"
                            disabled={session.data?.user?.id === record.userId}
                            onChange={(value) => handleChangeRole(record.id, value)}
                            size="small"
                            options={[
                                { value: 'AUTHOR', label: commonTranslation("AUTHOR") },
                                { value: 'EDITOR', label: commonTranslation("EDITOR") },
                                { value: 'ADMIN', label: commonTranslation("ADMIN") },
                            ]} 
                        />
                    )}
                </div>
            )
        },
        {
            title: commonTranslation("actions_label"),
            key: 'actions',
            width: '8%',
            render: (_, record) => (
                <>
                    {record.role !== 'OWNER' && session.data?.user?.id !== record.userId &&
                        <Popconfirm
                            title={pageTranslation("remove_user_label")}
                            description={pageTranslation("remove_user_description")}
                            rootClassName="max-w-72"
                            onConfirm={() => handleDeleteUser(record.id)}
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
                    }
                </>
            )
        }
    ]

    return (
        <>
            <NewBlogUser
                open={newBlogUserOpen}
                setOpen={setNewBlogUserOpen}
            />

            <div className="space-y-6 pb-5">
                <AdminHero
                    title={pageTranslation("title")}
                    description={pageTranslation("description")}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => setNewBlogUserOpen(true)}
                        >
                            {pageTranslation("new_user_label")}
                        </Button>   
                    }
                />

                <div className="px-4">
                    <Table
                        loading={loading}
                        columns={columns}
                        pagination={false}
                        dataSource={users.map((user) => ({...user, key: user.id}))}
                    />
                </div>
            </div>
        </>
    )
}