import { Download, File, FileArchive, FileImage, FileText, FileVideo } from "lucide-react";
import { downloadUrl } from "../services/api.js";

const formatSize = bytes => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
function iconFor(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["png","jpg","jpeg","gif","webp","svg"].includes(ext)) return FileImage;
  if (["mp4","mov","webm","mkv"].includes(ext)) return FileVideo;
  if (["pdf","doc","docx","txt","md"].includes(ext)) return FileText;
  if (["zip","rar","7z","gz"].includes(ext)) return FileArchive;
  return File;
}

export default function FileList({ share }) {
  return <section className="received-card">
    <div className="received-heading"><span className="success-icon small">✓</span><div><h3>Files are ready</h3><p>{share.files.length} {share.files.length === 1 ? "file" : "files"} shared with you</p></div></div>
    <div className="received-list">
      {share.files.map(file => {
        const Icon = iconFor(file.originalName);
        return <div className="received-file" key={file.fileId}>
          <span className="file-type-icon"><Icon size={19}/></span>
          <span className="file-details"><strong title={file.originalName}>{file.originalName}</strong><small>{formatSize(file.size)}</small></span>
          <a className="download-button" href={downloadUrl(share.shareId, file.fileId)}><Download size={16}/><span>Download</span></a>
        </div>;
      })}
    </div>
    {share.expiresAt && <p className="expiry-note">Available until {new Date(share.expiresAt).toLocaleString()}.</p>}
  </section>;
}
