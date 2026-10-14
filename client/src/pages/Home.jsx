import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, LockKeyhole, Zap } from "lucide-react";
import FileUploader from "../components/FileUploader.jsx";
import ShareResult from "../components/ShareResult.jsx";
import { createShare } from "../services/api.js";

export default function Home({ onAccess }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [share, setShare] = useState(null);

  useEffect(() => {
  const savedShare = sessionStorage.getItem("sendMeLastShare");

  if (savedShare) {
    try {
      const result = JSON.parse(savedShare);

      if (result?.success && result?.shareId) {
        setShare(result);
      } else {
        sessionStorage.removeItem("sendMeLastShare");
      }
    } catch {
      sessionStorage.removeItem("sendMeLastShare");
    }
  }
}, []);

  
async function handleCreate(files, options) {
  setBusy(true);
  setError("");

  try {
    const result = await createShare(files, options);
    setShare(result);

    sessionStorage.setItem(
      "sendMeLastShare",
      JSON.stringify(result)
    );

    return result;
  } catch (err) {
    setError(err.message || "Could not create the share.");
    return false;
  } finally {
    setBusy(false);
  }
}

  return <main>
    <section className="hero">
      <div className="eyebrow"><span className="eyebrow-dot"/> FILE SHARING, REIMAGINED</div>
      
        <h1 className="hero-title">
  One Code <br></br> <span>Seamless Delivery.</span>
</h1>


      
      <p className="hero-copy">The simplest way to send files to anyone, anywhere.<br className="desktop-break"/> No account. No fuss. Just share and go.</p>
      <div className="hero-proof"><span><CheckCircle2 size={15}/> No sign-up needed</span><span><LockKeyhole size={15}/> Private share codes</span></div>
    </section>

    <section className="workspace" id="share">
      <div className="workspace-heading"><div><span className="section-kicker">SEND SOMETHING</span><h2>Share Here</h2><p>Choose what you want to send. We'll handle the rest.</p></div><div className="step-pill"><span>01</span> Upload</div></div>
     
      {share ? (
  <ShareResult
    share={share}
    onReset={() => {
      setShare(null);
      sessionStorage.removeItem("sendMeLastShare");
    }}
  />
) : (
  <FileUploader onCreate={handleCreate} busy={busy} />
)}

      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="workspace-foot"><span><LockKeyhole size={14}/> Your files stay off public listings</span><span>Max Size 45 MB </span></div>
    </section>

    <section className="receive-prompt">
      <div className="receive-icon"><ArrowDown size={21}/></div><div><h3>Here to receive files?</h3><p>Already have a share code? Enter it to get your files.</p></div><button className="secondary-button" onClick={onAccess}>Enter a code <ArrowRight size={16}/></button>
    </section>

    <section className="how-section">
      <div className="section-kicker">THAT'S REALLY IT</div><h2>Three steps. <span>Done.</span></h2>
      <div className="steps-grid">
        <article className="step-card"><div className="step-number">01</div><div className="step-symbol"><Zap size={21}/></div><h3>Pick your files</h3><p>Choose one file or a handful. No account creation to slow you down.</p></article>
        <article className="step-card"><div className="step-number">02</div><div className="step-symbol"><LockKeyhole size={21}/></div><h3>Get your code</h3><p>We create a unique sharing code that points to your files.</p></article>
        <article className="step-card"><div className="step-number">03</div><div className="step-symbol"><ArrowRight size={21}/></div><h3>Send it along</h3><p>Share the code. The recipient enters it and downloads the files.</p></article>
      </div>
    </section>
  </main>;
}
