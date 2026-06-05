import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "CareerAI",
    });

    console.log("Connected to mongodb");
  } catch (err: any) {
    console.error("FULL MONGO ERROR:");
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
