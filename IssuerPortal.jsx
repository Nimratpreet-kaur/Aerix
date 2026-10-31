import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Building2, 
  User, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Hash, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck,
  FileBadge2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { computeCertificateFingerprint } from '../utils/cryptoUtils';

export default function IssuerPortal({ onCertificateIssued, onViewCertificate }) {
  const [formData, setFormData] = useState({
    studentName: 'Maya Lin Patel',
    studentEmail: 'maya.patel@stanford.edu',
    issuerName: 'Stanford Center for Blockchain Research',
    courseName: 'Advanced Smart Contract Engineering & Security Fellowship',
    issueDate: new Date().toISOString().split('T')[0],
    gradeOrHonor: 'Highest Distinction (Top 1%)',
    skills: 'Solidity, ZK-Rollups, Formal Verification, DeFi Security',
    description: 'Awarded for extraordinary mastery in decentralized consensus algorithms, cryptographic primitive implementation, and formal protocol auditing.',
  });

  const [liveFingerprint, setLiveFingerprint] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [miningStep, setMiningStep] = useState('');
  const [issuedResult, setIssuedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Recalculate live SHA-256 fingerprint in real-time as user types
  useEffect(() => {
    let isMounted = true;
    async function updateHash() {
      const hash = await computeCertificateFingerprint(formData);
      if (isMounted) {
        setLiveFingerprint(hash);
      }
    }
    updateHash();
    return () => { isMounted = false; };
  }, [formData]);

  const presets = [
    {
      label: 'Stanford Blockchain Fellowship',
      data: {
        studentName: 'Maya Lin Patel',
        studentEmail: 'maya.patel@stanford.edu',
        issuerName: 'Stanford Center for Blockchain Research',
        courseName: 'Advanced Smart Contract Engineering & Security Fellowship',
        issueDate: new Date().toISOString().split('T')[0],
        gradeOrHonor: 'Highest Distinction (Top 1%)',
        skills: 'Solidity, ZK-Rollups, Formal Verification, DeFi Security',
        description: 'Awarded for extraordinary mastery in decentralized consensus algorithms, cryptographic primitive implementation, and formal protocol auditing.'
      }
    },
    {
      label: 'Hackathon Grand Prize',
      data: {
        studentName: 'Jordan Vance & Team Cipher',
        studentEmail: 'team.cipher@solanahack.org',
        issuerName: 'Global Web3 Builders Olympiad 2026',
        courseName: 'Decentralized AI Agents & Oracle Systems Hackathon',
        issueDate: new Date().toISOString().split('T')[0],
        gradeOrHonor: 'Grand Champion ($50,000 Award)',
        skills: 'Rust, Solana, Oracles, Autonomous Agents, Cryptoeconomics',
        description: '1st place out of 840 international submissions for developing a low-latency verifiable oracle protocol.'
      }
    },
    {
      label: 'Cybersecurity Certificate',
      data: {
        studentName: 'Ethan Brooks',
        studentEmail: 'ethan.brooks@mit.alumni.edu',
        issuerName: 'MIT Cybersecurity Defense Initiative',
        courseName: 'Certified Zero-Trust Cryptographic Architect',
        issueDate: new Date().toISOString().split('T')[0],
        gradeOrHonor: 'Grade: 99.1% (Exemplary)',
        skills: 'SHA-256, Public Key Cryptography, HSMs, Zero Trust',
        description: 'Complete certification covering quantum-resistant key exchange, distributed verifiable credentials, and enterprise threat modeling.'
      }
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyPreset = (preset) => {
    setFormData(preset.data);
    setIssuedResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.courseName || !formData.issuerName) return;

    setIsMining(true);
    setIssuedResult(null);

    // Simulate blockchain mining progression
    setMiningStep('1/3 Canonicalizing payload & generating SHA-256 fingerprint...');
    await new Promise(r => setTimeout(r, 600));

    setMiningStep('2/3 Broadcasting transaction to Polygon PoS validator pool...');
    await new Promise(r => setTimeout(r, 700));

    setMiningStep('3/3 Consensus achieved! Finalizing block on-chain...');
    await new Promise(r => setTimeout(r, 700));

    // Convert skills string into array
    const skillsArray = typeof formData.skills === 'string'
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.skills;

    const result = await onCertificateIssued({
      ...formData,
      skills: skillsArray
    });

    setIsMining(false);
    setMiningStep('');
    setIssuedResult(result);

    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#EA580C', '#10B981', '#3B82F6']
      });
    } catch {
      // Confetti fallback
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutralDark-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-brand-700 text-xs font-bold border border-orange-200">
            <Building2 className="w-3.5 h-3.5 text-brand-500" />
            <span>School / Organizer Issuing Station</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutralDark-900">
            Issue a Verifiable Credential
          </h2>
          <p className="text-sm text-neutralDark-500">
            Fills student details, calculates the cryptographic fingerprint, and writes it permanently to the blockchain ledger.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <span className="text-xs font-semibold text-neutralDark-500 self-center hidden lg:block">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-neutralDark-50 hover:bg-neutralDark-100 border border-neutralDark-200 text-neutralDark-700 hover:text-neutralDark-900 transition flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-brand-500" />
              <span>{p.label.split(' ')[0]} {p.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Hash Engine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutralDark-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                Student / Recipient Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-neutralDark-400" />
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="e.g. Maya Lin Patel"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                />
              </div>
            </div>

            {/* Email & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                  Student Email / Identifier *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutralDark-400" />
                  <input
                    type="email"
                    name="studentEmail"
                    required
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                  Issue Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-neutralDark-400" />
                  <input
                    type="date"
                    name="issueDate"
                    required
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Issuer / School Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                School / Issuing Organization *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-neutralDark-400" />
                <input
                  type="text"
                  name="issuerName"
                  required
                  value={formData.issuerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Stanford University or ETHGlobal"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                />
              </div>
            </div>

            {/* Course / Program Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                Course, Degree, or Hackathon Award Title *
              </label>
              <div className="relative">
                <Award className="absolute left-3.5 top-3 w-4 h-4 text-neutralDark-400" />
                <input
                  type="text"
                  name="courseName"
                  required
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="e.g. Master of Science in Computer Science"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                />
              </div>
            </div>

            {/* Grade & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                  Grade / Honor / Standing
                </label>
                <input
                  type="text"
                  name="gradeOrHonor"
                  value={formData.gradeOrHonor}
                  onChange={handleInputChange}
                  placeholder="e.g. Grade A+ / 1st Place"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                  Skills / Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Solidity, Cryptography, AI"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm font-medium text-neutralDark-900 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutralDark-700 mb-1.5">
                Certificate Citations / Scope
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-neutralDark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm text-neutralDark-800 transition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isMining}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-warm transition transform ${
                isMining
                  ? 'bg-neutralDark-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-98'
              }`}
            >
              {isMining ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Mining Block on Polygon Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Issue & Anchor to Blockchain Permanently</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Live Cryptographic Fingerprint Engine */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Fingerprint Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-brand-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Live SHA-256 Fingerprint
                </span>
              </div>
              <span className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Hash</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              As you type on the left, the app converts student details into this unique 64-character cryptographic hash in real time:
            </p>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs break-all text-brand-400 select-all leading-relaxed shadow-inner">
              {liveFingerprint || 'Calculating hash...'}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Entropy: 256 bits</span>
              <span>Algorithm: SHA-256</span>
              <span className="text-brand-400 font-semibold">One-Way Function</span>
            </div>
          </div>

          {/* Mining in progress display */}
          {isMining && (
            <div className="bg-orange-50 border-2 border-brand-300 rounded-3xl p-6 text-center space-y-3 block-mining">
              <Cpu className="w-10 h-10 text-brand-600 animate-bounce mx-auto" />
              <div className="text-base font-bold text-neutralDark-900">
                Writing Record to Public Ledger
              </div>
              <p className="text-xs font-mono text-brand-700 bg-white/80 py-1.5 px-3 rounded-lg border border-brand-200">
                {miningStep}
              </p>
              <div className="text-[11px] text-neutralDark-500">
                Gas cost: 0.000031 MATIC ($0.00002) • Zero latency proof
              </div>
            </div>
          )}

          {/* Success Card after issuance */}
          {issuedResult && !isMining && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 space-y-4 shadow-sm animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    Certificate Successfully Mined!
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Recorded in Block #{issuedResult.block.blockNumber} on Polygon.
                  </p>
                </div>
              </div>

              <div className="space-y-2 bg-white/90 p-4 rounded-xl border border-emerald-200 text-xs font-mono">
                <div className="flex justify-between items-center pb-1.5 border-b border-emerald-100">
                  <span className="text-neutralDark-500">Certificate ID:</span>
                  <span className="font-bold text-brand-600">{issuedResult.certificate.certificateId}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-emerald-100">
                  <span className="text-neutralDark-500">Block Height:</span>
                  <span className="font-semibold text-neutralDark-800">#{issuedResult.block.blockNumber}</span>
                </div>
                <div>
                  <span className="text-neutralDark-500 block mb-0.5">Tx Hash:</span>
                  <span className="text-[11px] text-neutralDark-700 break-all">{issuedResult.certificate.txHash}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => onViewCertificate(issuedResult.certificate)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <FileBadge2 className="w-4 h-4" />
                  <span>View & Download Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(issuedResult.certificate.certificateId)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition flex items-center space-x-1"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Guarantee Note */}
          <div className="bg-neutralDark-50 border border-neutralDark-200 rounded-3xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-neutralDark-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Why Student Privacy Is Protected</span>
            </div>
            <p className="text-xs text-neutralDark-600 leading-relaxed">
              Personal student information (home address, phone, private records) is <strong>never</strong> broadcast to the public blockchain. Only the cryptographic fingerprint string is stored. This makes the system compliant with student privacy rights while guaranteeing 100% mathematical authenticity.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
