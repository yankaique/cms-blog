import { SignUp } from "@/components/pages/auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Faça sua conta",
};

const SignUpPage = () => (
        <SignUp />
)

export default SignUpPage;