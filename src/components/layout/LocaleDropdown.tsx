"use client"

import { intl } from "@/config/intl"
import { Link, usePathname } from "@/lib/navigation"
import { CaretDownFilled } from "@ant-design/icons"
import { Dropdown, Space } from "antd"
import { useLocale } from "next-intl"
import Image from "next/image"

export const LocaleDropdown = () => {
    const pathname = usePathname()
    const locale = useLocale()

    return (
        <Dropdown
            menu={{
                items: intl.localeList.map((item) => ({
                    key: item.locale,
                    label: <Link href={pathname} locale={item.locale}>{item.label}</Link>,
                    icon: <Image src={`/imgs/${item.locale}.png`} width={23} height={23} alt={`${item.locale}`} />
                })),
                defaultSelectedKeys: [locale],
            }}
            trigger={['click']}
        >
            <Space className="
                border 
                border-slate-200
                dark:border-zinc-800
                rounded-md
                h-9
                px-3
                cursor-pointer
                gap-4
            ">
                <Image src={`/imgs/${locale}.png`} width={23} height={23} alt={`${locale}`} />
                <CaretDownFilled classID="text-slate-600"/>
            </Space>
        </Dropdown>
    )
}