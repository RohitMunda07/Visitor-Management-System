import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadOnCloudinary = async (localPath) => {
//     try {
//         if (!localPath) return null;
//         console.log("checked localPath");

//         const response = await cloudinary.uploader.upload(localPath, {
//             resource_type: "image"
//         })

//         console.log("check after upload");
//         console.log("File Uploaded:", response?.url || "Error Getting Cloudinary URL");

//         fs.unlinkSync(localPath)
//         console.log("File Unlink Successfully");

//         return response;
//     } catch (error) {
//         console.log("Cloudinary Upload Error:", error);
//         if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
//         return null;
//     }
// };

const delteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        console.log("Public Id checked");

        const response = cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        })

        if (!response) {
            console.log("Error while deleting image on cloudinary");
            return null;
        }

        console.log("Image Deleted Successfully", response);

    } catch (error) {
        console.log("Cloudinary Delete Error", error);
        return null;
    }
};

const uploadBufferToCloudinary = (buffer, folder = "vms") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image"
        },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        ).end(buffer);
    });
};



export {
    // uploadOnCloudinary,
    delteFromCloudinary,
    uploadBufferToCloudinary
}