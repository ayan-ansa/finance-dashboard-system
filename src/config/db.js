import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    console.log("Connection failed");
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database disconnected");
  process.exit(0);
});