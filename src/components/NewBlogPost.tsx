"use client"

import { sendPromptToGemini } from "@/lib/gemini"
import { createBlogPost } from "@/server/admin/blogPostsService"
import { useBlogAdminStore } from "@/stores/blogAdminStore"
import { ThunderboltOutlined } from "@ant-design/icons"
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Space, Spin, theme, Tooltip } from "antd"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

type FieldType = {
    title: string
    subtitle: string
    slug: string
    body: string
}

const NewBlogPost = ({ open, setOpen }: Props) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = useBlogAdminStore()

    const newBlogPostTranslation = useTranslations("NewBlogPost")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")


    const locale = useLocale()
    const { token: { colorPrimary } } = theme.useToken()

    const onClose = () => {
        setOpen(false)
    }

    const handleGenerateAI = async () => {
        setLoading(true)
        const response = await sendPromptToGemini({
            prompt: `
                Escreva um post para um blog, o tema deve ser relacionado as configurações/tema do blog: ${blogSelected?.title}; ${blogSelected?.subtitle}. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do post (max. 100 caracteres)",
                    "subtitle": "Descrição do post (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)",
                    "body": "Conteúdo do post (Use HTML para formatar o conteúdo - Não use markdown)",
                }
            `
        })
        form.setFieldsValue(response)
        setLoading(false)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if(!blogSelected) return
        setLoading(true)
        const blogPost = await createBlogPost({ data: {...values, blogId: blogSelected.id} })
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

    return (
        <Drawer
            title={newBlogPostTranslation("title")}
            width={600}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80
                }
            }}
            extra={
                <Space>
                    <Tooltip title={newBlogPostTranslation('ai_tootltip')}>
                        <Button
                            type="text"
                            onClick={() => handleGenerateAI()}
                        >
                            <ThunderboltOutlined classID="text-xl" style={{ color: colorPrimary }}/>
                        </Button>
                    </Tooltip>
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

export default NewBlogPost