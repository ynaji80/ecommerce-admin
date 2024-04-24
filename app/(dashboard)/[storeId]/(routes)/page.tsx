import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, Euro, Package } from "lucide-react";

interface DashboardPageProps {
    params: {storeId: string};
}

const getGraphEarnings = async (storeId: string) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    const monthlyEarnings: {[key: number]: number} = {};
    for( const order of orders) {
        const month = order.createdAt.getMonth();
        let earningForOrder = 0 ;
        for(const orderItem of order.orderItems) {
            earningForOrder += orderItem.product.price;
        }
        monthlyEarnings[month] = (monthlyEarnings[month] || 0) + earningForOrder;
    }
    const graphData = [
        {name: 'Jan', total: monthlyEarnings[0] || 0},
        {name: 'Feb', total: monthlyEarnings[1] || 0},
        {name: 'Mar', total: monthlyEarnings[2] ||45},
        {name: 'Apr', total: monthlyEarnings[3] || 15},
        {name: 'May', total: monthlyEarnings[4] || 0},
        {name: 'Jun', total: monthlyEarnings[5] || 0},
        {name: 'Jul', total: monthlyEarnings[6] || 0},
        {name: 'Aug', total: monthlyEarnings[7] || 0},
        {name: 'Sep', total: monthlyEarnings[8] || 5},
        {name: 'Oct', total: monthlyEarnings[9] || 0},
        {name: 'Nov', total: monthlyEarnings[10] || 0},
        {name: 'Dec', total: monthlyEarnings[11] || 0},
    ];
    return graphData;
};


const getTotalEarnings = async (storeId: string) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    const totalEarnings = orders.reduce((acc, order) => {
        const orderTotal = order.orderItems.reduce((acc2, orderItem) => {
            return acc2 + orderItem.product.price;
        }, 0);
        return acc + orderTotal;
    }, 0);
    return totalEarnings;
}

const getSales = async (storeId: string) => {
    const sales = await prismadb.order.count({
        where: {
            storeId,
            isPaid: true,
        }
    })
    return sales;
}

const getProductsInStock = async (storeId: string) => {
    const productsInStock = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false
        }
    });
    return productsInStock;
}
const DashboardPage: React.FC<DashboardPageProps> = async ({
    params,
}) => {

    const totalEarnings = await getTotalEarnings(params.storeId);
    const sales = await getSales(params.storeId);
    const productsInStock = await getProductsInStock(params.storeId);
    const graphData = await getGraphEarnings(params.storeId);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of the Store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Earnings
                            </CardTitle>
                            <Euro className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {formatter.format(totalEarnings) }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                +{sales}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Product in Stock
                            </CardTitle>
                            <Package className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {productsInStock}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="col-span-4">
                    <CardHeader >
                        <CardTitle className="text-lg">
                            Ovrall Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage;