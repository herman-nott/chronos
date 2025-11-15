import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {  // Changed from 'err' to 'error'
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;