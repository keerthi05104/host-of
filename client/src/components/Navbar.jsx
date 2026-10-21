import { Send, Upload, Download } from "lucide-react";

export default function Navbar({ onHome, onAccess, currentPage }) {
  return (
    <nav className="navbar">
      <button className="brand" onClick={onHome}>
        <span className="brand-mark">
          <Send size={17} />
        </span>
        <span>
          Host  OF <span className="brand-period">.</span>
        </span>
      </button>

      <div className="nav-links">
        <button
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}
          onClick={onHome}
        >
          <Upload size={16} />
          Send Files
        </button>

        <button
          className={`nav-link ${currentPage === "access" ? "active" : ""}`}
          onClick={onAccess}
        >
          <Download size={16} />
          Receive Files
        </button>
      </div>
    </nav>
  );
}