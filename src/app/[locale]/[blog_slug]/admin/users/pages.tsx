import { Metadata } from "next"
import { getBlogUsers } from "@/server/admin/blogUserService"
import { UsersPage } from "@/components/pages/admin/Users"

export const metadata: Metadata = {
    title: "Usuarios | Dashboard",
}

type Props = {
    params: { blog_slug: string }
}

const AdminUsers = async ({ params }: Props) => {
    const users = await getBlogUsers({ blogSlug: params.blog_slug })

    return (
        <div>
            <UsersPage users={users.data!} />
        </div>
    )
}

export default AdminUsers

