"use client"

import { Link } from "@/lib/navigation"
import { CloseCircleFilled } from "@ant-design/icons"
import { Button, Result, theme } from "antd"
import { useTranslations } from "next-intl"

export const AuthError = () => {
    const { token: { red5 } } = theme.useToken()
    const translation = useTranslations("AuthErrorPage")
    return (
        <Result 
            status="error" 
            icon={<CloseCircleFilled style={{ color: red5 }} />} 
            title={translation("title")}
            subTitle={translation("sub_title")}
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