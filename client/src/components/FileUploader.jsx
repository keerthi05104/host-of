

import { useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  Plus,
  X,
} from "lucide-react";

const MAX_FILES = 100;
const MAX_BYTES = 100 * 1024 * 1024;

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();

  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return FileImage;
  if (["mp4", "mov", "webm", "mkv"].includes(ext))
    return FileVideo;
  if (["pdf", "doc", "docx", "txt", "md"].includes(ext))
    return FileText;
  if (["zip", "rar", "7z", "gz"].includes(ext))
    return FileArchive;

  return File;
}

export default function FileUploader({ onCreate, busy }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [validityDays, setValidityDays] = useState(7);

  
  function openFilePicker() {
    if (!busy) {
      inputRef.current?.click();
    }
  }

  function handleDropzoneClick(event) {
    if (event.target.closest("button, input, a")) return;

    openFilePicker();
  }

  function handleDropzoneKeyDown(event) {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  function addFiles(incoming) {
    setError("");
    const next = [...files];

    for (const file of Array.from(incoming)) {
      if (
        next.some(
          (item) => item.name === file.name && item.size === file.size
        )
      ) {
        continue;
      }

      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than the 45 MB limit.`);
        continue;
      }

      if (next.length >= MAX_FILES) {
        setError("You can share up to 5 files at a time.");
        break;
      }

      next.push(file);
    }

    setFiles(next);
  }

  function removeFuseile(index) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function submit() {
    if (!files.length || busy) return;

    setError("");

    try {
      const result = await onCreate(files, { validityDays });
      sessionStorage.setItem(
  "sendMeLastShare",
  JSON.stringify(result)
  
);

      if (result) {
        setFiles([]);
      }
    } catch (err) {
      setError(err.message || "Could not create the share.");
    }
    const result = await onCreate(files, { validityDays });

sessionStorage.setItem(
  "sendMeLastShare",
  JSON.stringify(result)
);

if (result) {
  setFiles([]);
}
  }

  return (
    <div className="uploader">
      <div
        className={`dropzone ${dragging ? "dragging" : ""} ${
          files.length ? "has-files" : ""
        }`}
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-label="Choose files to upload or drop files here"
        aria-disabled={busy}
        onClick={handleDropzoneClick}
        onKeyDown={handleDropzoneKeyDown}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);

          if (!busy) {
            addFiles(event.dataTransfer.files);
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          disabled={busy}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <div className="upload-icon">
          <CloudUpload size={26} />
        </div>

        <h3>Drop your files here</h3>

        <p>
          or{" "}
          <button
            type="button"
            className="inline-link"
            disabled={busy}
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
          >
            browse files
          </button>{" "}
          from your device
        </p>

        <span className="upload-limit">
          Up to 5 files · Upto 100 MB
        </span>
      </div>

      <div className="validity-field">
        <label htmlFor="validityDays">File validity</label>

        <select
          id="validityDays"
          value={validityDays}
          disabled={busy}
          onChange={(event) =>
            setValidityDays(Number(event.target.value))
          }
        >
          <option value={1}>01 day</option>
          <option value={3}>03 day</option>
          <option value={7}>07 day </option>
          <option value={14}>14 day</option>
          <option value={30}>30 day</option>
        </select>

        <p>
          Your files will be accessible for the selected duration.
        </p>
      </div>

      {error && (
        <div className="inline-error" role="alert">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="selected-files">
          <div className="file-section-heading">
            <span>
              Selected files <b>{files.length}</b>
            </span>

            <button
              type="button"
              className="clear-button"
              onClick={() => setFiles([])}
              disabled={busy}
            >
              Clear all
            </button>
          </div>

          {files.map((file, index) => {
            const Icon = fileIcon(file.name);

            return (
              <div
                className="selected-file"
                key={`${file.name}-${file.size}-${index}`}
              >
                <span className="file-type-icon">
                  <Icon size={18} />
                </span>

                <span className="file-details">
                  <strong title={file.name}>{file.name}</strong>
                  <small>{formatSize(file.size)}</small>
                </span>

                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(index)}
                  disabled={busy}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

     
<button
  type="button"
  className="create-share-btn"
  onClick={submit}
  disabled={busy || files.length === 0}
>
  <Plus size={18} strokeWidth={2.5} />
  {busy ? "Creating share..." : "Create share"}
</button>

    </div>
  );
}
