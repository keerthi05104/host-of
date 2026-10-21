
import { useState } from "react";
import { Github, Heart, Send } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AccessFiles from "./pages/AccessFiles.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  function navigate(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <Navbar
        onHome={() => navigate("home")}
        onAccess={() => navigate("access")}
        currentPage={page}
      />

      {page === "home" ? (
        <Home onAccess={() => navigate("access")} />
      ) : (
        <AccessFiles onHome={() => navigate("home")} />
      )}

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark small-mark">
            <Send size={14} />
          </span>
          <span>
            HostOF <span className="brand-period">.</span>
          </span>
        </div>
        <p>Made for moving things forward.</p>
        <span className="footer-right">
          Simple sharing, <Heart size={13} /> thoughtfully done
        </span>
      </footer>
    </div>
  );
}
