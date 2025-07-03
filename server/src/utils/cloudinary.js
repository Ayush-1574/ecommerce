import cloudinary from "cloudinary"

cloudinary.config({ 
<<<<<<< HEAD
        cloud_name: '', 
        api_key: '', 
        api_secret: '' // Click 'View API Keys' above to copy your API secret
=======
        cloud_name: process.env_CLOUD_NAME, 
        api_key:  process.env_api_key, 
        api_secret: process.env_api_secret  // Click 'View API Keys' above to copy your API secret
>>>>>>> c09857e46ed8436a2d58b70f12f22eccd487c91e
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
