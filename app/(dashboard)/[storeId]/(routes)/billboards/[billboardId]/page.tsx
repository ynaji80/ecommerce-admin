import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";
import { auth } from "@clerk/nextjs";


const BillboardPage = async ({
    params
}:{
    params: {billboardId: string}
}) => {
    var billboard = null;
    if(params.billboardId != "new") {
        
        billboard = await prismadb.billboard.findUnique({
            where : {
                id: params.billboardId
            }
        })
    }
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                Exists : {billboard?.label}
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    )
}

export default BillboardPage;