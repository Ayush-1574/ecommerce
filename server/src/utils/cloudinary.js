import cloudinary from "cloudinary"

cloudinary.config({ 
        cloud_name: 'dqgu2uehs', 
        api_key: '963963479694837', 
        api_secret: 'g6DHGctJdSGlXbKX6gG9zyR70EM' // Click 'View API Keys' above to copy your API secret
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
