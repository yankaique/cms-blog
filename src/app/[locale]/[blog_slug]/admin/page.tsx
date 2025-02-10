import { Metadata } from "next"
import { AdminDashboardPage } from "@/components/pages/admin/Dashboard"

export const metadata: Metadata = {
    title: "Dashboard",
}

const AdminDashboard = () => {
    return (
        <div>
            <AdminDashboardPage />
        </div>
    )
}

export default AdminDashboard

