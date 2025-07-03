import { Card } from "../ui/card"
import { Button } from "../ui/button"
import {
 
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function AdminproductTile({productItems}){
 
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
                className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-md transition-colors"
                onClick={() => handleEdit(item.id)}
            >
                Edit
            </Button>
            <Button 
                className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-md transition-colors"
                onClick={() => handleDelete(item.id)}
            >
                Delete
            </Button>
          </CardFooter>
            </div>
        </Card>
    )
    
}

export default AdminproductTile 