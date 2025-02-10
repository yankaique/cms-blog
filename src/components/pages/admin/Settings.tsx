"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button, Col, Form, FormProps, Input, message, Popconfirm, Row, Spin } from "antd"
import { deleteBlog, updateBlog } from "@/server/admin/blogService"
import { useSession } from "next-auth/react"
import { useBlogAdminStore } from "@/stores/blogAdminStore"
import { AdminHero } from "@/components/AdminHero"
import { hasPermission } from "@/lib/permissions"
import { BlogUser } from "@prisma/client"

type FieldType = {
    title: string
    subtitle: string
    slug: string
    bgColor: string
    textColor: string
}

const AdminSettingsPage = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const pageTranslation = useTranslations("SettingsPage")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")

    const { blogSelected } = useBlogAdminStore()
    const session = useSession()
    const user = session.data?.user

    const handleDeleteBlog = () => deleteBlog({blogId: blogSelected?.id as string})

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if(!blogSelected) return
        setLoading(true)
        const blog = await updateBlog({ data: values, blogId: blogSelected.id })
        if(blog?.error) return message.error(errorsTranslation(`blog/${blog.error}`))
        setLoading(false)
    }

    return (
        <div>
            <AdminHero
                    title={pageTranslation("title")}
                    description={pageTranslation("description")}
                    extra={
                        hasPermission({blogUsers: blogSelected?.users as BlogUser[], userId: user?.id as string, roles: ["OWNER"]}) ?
                        <Popconfirm
                            title={pageTranslation("delete_blog_label")}
                            description={pageTranslation("delete_blog_description")}
                            rootClassName="max-w-72"
                            onConfirm={() => handleDeleteBlog()}
                            okText={commonTranslation("continue")}
                            cancelText={commonTranslation("cancel")}
                        >
                            <Button
                                type="primary"
                                danger
                            >
                                {pageTranslation("delete_blog_label")}
                            </Button>
                        </Popconfirm>
                        :
                        null
                    }
                />
            <div className="py-4 px-8">
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            title: blogSelected?.title,
                            subtitle: blogSelected?.subtitle,
                            slug: blogSelected?.slug,
                            bgColor: blogSelected?.bgColor,
                            textColor: blogSelected?.textColor,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="title"
                                    label={formTranslation("title_label")}
                                    rules={[{ required: true,  max: 60 }]}
                                >
                                    <Input 
                                        showCount
                                        maxLength={60}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="slug"
                                    label={formTranslation("slug_label")}
                                    rules={[{ required: true,  max: 60, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ }]}
                                >
                                    <Input 
                                        style={{ width: '100%' }}
                                        showCount
                                        maxLength={60}
                                        addonBefore="/"
                                        placeholder="Ex: meu blog"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="bgColor"
                                    label={formTranslation("bg_color_label")}
                                    rules={[{ required: true,  max: 45 }]}
                                >
                                    <Input 
                                        style={{ width: '100%' }}
                                        type="color"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="textColor"
                                    label={formTranslation("text_color_label")}
                                    rules={[{ required: true,  max: 45 }]}
                                >
                                        <Input 
                                        style={{ width: '100%' }}
                                        type="color"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="subtitle"
                                    label={formTranslation("subtitle_label")}
                                    rules={[{ max: 191 }]}
                                >
                                    <Input.TextArea 
                                        showCount
                                        rows={4}
                                        maxLength={191}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {commonTranslation("save")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    )

}

export default AdminSettingsPage