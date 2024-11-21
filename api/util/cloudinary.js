import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'

    const isCloudinaryConfigured = async () => {
        return (
            process.env.CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        );
    };
    
    dotenv.config({
        path: './.env'
    })
if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
        debug: true,
    });
} else {
    console.error('Cloudinary configuration is missing required parameters.');
}

export const uploadFile = async (req, res) => {
    try {

        if (!isCloudinaryConfigured()) {
            return res.status(500).json({ error: 'Cloudinary not configured properly' });
        }

        if (!req.file.path) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        const imageFile = req.file.path
        if (!imageFile) return null

        const response = await cloudinary.uploader.upload(
            imageFile, { resource_type: 'image', max_file_size: '3MB' }
        )
        res.status(200).json(response.url)
        fs.unlinkSync(imageFile)
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        res.status(500).json({statusText: error.message})
    }
}