
import { randomBytes, randomUUID } from "node:crypto";
import Share from "../models/Share.js";
import {
  uploadToCloud,
  removeCloudFiles,
  getCloudDownloadUrl
} from "../services/supabaseStorage.js";

const publicFile = file => ({
  fileId: file.fileId,
  originalName: file.originalName,
  size: file.size,
  mimeType: file.mimeType
});

function validShareId(id) {
  return typeof id === "string" &&
    /^[A-Za-z0-9_-]{20,80}$/.test(id);
}

function isExpired(share) {
  return Boolean(
    share.expiresAt &&
    new Date(share.expiresAt).getTime() <= Date.now()
  );
}

export async function createShare(req, res, next) {
  const uploaded = req.files || [];

  if (!uploaded.length) {
    return res.status(400).json({
      success: false,
      message: "Choose at least one file first."
    });
  }

  const uploadedPaths = [];

  try {
    const blocked = /\.(exe|dll|bat|cmd|com|msi|sh|ps1)$/i;
    const bad = uploaded.find(file => blocked.test(file.originalname));

    if (bad) {
      return res.status(400).json({
        success: false,
        message: "Executable files are not allowed."
      });
    }

    
const requestedDays = Number.parseInt(req.body.validityDays, 10);

const validityDays = [1, 3, 7, 14, 30].includes(requestedDays)
  ? requestedDays
  : 7;

const expiresAt = new Date(
  Date.now() + validityDays * 24 * 60 * 60 * 1000
);
const shareId = randomBytes(4).toString("base64url").slice(0, 6);
    const cloudFiles = [];

    for (const file of uploaded) {
      const fileId = randomUUID();
      const storagePath = `${shareId}/${fileId}`;

      const storedPath = await uploadToCloud(
        storagePath,
        file.buffer,
        file.mimetype
      );

      uploadedPaths.push(storedPath);

      cloudFiles.push({
        fileId,
        originalName:
          file.originalname.replace(/[\/\\\0]/g, "_").slice(0, 240) ||
          "download",
        storedName: storedPath,
        size: file.size,
        mimeType: file.mimetype || "application/octet-stream"
      });
    }

    const share = new Share({
      shareId,
      files: cloudFiles,
      expiresAt
    });

    await share.save();

    return res.status(201).json({
      success: true,
      shareId: share.shareId,
      expiresAt: share.expiresAt,
      files: share.files.map(publicFile)
    });
  } catch (error) {
    await removeCloudFiles(uploadedPaths);
    return next(error);
  }
}

export async function getShare(req, res, next) {
  try {
    if (!validShareId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "That sharing code does not look valid."
      });
    }

    const share = await Share.findOne({
      shareId: req.params.id
    }).lean();

    if (!share || isExpired(share)) {
      return res.status(404).json({
        success: false,
        message: "This share is unavailable or has expired."
      });
    }

    return res.json({
      success: true,
      shareId: share.shareId,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      files: share.files.map(publicFile)
    });
  } catch (error) {
    return next(error);
  }
}

export async function downloadFile(req, res, next) {
  try {
    const { id, fileId } = req.params;

    if (
      !validShareId(id) ||
      typeof fileId !== "string" ||
      fileId.length > 80
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid share or file identifier."
      });
    }

    const share = await Share.findOne({
      shareId: id
    }).lean();

    if (!share || isExpired(share)) {
      return res.status(404).json({
        success: false,
        message: "This share is unavailable or has expired."
      });
    }

    const file = share.files.find(item => item.fileId === fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "That file was not found in this share."
      });
    }

    const signedUrl = await getCloudDownloadUrl(
      file.storedName,
      file.originalName
    );

    return res.redirect(302, signedUrl);
  } catch (error) {
    return next(error);
  }
}
