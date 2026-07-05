import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // fs = file system.
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({  
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) {
            throw new Error('File path is required for uploading image to Cloudinary')
        }
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'profile_pictures'
        })
        fs.unlinkSync(filePath) // Delete the local file after successful upload
        return result.secure_url
    } catch (error) {
        fs.unlinkSync(filePath) // Delete the local file in case of error as well
        console.error('Error uploading image to Cloudinary:', error)
        throw error 
    }
}

export default uploadOnCloudinary 