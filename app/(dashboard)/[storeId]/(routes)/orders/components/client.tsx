"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface OrderClientProps {
    data: OrderColumn[]
}
export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <Heading 
                title={`Orders (${data.length})`}
                description="Manage store Orders"
            />
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    )
}