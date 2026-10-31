import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Hash, 
  Building2, 
  User, 
  Calendar, 
  Award, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  FileCheck2,
  FileX2,
  FileJson,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { computeCertificateFingerprint } from '../utils/cryptoUtils';

export default function VerifierPortal({ 
  initialQuery = '', 
  onViewInCertificate, 
  onTestInTamper 
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeMode, setActiveMode] = useState('search'); // 'search' or 'upload'
  const [dragActive, setDragActive] = useState(false);

  // If initialQuery changes from navigation, trigger search
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleVerify = async (queryToUse) => {
    const q = (queryToUse !== undefined ? queryToUse : query).trim();
    if (!q) return;

    setIsVerifying(true);
    setResult(null);

    // Realistic verification delay for visual reassurance
    await new Promise(r => setTimeout(r, 450));

    const verifyResult = await BlockchainService.verifyQuery(q);
    setIsVerifying(false);
    setResult(verifyResult);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsVerifying(true);
    setResult(null);

    try {
      const text = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        // If not JSON, hash file contents directly
        const fingerprint = await computeCertificateFingerprint({ raw: text });
        const check = await BlockchainService.verifyQuery(fingerprint);
        setIsVerifying(false);
        setResult(check);
        return;
      }

      // If it's a StampTrust exported JSON proof
      if (parsed.certificate) {
        const check = await BlockchainService.verifyRawPayload(parsed.certificate);
        setIsVerifying(false);
        setResult(check);
      } else {
        const check = await BlockchainService.verifyRawPayload(parsed);
        setIsVerifying(false);
        setResult(check);
      }
    } catch (err) {
      setIsVerifying(false);
      setResult({
        status: 'TAMPERED',
        message: 'Could not process file. Document structure is corrupted or invalid.'
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyTx = (tx) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const copyHash = (h) => {
    navigator.clipboard.writeText(h);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const samplePresets = [
    { label: 'ETHGlobal Grand Prize', id: 'CERT-2026-ETHG-8812' },
    { label: 'MIT Blockchain Diploma', id: 'CERT-2026-MITX-4109' },
    { label: 'Google Cloud Fellow', id: 'CERT-2026-GCP-7731' },
    { label: 'Fake / Altered ID (Demo)', id: 'CERT-FAKE-9999-TAMPERED' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutralDark-200 shadow-sm space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Employer & Public Verification Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutralDark-900">
          Instantly Verify Any Certificate
        </h2>
        <p className="text-sm text-neutralDark-500 max-w-2xl">
          Enter a Certificate ID, SHA-256 fingerprint, or upload the credential document. The system validates the cryptographic fingerprint directly against the public blockchain ledger.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-neutralDark-200 gap-4">
        <button
          onClick={() => setActiveMode('search')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeMode === 'search'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-neutralDark-500 hover:text-neutralDark-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search by ID or Hash</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeMode === 'upload'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-neutralDark-500 hover:text-neutralDark-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Verify Document / JSON Upload</span>
        </button>
      </div>

      {/* Search Input Box */}
      {activeMode === 'search' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutralDark-200 shadow-sm space-y-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-neutralDark-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CERT-2026-ETHG-8812) or 64-char Hash..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying || !query.trim()}
              className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm shadow-warm transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 shrink-0"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying on Blockchain...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-neutralDark-400">Try Sample:</span>
            {samplePresets.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sample.id);
                  handleVerify(sample.id);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-neutralDark-50 hover:bg-brand-50 hover:text-brand-700 border border-neutralDark-200 text-neutralDark-700 transition font-mono flex items-center space-x-1"
              >
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Box */}
      {activeMode === 'upload' && (
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed transition text-center space-y-4 ${
            dragActive ? 'border-brand-500 bg-orange-50/50' : 'border-neutralDark-300 hover:border-brand-400'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-600 mx-auto">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutralDark-900">
              Drag & Drop Certificate File or JSON Proof
            </h3>
            <p className="text-xs text-neutralDark-500 max-w-md mx-auto">
              StampTrust computes the SHA-256 digital fingerprint directly in your browser without uploading private files to any central server.
            </p>
          </div>

          <div>
            <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-neutralDark-900 hover:bg-neutralDark-800 text-white font-semibold text-xs cursor-pointer shadow-sm transition">
              <FileJson className="w-4 h-4 text-brand-400" />
              <span>Browse File to Verify</span>
              <input 
                type="file" 
                accept=".json,.pdf,.txt" 
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                className="hidden" 
              />
            </label>
          </div>
        </div>
      )}

      {/* Verification Results Panel */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* VALID / AUTHENTIC STATE (100% Real Green Checkmark) */}
          {result.status === 'VALID' && (
            <div className="bg-verified-50 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-200">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
                    <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        Blockchain Verified
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">• Polygon Block #{result.certificate.blockNumber}</span>
                    </div>
                    <h3 className="text-2xl font-black text-emerald-950 tracking-tight">
                      100% Real & Authentic
                    </h3>
                    <p className="text-sm font-medium text-emerald-800">
                      Issued by <strong className="text-emerald-950 font-bold">{result.certificate.issuerName}</strong> on {result.certificate.issueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => onViewInCertificate(result.certificate)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>View Official Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Credential Data Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/90 p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Recipient Information</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutralDark-900">{result.certificate.studentName}</div>
                    <div className="text-xs text-neutralDark-500 font-mono">{result.certificate.studentEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutralDark-500">Degree / Award:</div>
                    <div className="text-sm font-bold text-brand-600">{result.certificate.courseName}</div>
                  </div>
                  {result.certificate.gradeOrHonor && (
                    <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {result.certificate.gradeOrHonor}
                    </div>
                  )}
                </div>

                {/* Blockchain Provenance */}
                <div className="bg-white/90 p-5 rounded-2xl border border-emerald-200 space-y-3 font-mono text-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Provenance</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-neutralDark-500">Certificate ID:</span>
                      <span className="font-bold text-brand-700">{result.certificate.certificateId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutralDark-500">Block Height:</span>
                      <span className="font-semibold text-neutralDark-800">#{result.certificate.blockNumber} (Finalized)</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-neutralDark-500 mb-0.5">
                        <span>SHA-256 Digital Fingerprint:</span>
                        <button 
                          onClick={() => copyHash(result.certificate.fingerprint)}
                          className="text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-2 bg-slate-900 text-brand-400 rounded-lg text-[11px] break-all select-all font-mono">
                        {result.certificate.fingerprint}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-neutralDark-500 mb-0.5">
                        <span>Tx Hash:</span>
                        <button 
                          onClick={() => copyTx(result.certificate.txHash)}
                          className="text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                        >
                          {copiedTx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-2 bg-slate-100 text-slate-800 rounded-lg text-[11px] break-all select-all font-mono">
                        {result.certificate.txHash}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAMPERED / FORGED / NOT FOUND RED ALERT */}
          {(result.status === 'TAMPERED' || result.status === 'NOT_FOUND') && (
            <div className="bg-tampered-50 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-rose-200">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shrink-0">
                    <ShieldAlert className="w-9 h-9 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                        Integrity Failure Detected
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-rose-950 tracking-tight">
                      {result.status === 'TAMPERED' ? 'Document Altered or Forged!' : 'Unregistered Credential - Not Found'}
                    </h3>
                    <p className="text-sm font-medium text-rose-800">
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.certificate && (
                  <button
                    onClick={() => onTestInTamper(result.certificate)}
                    className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Inspect in Tamper Sandbox</span>
                  </button>
                )}
              </div>

              {/* Educational Explanation of the Failure */}
              <div className="bg-white/90 p-5 rounded-2xl border border-rose-200 space-y-3">
                <h4 className="text-sm font-bold text-rose-950 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Why Did This Certificate Fail Verification?</span>
                </h4>
                <p className="text-xs text-neutralDark-700 leading-relaxed">
                  Blockchain verification compares the exact mathematical SHA-256 fingerprint of the presented document against the immutable block recorded at time of issuance.
                </p>
                <ul className="text-xs text-neutralDark-600 space-y-1 list-disc pl-5">
                  <li><strong>Photoshop Alteration:</strong> If a student modifies their name, GPA, or issue date, the hash completely transforms (Avalanche Effect).</li>
                  <li><strong>Forged Issuer:</strong> If an unauthorized party generated this certificate, no corresponding block exists on the public ledger.</li>
                  <li><strong>Security Recommendation:</strong> Reject this credential and notify the accredited issuing institution.</li>
                </ul>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
