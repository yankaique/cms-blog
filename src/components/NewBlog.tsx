"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Space, Spin, theme, Tooltip } from "antd"
import { ThunderboltOutlined} from "@ant-design/icons"
import { createBlog } from "@/server/admin/blogService"
import { sendPromptToGemini } from "@/lib/gemini"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

type FieldType = {
    title: string
    subtitle: string
    slug: string
    bgColor: string
    textColor: string
}

const NewBlog = ({ open, setOpen }: Props) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const newBlogTranslation = useTranslations("NewBlog")
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
                Escreva um blog sobre qualquer tema de sua escolha. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do blog (max. 60 caracteres)",
                    "subtitle": "Descrição do blog (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)" 
                }
            `
        })
        form.setFieldsValue(response)
        setLoading(false)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        const blog = await createBlog({ data: values })
        if(blog?.error) return message.error(errorsTranslation(`blog/${blog.error}`))
        setLoading(false)
        onClose()
    }

    return (
        <Drawer
            title={newBlogTranslation("title")}
            width={720}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80
                }
            }}
            extra={
                <Space>
                    <Tooltip title={newBlogTranslation('ai_tootltip')}>
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
                    initialValues={{
                        title: "",
                        subtitle: "",
                        slug: "",
                        bgColor: "#FFFFFF",
                        textColor: "#000000",
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
                </Form>
            </Spin>
        </Drawer>
    )

}

export default NewBlog