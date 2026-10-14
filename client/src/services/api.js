async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed. Please try again.");
  return data;
}


export async function createShare(files, options = {}) {
  const { validityDays = 7, onProgress } = options;

  const form = new FormData();

  files.forEach((file) => {
    form.append("files", file);
  });

  // Send the selected expiry duration to the backend.
  form.append("validityDays", String(validityDays));

  const reportProgress = (status) => {
    if (typeof onProgress === "function") {
      onProgress(status);
    }
  };

  reportProgress("uploading");

  try {
    const response = await fetch("/api/shares", {
      method: "POST",
      body: form,
    });

    return await parseResponse(response);
  } finally {
    reportProgress("done");
  }
}


export async function getShare(shareId) {
  return parseResponse(await fetch(`/api/shares/${encodeURIComponent(shareId.trim())}`));
}

export function downloadUrl(shareId, fileId) {
  return `/api/shares/${encodeURIComponent(shareId)}/files/${encodeURIComponent(fileId)}/download`;
}
