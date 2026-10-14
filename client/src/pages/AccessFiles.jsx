import { useState } from "react";
import { ArrowLeft, KeyRound, Search } from "lucide-react";
import FileList from "../components/FileList.jsx";
import { getShare } from "../services/api.js";

export default function AccessFiles({ onHome }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [share, setShare] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true); setError(""); setShare(null);
    try { setShare(await getShare(code.trim())); }
    catch (err) { setError(err.message || "We couldn't find that share."); }
    finally { setBusy(false); }
  }

  return <main className="access-page">
    <button className="back-link" onClick={onHome}><ArrowLeft size={16}/> Back to Send Me</button>
    <div className="access-intro"><div className="access-mark"><KeyRound size={24}/></div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR FILES ARE ONE CODE AWAY</div><h1 className="upload-heading">One Pin Instant Access.</h1><br/><p><h2>Your files are just a step away.</h2></p></div>
    <form className="code-form" onSubmit={submit}>
      <label htmlFor="share-code">SHARING CODE</label>
      <div className="code-input-wrap"><KeyRound size={18}/><input id="share-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your share code" autoComplete="off" required maxLength={80}/></div>
      <button className="primary-button" type="submit" disabled={busy || !code.trim()}>{busy ? <><span className="spinner"/> Finding your files…</> : <><Search size={17}/> Access files <span className="button-arrow">↗</span></>}</button>
      {error && <div className="error-banner" role="alert">{error}</div>}
    </form>
    {share && <FileList share={share}/>}
    <p className="privacy-caption"><KeyRound size={14}/> Share codes work like keys. Only enter codes from people you trust.</p>
  </main>;
}
