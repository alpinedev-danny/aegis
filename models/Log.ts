import mongoose, { Schema, model, models } from "mongoose";

const LogSchema = new Schema({
  amount: { type: String, required: true },
  images: [{ type: String }], // Array of Base64 strings
  userId: { type: String },    // Added this to track who uploaded
  status: { type: String, default: "Processing" },
  date: { type: Date, default: Date.now },
});

// This line is crucial: it checks if the model exists before creating a new one
const Log = models.Log || model("Log", LogSchema);

export default Log;