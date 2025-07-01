import { Button } from "@/components/ui/button"
import React, { useRef, useState } from "react"
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
    const [isLoading, setIsLoading] = useState(false)
    const [imageFile , setImageFile] = useState(null);
    const [uploadedImageUrl , setUploadedImageUrl] = useState("")
    const inputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            // Handle form submission here
            console.log("Form submitted:", formData)
            // Reset form after submission
            setFormData(initialFormData)
            setOpenCreateProductDialog(false)
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e) => {
        console.log(e.target.files)
        const file = e.target.files[0];
        //const previewUrl = URL.createObjectURL(file)
        if (file) setImageFile(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()


    }

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files?.[0]
        if(droppedFile) setImageFile(droppedFile)
    }

    const handleRemoveImage = (e) => {
        setImageFile(null)
        console.log(inputRef.current)
        if(inputRef.current){
            inputRef.current.value = ""
        }
    }
    return (
        <div className="p-4">
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductDialog(true)}>
                    Add new Product
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {/* Product grid will go here */}
            </div>

            <Sheet open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
                <SheetContent side="right" className="overflow-auto w-full sm:max-w-md">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Add New Product</SheetTitle>
                    </SheetHeader>
                    
                    <form onSubmit={handleSubmit} className="">
                        {/* Image Upload */}
                        <div onDragOver = {handleDragOver} onDrop = {handleDrop}className="space-y-2 ">
                            <Label htmlFor="image">Product Image</Label>
                            <Input 
                                id="image"
                                name="image"
                                className = "hidden"
                                type="file"
                                accept="image/*"
                                ref = {inputRef}
                                onChange = {handleImageChange}
                            />
                            {
                                !imageFile ? (
                                <label htmlFor="image" className = "flex flex-col items-center">
                                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground"/>
                                        <span>Drag & Drop or Click to Upload image</span>
                                </label> ): (<div className = "flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileIcon className="w-7 text-primary mr-2 h-7"/>
                                    </div>
                                    <p className = "text-sm font-medium">{imageFile.name}</p>
                                    <Button varient = "ghost" size = "icon" className= "text-muted-foreground hover:text-foreground" onClick = {handleRemoveImage}>
                                        <XIcon className = "w-4 h-4"/>
                                        <span className = "sr-only">Remove File</span>
                                    </Button>
                                </div>)
                            }
                        </div>

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
                                onClick={() => setOpenCreateProductDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Product"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Product