import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI|| "mongodb://localhost:27017/lmsuser";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI||"mongodb://localhost:27017/lmsuser");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1); // 1 means failure
  }
};
