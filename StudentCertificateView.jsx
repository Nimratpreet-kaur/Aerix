import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Share2, 
  QrCode, 
  Check, 
  Copy, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  FileText, 
  FileJson, 
  Sparkles,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function StudentCertificateView({ 
  certificates, 
  selectedCertificate, 
  setSelectedCertificate, 
  onTestTamper,
  onVerifyNow 
}) {
  const [activeCert, setActiveCert] = useState(selectedCertificate || certificates[0]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const certificateRef = useRef(null);

  // Sync if prop changes
  useEffect(() => {
    if (selectedCertificate) {
      setActiveCert(selectedCertificate);
    } else if (certificates.length > 0 && !activeCert) {
      setActiveCert(certificates[0]);
    }
  }, [selectedCertificate, certificates]);

  // Generate QR Code whenever active certificate changes
  useEffect(() => {
    if (!activeCert) return;
    const verifyUrl = `${window.location.origin}${window.location.pathname}#verify?id=${activeCert.certificateId}`;
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code error', err));
  }, [activeCert]);

  if (!activeCert) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutralDark-200 p-8">
        <Award className="w-12 h-12 text-neutralDark-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-neutralDark-800">No Certificates Found</h3>
        <p className="text-sm text-neutralDark-500">Issue your first credential in the School Portal to view it here.</p>
      </div>
    );
  }

  // Download high-resolution PNG / PDF
  const downloadCertificatePDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${activeCert.certificateId}_${activeCert.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Download JSON Cryptographic Proof
  const downloadJsonProof = () => {
    const proofPayload = {
      standard: 'StampTrust-Verifiable-Credential-v2',
      blockchain: 'Polygon-PoS-Simulated',
      certificate: activeCert,
      verificationGuide: 'Upload this file to the Verify portal or compute SHA-256 canonical hash to confirm authenticity.'
    };
    const blob = new Blob([JSON.stringify(proofPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCert.certificateId}_cryptographic_proof.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyVerifyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}#verify?id=${activeCert.certificateId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCertId = () => {
    navigator.clipboard.writeText(activeCert.certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Bar: Selector & Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutralDark-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-brand-700 text-xs font-bold border border-orange-200">
            <Award className="w-3.5 h-3.5 text-brand-500" />
            <span>Student Proof & Digital Credential</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutralDark-900">
            Authentic Verifiable Certificate
          </h2>
          <p className="text-sm text-neutralDark-500">
            Export official PDF, copy shareable verification links, or inspect cryptographic proof.
          </p>
        </div>

        {/* Certificate Picker Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutralDark-500">Select Credential:</span>
          {certificates.map((cert) => {
            const isCurrent = cert.certificateId === activeCert.certificateId;
            return (
              <button
                key={cert.certificateId}
                onClick={() => {
                  setActiveCert(cert);
                  setSelectedCertificate(cert);
                }}
                className={`text-xs px-3 py-2 rounded-xl font-medium transition ${
                  isCurrent
                    ? 'bg-neutralDark-900 text-white shadow-sm'
                    : 'bg-neutralDark-50 hover:bg-neutralDark-100 text-neutralDark-700 border border-neutralDark-200'
                }`}
              >
                {cert.studentName.split(' ')[0]} - {cert.courseName.substring(0, 18)}...
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Certificate Visual Frame (High-Res Printable) */}
      <div className="bg-neutralDark-100 p-3 sm:p-6 rounded-3xl overflow-x-auto shadow-inner">
        <div 
          ref={certificateRef}
          className="min-w-[760px] max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl certificate-border shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Security Guilloche Background Watermark */}
          <div className="absolute inset-0 certificate-watermark opacity-15 pointer-events-none"></div>

          {/* Top Header of Certificate */}
          <div className="relative text-center space-y-3 pb-6 border-b border-orange-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-700">
                StampTrust Immutable Blockchain Record
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-neutralDark-900 uppercase">
              Certificate of Achievement
            </h1>
            <p className="text-xs font-mono tracking-widest uppercase text-neutralDark-500">
              Cryptographically Verified • Permanently Anchored to Polygon
            </p>
          </div>

          {/* Certificate Body */}
          <div className="relative py-8 text-center space-y-6">
            <p className="text-sm font-serif italic text-neutralDark-600">
              This digital stamp of authenticity confirms that
            </p>

            {/* Recipient Name */}
            <div className="relative inline-block px-8 py-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutralDark-900 tracking-tight font-serif border-b-2 border-brand-500 pb-2">
                {activeCert.studentName}
              </h2>
            </div>

            <p className="text-sm text-neutralDark-600 max-w-xl mx-auto">
              has completed all requirements and is officially recognized for distinguished performance in
            </p>

            {/* Course Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-brand-600 font-sans max-w-2xl mx-auto">
              {activeCert.courseName}
            </h3>

            {/* Honors & Description */}
            <div className="max-w-xl mx-auto space-y-2">
              {activeCert.gradeOrHonor && (
                <div className="inline-block px-4 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold border border-brand-200">
                  {activeCert.gradeOrHonor}
                </div>
              )}
              {activeCert.description && (
                <p className="text-xs text-neutralDark-500 italic leading-relaxed">
                  "{activeCert.description}"
                </p>
              )}
            </div>
          </div>

          {/* Signatures & Seal Row */}
          <div className="relative pt-6 border-t border-orange-200 grid grid-cols-3 items-end gap-4 text-center">
            
            {/* Left: Organization Authority */}
            <div className="space-y-1">
              <div className="font-serif italic text-base text-neutralDark-800 border-b border-neutralDark-400 pb-1 max-w-[180px] mx-auto">
                {activeCert.issuerName.split(' ')[0]} Chancellor
              </div>
              <div className="text-[11px] font-bold text-neutralDark-800 uppercase tracking-wider">
                {activeCert.issuerName}
              </div>
              <div className="text-[10px] text-neutralDark-500">Authorized Signatory</div>
            </div>

            {/* Center: Warm Gold Foil Blockchain Seal */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 via-amber-500 to-orange-400 p-1 shadow-lg flex items-center justify-center text-white">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-200 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-brand-600 to-amber-700">
                  <Award className="w-7 h-7 text-amber-200 mb-0.5" />
                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-white leading-tight">
                    OFFICIAL SEAL
                  </span>
                  <span className="text-[7px] font-mono text-amber-200">
                    VERIFIED ON-CHAIN
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutralDark-500">
                Issued: {activeCert.issueDate}
              </span>
            </div>

            {/* Right: Dynamic Verifier QR Code */}
            <div className="flex flex-col items-center space-y-1">
              {qrDataUrl && (
                <div className="p-1.5 bg-white border border-neutralDark-300 rounded-lg shadow-xs">
                  <img src={qrDataUrl} alt="Verification QR Code" className="w-18 h-18 sm:w-20 sm:h-20" />
                </div>
              )}
              <span className="text-[9px] font-mono text-neutralDark-600 tracking-wider">
                SCAN TO VERIFY
              </span>
            </div>

          </div>

          {/* Cryptographic Provenance Bar */}
          <div className="mt-8 pt-4 border-t border-neutralDark-200 bg-slate-50 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-4 sm:px-8 text-[11px] font-mono text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="text-slate-400">Cert ID:</span>{' '}
              <strong className="text-slate-900 font-bold">{activeCert.certificateId}</strong>
            </div>
            <div>
              <span className="text-slate-400">Block:</span>{' '}
              <span className="font-semibold text-slate-800">#{activeCert.blockNumber}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-400">Fingerprint:</span>{' '}
              <span className="text-brand-600 font-semibold">{activeCert.fingerprint.substring(0, 12)}...{activeCert.fingerprint.substring(52)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Tray */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* PDF Download */}
        <button
          onClick={downloadCertificatePDF}
          disabled={isExporting}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm shadow-warm transition active:scale-98"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF'}</span>
        </button>

        {/* JSON Proof Download */}
        <button
          onClick={downloadJsonProof}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white hover:bg-neutralDark-50 text-neutralDark-800 border border-neutralDark-200 font-bold text-sm shadow-xs transition"
        >
          <FileJson className="w-4 h-4 text-brand-600" />
          <span>Download JSON Proof</span>
        </button>

        {/* Copy Shareable Link */}
        <button
          onClick={copyVerifyLink}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white hover:bg-neutralDark-50 text-neutralDark-800 border border-neutralDark-200 font-bold text-sm shadow-xs transition"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutralDark-500" />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
        </button>

        {/* Test in Tamper Sandbox */}
        <button
          onClick={() => onTestTamper(activeCert)}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-sm transition"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Test in Tamper Sandbox</span>
        </button>

      </div>

      {/* Sharing Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-neutralDark-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutralDark-900 flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-brand-500" />
          <span>Share with Employers & LinkedIn</span>
        </h4>
        <p className="text-xs text-neutralDark-600">
          Employers can instantly verify this credential by clicking your public link or scanning the QR code on your printed resume.
        </p>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="truncate max-w-full text-slate-700">
            {`${window.location.origin}${window.location.pathname}#verify?id=${activeCert.certificateId}`}
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onVerifyNow(activeCert.certificateId)}
              className="px-3 py-1.5 rounded-lg bg-neutralDark-900 hover:bg-neutralDark-800 text-white font-medium text-xs transition"
            >
              Verify Instantly
            </button>
            <button
              onClick={copyCertId}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium text-xs transition flex items-center space-x-1"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
