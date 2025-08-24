import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dyp1dxd7a",
  api_key: process.env.CLOUDINARY_API_KEY||"619817595758421",
  api_secret: process.env.CLOUDINARY_API_SECRET||"CKbzmVIiqxXjWi1e69lbnBt1TL0",
});

export default cloudinary;
