import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  size: { type: Number, required: true, min: 1 },
  mimeType: { type: String, default: "application/octet-stream" }
}, { _id: false });

const shareSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true, index: true },
  files: { type: [fileSchema], required: true, validate: v => v.length > 0 },
  createdAt: { type: Date, default: Date.now, immutable: true },
  expiresAt: { type: Date, default: null }
});

export default mongoose.model("Share", shareSchema);
