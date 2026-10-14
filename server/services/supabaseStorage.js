
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const bucketName =
  process.env.SUPABASE_STORAGE_BUCKET || "send-me-files";

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY in server/.env"
  );
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function uploadToCloud(path, buffer, contentType) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, buffer, {
      contentType: contentType || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return data.path;
}


export async function removeCloudFiles(paths = []) {
  if (!paths.length) return true;

  const { error } = await supabase.storage
    .from(bucketName)
    .remove(paths);

  if (error) {
    console.error("Supabase cleanup failed:", error.message);
    return false;
  }

  return true;
}

export async function getCloudDownloadUrl(path, downloadName) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, 60, {
      download: downloadName || true,
    });

  if (error) {
    throw new Error(`Supabase download link failed: ${error.message}`);
  }

  return data.signedUrl;
}
