import cloudinary from "cloudinary"

cloudinary.config({ 
        cloud_name: '', 
        api_key: '', 
        api_secret: '' // Click 'View API Keys' above to copy your API secret
});

async function ImageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file , {
        resource_type : "auto"
    })
    return result;
}

export{
    ImageUploadUtils
}
