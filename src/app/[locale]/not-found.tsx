import { Link } from "@/lib/navigation";
import { Button, Result } from "antd";
import { getTranslations } from "next-intl/server";

const NotFound = async () => {
    const translations = await getTranslations('NotFoundPage');
    return (
        <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950 ">
            <Result
                status="404"
                title={translations("title")}
                subTitle={translations("subtitle")}
                extra={
                    <Button type="primary">
                        <Link href="/">
                            {translations("btn_label")}
                        </Link>
                    </Button>   
                }
            />
        </div>
    )
}

export default NotFound;