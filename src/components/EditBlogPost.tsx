"use client"

import { updateBlogPost } from "@/server/admin/blogPostsService"
import { useBlogAdminStore } from "@/stores/blogAdminStore"
import { PostWithUser } from "@/types/Post"
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Space, Spin } from "antd"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"

type Props = {
    open: boolean
    onClose: () => void
    defaultValues: PostWithUser
}

type FieldType = {
    title: string
    subtitle: string
    slug: string
    body: string
}

const EditBlogPost = ({ open, defaultValues, onClose }: Props) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = useBlogAdminStore()

    const editBlogPostTranslation = useTranslations("EditBlogPost")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if(!blogSelected) return
        setLoading(true)
        const blogPost = await updateBlogPost({ data: values, postId: defaultValues.id })
        if(blogPost?.error){
            message.error(errorsTranslation(`blog/${blogPost.error}`))
        } else {
            message.success(commonTranslation("SUCCESS"))
        }
        setLoading(false)
        onClose()
    }

    useEffect(() => {  
        form.resetFields()
    },[blogSelected])

    useEffect(() => {
        form.setFieldsValue(defaultValues)
    },[defaultValues, open])

    return (
        <Drawer
            title={editBlogPostTranslation("title")}
            width={520}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80
                }
            }}
            extra={
                <Space>
                    <Button onClick={onClose}>
                        {commonTranslation('cancel')}
                    </Button>
                    <Button type="primary" onClick={form.submit} loading={loading}>
                        {commonTranslation('save')}
                    </Button>
                </Space>
            }
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="title"
                                label={formTranslation("title_label")}
                                rules={[{ required: true,  max: 100 }]}
                            >
                                <Input 
                                    showCount
                                    maxLength={100}
                                    placeholder={"Ex: Publicando um blog"}
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
                                <Input 
                                    showCount
                                    maxLength={191}
                                    placeholder="Ex: Publicando um blog"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="slug"
                                label={formTranslation("slug_label")}
                                rules={[{ required: true,  max: 60, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ }]}
                            >
                                <Input 
                                    showCount
                                    maxLength={60}
                                    addonBefore="/"
                                    placeholder="Ex: Publicação x"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="body"
                                label={formTranslation("body_label")}
                                rules={[{ required: true }]}
                            >
                                <ReactQuill theme="snow" value={form.getFieldValue("body")} onChange={(value) => form.setFieldValue("body", value)} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default EditBlogPost