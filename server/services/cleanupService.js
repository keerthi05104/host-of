
import Share from "../models/Share.js";
import { removeCloudFiles } from "./supabaseStorage.js";

let cleanupRunning = false;

export async function cleanupExpiredShares() {
  if (cleanupRunning) return;

  cleanupRunning = true;

  try {
    const expiredShares = await Share.find({
      expiresAt: { $ne: null, $lte: new Date() },
    }).select("_id shareId files.storedName");

    for (const share of expiredShares) {
      const paths = share.files
        .map((file) => file.storedName)
        .filter(Boolean);

      const deleted = await removeCloudFiles(paths);

      if (!deleted) {
        console.error(
          `Cleanup postponed for expired share: ${share.shareId}`
        );
        continue;
      }

      await Share.deleteOne({ _id: share._id });

      console.log(
        `Expired share cleaned up: ${share.shareId}`
      );
    }
  } catch (error) {
    console.error("Expired-share cleanup failed:", error.message);
  } finally {
    cleanupRunning = false;
  }
}
