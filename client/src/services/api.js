
const API_BASE_URL = "https://send-me-bt5l.onrender.com";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function createShare(files, options = {}) {
  const { validityDays = 7, onProgress } = options;

  const form = new FormData();

  files.forEach((file) => {
    form.append("files", file);
  });

  form.append("validityDays", String(validityDays));

  const reportProgress = (status) => {
    if (typeof onProgress === "function") {
      onProgress(status);
    }
  };

  reportProgress("uploading");

  try {
    const response = await fetch(`${API_BASE_URL}/api/shares`, {
      method: "POST",
      body: form,
    });

    return await parseResponse(response);
  } finally {
    reportProgress("done");
  }
}

export async function getShare(shareId) {
  const url = `${API_BASE_URL}/api/shares/${encodeURIComponent(
    shareId.trim()
  )}`;

  return parseResponse(await fetch(url));
}

export function downloadUrl(shareId, fileId) {
  return `${API_BASE_URL}/api/shares/${encodeURIComponent(
    shareId
  )}/files/${encodeURIComponent(fileId)}/download`;
}