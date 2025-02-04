"use client"

import { createBlogUser } from "@/server/admin/blogUserService"
import { useBlogAdminStore } from "@/stores/blogAdminStore"
import { BlogUser } from "@prisma/client"
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Select, Space, Spin } from "antd"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

type FieldType = {
    email: string
    role: BlogUser["role"]
}

const NewBlogUser = ({ open, setOpen }: Props) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = useBlogAdminStore()

    const newBlogUserTranslation = useTranslations("NewBlogUser")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")

    const onClose = () => {
        setOpen(false)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if(!blogSelected) return
        setLoading(true)
        const blogUser = await createBlogUser({ data: {...values, blogId: blogSelected.id} })
        if(blogUser?.error){
            message.error(errorsTranslation(`blog/${blogUser.error}`))
        } else {
            message.success(commonTranslation("SUCCESS"))
        }
        setLoading(false)
        setOpen(false)
    }

    useEffect(() => {  
        form.resetFields()
    },[blogSelected])

    return (
        <Drawer
            title={newBlogUserTranslation("title")}
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
                                name="email"
                                label={formTranslation("user_email_label")}
                                rules={[{ required: true,  max: 191 }]}
                            >
                                <Input 
                                    showCount
                                    maxLength={191}
                                    placeholder={"Ex: example@gmail.com"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="role"
                                label={formTranslation("role_label")}
                                rules={[{ required: true }]}
                            >
                                <Select
                                placeholder="Ex: AUTHOR"
                                options={[
                                        { value: 'AUTHOR', label: commonTranslation("AUTHOR") },
                                        { value: 'EDITOR', label: commonTranslation("EDITOR") },
                                        { value: 'ADMIN', label: commonTranslation("ADMIN") },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default NewBlogUser