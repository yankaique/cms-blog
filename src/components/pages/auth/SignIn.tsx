"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Divider, Form, FormProps, Input, message, Space, Spin } from "antd";
import { signIn as signInProvider } from "next-auth/react";
import GoogleIcon from "@/assets/imgs/google-icon.svg"
import FacebookIcon from "@/assets/imgs/facebook-icon.svg"
import { signIn } from "@/server/authService";
import { Link } from "@/lib/navigation";

type FieldType = {
    email: string;
}

export const SignIn = () => {
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const signInTranslation = useTranslations("SignInPage")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        const createdSignIn = await signIn({
            data: { email: values.email }
        })
        setLoading(false)
        if(createdSignIn?.error) return message.error(errorsTranslation(`auth/${createdSignIn.error}`))
    }

    const handleSignInProvider = async (provider: 'google' | 'facebook') => {
        setLoading(true)
        await signInProvider(provider)
        setLoading(false)
    }

    useEffect(() => {
        if (searchParams.get("error") === "OAuthAccountNotLinked") {
            message.error(errorsTranslation("auth/OAuthAccountNotLinked"))
        }
    },[])

    return (
        <div className="border space-y-7 border-slate-100 dark:border-zinc-800 p-6 shadow w-full max-w-md rounded-lg">
            <Spin spinning={loading}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label={formTranslation("email_label")} name="email" rules={[{ required: true, max: 120 }]} required>
                        <Input placeholder={"Ex: test@email.com"} />
                    </Form.Item>
                    <Form.Item className="pt-2">
                        <Button type="primary" htmlType="submit" block>
                            {signInTranslation("btn_label", {provider: 'email'})}
                        </Button>
                    </Form.Item>
                </Form>
                <Divider plain>{commonTranslation("or")}</Divider>
                <Space className="w-full" direction="vertical" size={16}>
                    <Button block onClick={() => handleSignInProvider('google')} className="font-semibold py-[17px]">
                        {signInTranslation("btn_label", {provider: 'google'})}
                        <Image src={GoogleIcon}  alt="google" width={18} />
                    </Button>
                    <Button block onClick={() => handleSignInProvider('facebook')} className="font-semibold py-[17px]">
                        {signInTranslation("btn_label", {provider: 'facebook'})}
                        <Image src={FacebookIcon} alt="facebook" width={18} />
                    </Button>
                    <p className="mt-7 text-center">
                        {signInTranslation("no_account")}
                        <Link href="/sign-up" className="text-blue-500 ml-1">
                            {signInTranslation("btn_no_account_label")}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}