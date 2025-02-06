import { VerifyEmail } from "@/components/pages/auth/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verifique sua cade de entrada",
};

const VerifyEmailPage = () => (
        <VerifyEmail />
)

export default VerifyEmailPage;