import { Card } from "../ui/card"
import { Button } from "../ui/button"
import {useState } from "react"
import {useDispatch} from "react-redux"
import {
 
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { deleteProduct } from "@/store/admin/product-slice"



function AdminproductTile({productItems , setOpenCreateProductDialog,setCurrentEditedId, setFormData ,handleDelete }){

     const dispatch = useDispatch()


    const handleEdit = () => {
    setOpenCreateProductDialog(true)
    setCurrentEditedId(productItems._id)
    setFormData(productItems)
}
 
   
 
    if(!productItems){return null}
    return (
        <Card w-full max-w-sm mx-auto>
            <div>
            <div className="relative">
                <img src={productItems?.image} alt={productItems?.title} className="w-full h-[300px] object-cover rounded-t-lg" />
            </div>
            <CardContent>
                <h2 className = "text-xl font-bold mb-2">{productItems?.title}</h2>
                <div className = "flex justify-between items-center mb-2">
                    <span className = {`${productItems.salePrice > 0 ? 'line-through' : ''}text-lg font-semibold text-primary`}>${productItems.price}</span>
                    {
                        productItems.salePrice > 0 ? <span className = "text-lg font-bold">${productItems.salePrice}</span> : null
                    }
                    
                </div>
            </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => handleEdit()}
            >
                Edit
            </Button>
            <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => handleDelete(productItems?._id)}
            >
                Delete
            </Button>
          </CardFooter>
            </div>
        </Card>
    )
    
}

export default AdminproductTile 