import { Button } from "@/components/ui/button"
import React, { useEffect, useRef, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import ImageUpload from "./ImageUpload"
import { useDispatch, useSelector } from "react-redux"
import { addNewProduct, fetchAllProduct } from "@/store/admin/product-slice"
import { toast } from "sonner"
import AdminProductTile from "@/components/admin-view/product-tile"

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "", 
}

const Product = () => {
    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false)
    const [formData, setFormData] = useState(initialFormData)
    const [imageFile, setImageFile] = useState(null)
    const [uploadImageUrl,setUploadImageUrl] = useState("")
    const [imageLoadingState , setimageLoadingState] = useState(false)
    const inputRef = useRef(null)
    const dispatch = useDispatch()
    const {productList , isLoading} = useSelector(state => state.adminProducts)


    //if (isLoading) return <div>Loading products...</div>;
   

      const handleChange = (e) => {
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

  useEffect(() => {
  const load = async () => {
     dispatch(fetchAllProduct());
   
  };
  load();
}, [dispatch]);

    console.log(formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            await dispatch(addNewProduct({
                ...formData , 
                image : uploadImageUrl
            })).then((data) => {
                if(data?.payload?.success){
                    dispatch(fetchAllProduct())
                    setFormData(initialFormData)
                    setImageFile(null)
                    toast("Product Added Successfully")
                    setOpenCreateProductDialog(false)

                }
            })
            
    
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setimageLoadingState(false)
        }
    }

        
    return (
        <div className="p-4">
            <div className="mb-5 w-full text-black flex justify-end">
                <Button onClick={() => setOpenCreateProductDialog(true)}>
                    Add new Product
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {/* Product grid will go here */}
                {   productList && productList.length > 0 ?
                    productList?.map((productItems) => (<AdminProductTile productItems = {productItems}/>)) : null
                }
            </div>

            <Sheet open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
                <SheetContent side="right" className="overflow-auto w-full sm:max-w-md">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Add New Product</SheetTitle>
                    </SheetHeader>
                    
                    <form onSubmit={handleSubmit} className="">

                        {/* Image  */}
                        <ImageUpload 
                        imageFile = {imageFile}
                        setImageFile = {setImageFile}
                        setUploadImageUrl = {setUploadImageUrl}
                        uploadImageUrl = {uploadImageUrl}
                        setimageLoadingState = {setimageLoadingState}
                        imageLoadingState = {imageLoadingState}


                        />
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Product name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Product description"
                                rows={4}
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select 
                                name="category"
                                value={formData.category}
                                onValueChange={(value) => setFormData({...formData, category: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electronics">Electronics</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="home">Home & Kitchen</SelectItem>
                                    <SelectItem value="books">Books</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Brand */}
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Brand name"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="1"
                                required
                            />
                        </div>

                        {/* Sale Price */}
                        <div className="space-y-2">
                            <Label htmlFor="salePrice">Sale Price (optional)</Label>
                            <Input
                                id="salePrice"
                                name="salePrice"
                                type="number"
                                value={formData.salePrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="1"
                            />
                        </div>

                        {/* Total Stock */}
                        <div className="space-y-2">
                            <Label htmlFor="totalStock">Total Stock</Label>
                            <Input
                                id="totalStock"
                                name="totalStock"
                                type="number"
                                value={formData.totalStock}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button 
                                variant="outline" 
                                type="button"
                                className = "text-black"
                                onClick={() => setOpenCreateProductDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className = "text-black" disabled={imageLoadingState}>
                                {imageLoadingState ? "Saving..." : "Save Product"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Product