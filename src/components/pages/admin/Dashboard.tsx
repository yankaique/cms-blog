"use client"

import { AdminHero } from "@/components/AdminHero"
import { getDashboardData } from "@/server/admin/dashboardService"
import { useBlogAdminStore } from "@/stores/blogAdminStore"
import { DashboardData } from "@/types/Dashboard"
import { Card, Col, Row, Statistic } from "antd"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export const AdminDashboardPage = () => {
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData>()

    const { blogSelected } = useBlogAdminStore();
    const { data } = useSession()

    const translations = useTranslations("DashboardPage")

    useEffect(() => {  
        const handleGetDashboardData = async () => {
            if(!blogSelected) return
            setLoading(true)
            const data = await getDashboardData({ blogId: blogSelected.id })
            setDashboardData(data)   
            setLoading(false)
        }
        handleGetDashboardData()
    },[blogSelected])

    return (
        <div>
            <div className="space-y-6 pb-5 ">
                <AdminHero
                    title={translations("title", {name: data?.user?.name})}
                    description={translations("description", {blogName: blogSelected?.title})}
                />

                <div className="px-8">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={translations("total_users")}
                                    value={dashboardData?.totalUsers} 
                                    valueStyle={{ color: '#409703' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={translations("total_posts")}
                                    value={dashboardData?.totalPosts} 
                                    valueStyle={{ color: '#ffb108' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={translations("your_total_posts")}
                                    value={dashboardData?.totalPostsMadeByMe} 
                                    valueStyle={{ color: '#0572ff' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}