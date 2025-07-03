import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

const ImageUpload = ({
    imageFile,
    setImageFile,
    uploadedImageUrl,
    setUploadImageUrl,
    imageLoadingState,
    setimageLoadingState
}) => {
   
    const inputRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
       
    }

    const handleDrop = (e) => {
        
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setImageFile(file)
            if (inputRef.current) {
                inputRef.current.files = e.dataTransfer.files
            }
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    async function uploadImageToCloudinary(){
        setimageLoadingState(true)
        const data = new FormData();
        data.append("my-file" , imageFile)
        const response = await axios.post("http://localhost:5000/api/v1/admin/products/upload-image" , data)
        console.log(response.data.result.url)
        if(response.data.success) {
            setUploadImageUrl(response.data.result.url)
            setimageLoadingState(false)
        }

    }
    useEffect(() => {
        if(imageFile !== null) {
            uploadImageToCloudinary()
        }
    } , [imageFile])

    return (
        <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    !imageFile ? "border-gray-300 hover:border-primary cursor-pointer" : "border-transparent"
                }`}
            >
                <Input 
                    id="image"
                    name="image"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleImageChange}
                />
                {!imageFile ? (
                    <label htmlFor="image" className="flex flex-col items-center gap-2">
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground"/>
                        <span>Drag & Drop or Click to Upload image</span>
                        <span className="text-sm text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                        </span>
                    </label>
                ) : (
                    imageLoadingState ? (
                    <Skeleton className= "h-10 bg-gray-100"/>):
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                            <FileIcon className="w-5 h-5 text-primary"/>
                            <span className="text-sm font-medium truncate max-w-[180px]">
                                {imageFile.name}
                            </span>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                            onClick={handleRemoveImage}
                            type="button"
                        >
                            <XIcon className="w-4 h-4"/>
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUpload