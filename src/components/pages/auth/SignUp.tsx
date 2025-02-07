"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Divider, Form, FormProps, Input, message, Space, Spin } from "antd";
import { signIn as signInProvider } from "next-auth/react";
import GoogleIcon from "@/assets/imgs/google-icon.svg"
import FacebookIcon from "@/assets/imgs/facebook-icon.svg"
import { signUp as signUpService } from "@/server/authService";
import { Link } from "@/lib/navigation";

type FieldType = {
    name: string;
    email: string;
}

export const SignUp = () => {
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const signUpTranslation = useTranslations("SignUpPage")
    const formTranslation = useTranslations("Form")
    const commonTranslation = useTranslations("Common")
    const errorsTranslation = useTranslations("Errors")

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        const createdSignUp = await signUpService({
            data: { name: values.name, email: values.email }
        })
        setLoading(false)
        if(createdSignUp?.error) return message.error(errorsTranslation(`auth/${createdSignUp.error}`))
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
                    <Form.Item label={formTranslation("name_label")} name="name" rules={[{ required: true, max: 70 }]} required>
                        <Input placeholder={"Ex: John Doe"} />
                    </Form.Item>
                    <Form.Item label={formTranslation("email_label")} name="email" rules={[{ required: true }]} required>
                        <Input placeholder={"Ex: test@email.com"} />
                    </Form.Item>
                    <Form.Item className="pt-2">
                        <Button type="primary" htmlType="submit" block>
                            {signUpTranslation("btn_label", {provider: 'email', max: 120})}
                        </Button>
                    </Form.Item>
                </Form>
                <Divider plain>{commonTranslation("or")}</Divider>
                <Space className="w-full" direction="vertical" size={16}>
                    <Button block onClick={() => handleSignInProvider('google')} className="font-semibold py-[17px]">
                        {signUpTranslation("btn_label", {provider: 'google'})}
                        <Image src={GoogleIcon}  alt="google" width={18} />
                    </Button>
                    <Button block onClick={() => handleSignInProvider('facebook')} className="font-semibold py-[17px]">
                        {signUpTranslation("btn_label", {provider: 'facebook'})}
                        <Image src={FacebookIcon} alt="facebook" width={18} />
                    </Button>
                    <p className="mt-7 text-center">
                        {signUpTranslation("already_have_account")}
                        <Link href="/auth/signin" className="text-blue-500 ml-1">
                            {signUpTranslation("btn_have_account_label")}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}