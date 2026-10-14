import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { uploadDir } from "../services/fileStorage.js";
import { createShare, getShare, downloadFile } from "../controllers/shareController.js";

const router = Router();
const maxSize = Math.max(1, Number.parseInt(process.env.MAX_FILE_SIZE_MB || "100", 10)) * 1024 * 1024;
const maxFiles = Math.max(1, Math.min(5, Number.parseInt(process.env.MAX_FILES_PER_SHARE || "100", 10)));



const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Math.max(
      1,
      Number.parseInt(process.env.MAX_FILE_SIZE_MB || "100", 10)
    ) * 1024 * 1024,
    files: Math.max(
      1,
      Math.min(
        100,
        Number.parseInt(process.env.MAX_FILES_PER_SHARE || "100", 10)
      )
    ),
  },
});


router.post("/", (req, res, next) => {
  upload.array("files", maxFiles)(req, res, error => {
    if (error) {
      const uploaded = (req.files || []).map(file => file.filename);
      if (uploaded.length) import("../services/fileStorage.js").then(({removeStoredFiles}) => removeStoredFiles(uploaded));
      return next(error);
    }
    createShare(req, res, next);
  });
});
router.get("/:id", getShare);
router.get("/:id/files/:fileId/download", downloadFile);

export default router;
