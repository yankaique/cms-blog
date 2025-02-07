"use client"

import { Link } from "@/lib/navigation"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Button, Result, theme } from "antd"
import { useTranslations } from "next-intl"

export const VerifyEmail = () => {
    const { token: { colorPrimary } } = theme.useToken()
    const translation = useTranslations("VerifyEmailPage")
    return (
        <Result 
            status="info" 
            icon={<InfoCircleOutlined style={{ color: colorPrimary }} />} 
            title={translation("title")}
            subTitle={translation("subtitle")}
            className="max-w-3xl"
            extra={
                <Link href="/auth/signin">
                    <Button type="primary">
                        {translation("btn_label")}
                    </Button>
                </Link>
            }
        />
    )
}