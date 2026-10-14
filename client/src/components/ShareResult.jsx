import { Plus, ArrowRight } from "lucide-react";
import { Check, Copy, Link2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ShareResult({ share, onReset }) {
  const [copied, setCopied] = useState(false);
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(share.shareId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return <section className="result-card" aria-live="polite">
    <div className="result-top"><span className="success-icon"><Check size={21}/></span><div><h3>Your share is ready</h3><p>Send this code to the person receiving your files.</p></div></div>
    <div className="share-code-box"><span className="code-label">YOUR SHARE CODE</span><strong>{share.shareId}</strong><button className="copy-button" onClick={copyCode}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copied" : "Copy code"}</button></div>
    <div className="result-note"><ShieldCheck size={17}/><span>Anyone with this code can access these files. Share it only with people you trust.</span></div>
    {share.expiresAt && <p className="expiry-note"><Link2 size={14}/> This share expires {new Date(share.expiresAt).toLocaleString()}.</p>}
   

<button
  type="button"
  className="create-another-share-btn"
  onClick={onReset}
>
  
  <span>Return</span>
  <ArrowRight size={18} />
</button>


  </section>;
}
