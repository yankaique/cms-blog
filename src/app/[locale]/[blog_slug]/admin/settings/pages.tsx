import { Metadata } from "next"
import AdminSettingsPage from "@/components/pages/admin/Settings"

export const metadata: Metadata = {
    title: "Configurações | Dashboard",
}

const AdminSettings = () => {
    return (
        <div>
            <AdminSettingsPage />
        </div>
    )
}

export default AdminSettings

