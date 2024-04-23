import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import { auth } from "@clerk/nextjs";


const CategoryPage = async ({
    params
}:{
    params: {categoryId: string, storeId: string}
}) => {
    var category = null;
    if(params.categoryId != "new") {
        
        category = await prismadb.category.findUnique({
            where : {
                id: params.categoryId
            }
        })
    }
    
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                Exists : {category?.name}
                <CategoryForm  billboards={billboards} initialData={category} />
            </div>
        </div>
    )
}

export default CategoryPage;