import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  EyeOff, 
  FileCheck2, 
  ArrowRight, 
  Fingerprint, 
  Cpu, 
  Sparkles, 
  AlertTriangle,
  Building2,
  GraduationCap,
  SearchCode
} from 'lucide-react';

export default function HeroExplainer({ setActiveTab, onSelectPresetVerification }) {
  const workflowSteps = [
    {
      num: '01',
      title: 'School Issues Certificate',
      subtitle: 'Organizer / University',
      icon: Building2,
      badge: 'Step 1',
      desc: 'The school fills student details (Name, Course, Date). The system turns it into a unique SHA-256 digital fingerprint and writes it permanently to the blockchain ledger.',
      actionLabel: 'Try Issuing',
      tab: 'issue'
    },
    {
      num: '02',
      title: 'Student Receives Proof',
      subtitle: 'Graduate / Winner',
      icon: GraduationCap,
      badge: 'Step 2',
      desc: 'The student receives an authentic certificate with a cryptographic QR code, verifiable link, and download options for their LinkedIn and resume.',
      actionLabel: 'View Sample Proofs',
      tab: 'student'
    },
    {
      num: '03',
      title: 'Instant Public Verification',
      subtitle: 'Employer / Reviewer',
      icon: SearchCode,
      badge: 'Step 3',
      desc: 'Anyone enters the Certificate ID or uploads the document. The app checks the fingerprint against the blockchain. Result: Instant 100% Real checkmark or Red Alert if altered.',
      actionLabel: 'Verify Now',
      tab: 'verify'
    }
  ];

  const smartPillars = [
    {
      title: 'Impossible to Fake',
      icon: Lock,
      color: 'from-orange-500 to-amber-500',
      desc: 'Once anchored on the blockchain ledger, no one—not even the issuer, server admin, or an attacker—can alter or delete the record. Math enforces the truth.'
    },
    {
      title: 'Privacy-First Architecture',
      icon: EyeOff,
      color: 'from-slate-700 to-slate-900',
      desc: 'Personal details (address, private records) never sit exposed on the public chain. Only the one-way cryptographic SHA-256 fingerprint is recorded.'
    },
    {
      title: 'Fractions of a Cent & Instant',
      icon: Zap,
      color: 'from-brand-500 to-orange-600',
      desc: 'Operating on low-cost Layer-2 blockchain networks like Polygon costs ~$0.0004 per credential. Verification takes under 1 second without manual phone calls.'
    },
    {
      title: 'Photoshop & AI Tamper Immunity',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-700',
      desc: 'Changing even 1 single character (like changing Grade B to A+) causes an Avalanche Effect that completely invalidates the fingerprint.'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-white via-orange-50/30 to-canvas-light rounded-3xl border border-brand-100 shadow-soft">
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-orange-100/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Decentralized Truth Protocol
            </span>
            <span className="text-neutralDark-300">•</span>
            <span className="text-xs font-medium text-neutralDark-600">Zero-Tamper Blockchain Proof</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutralDark-900 tracking-tight leading-[1.15]">
            A Digital Stamp of Authenticity That <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 bg-clip-text text-transparent">
              Cannot Be Forged or Altered
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutralDark-600 leading-relaxed">
            Anyone can edit a PDF in Photoshop to fake a prize or degree. 
            <strong className="text-neutralDark-900 font-semibold"> StampTrust </strong> 
            solves this by converting certificate credentials into immutable cryptographic fingerprints permanently anchored to the blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('verify')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-neutralDark-900 hover:bg-neutralDark-800 text-white font-semibold text-sm shadow-md transition transform active:scale-95"
            >
              <SearchCode className="w-4 h-4 text-brand-400" />
              <span>Verify a Certificate</span>
            </button>

            <button
              onClick={() => setActiveTab('issue')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-sm shadow-warm transition transform active:scale-95"
            >
              <span>Issue New Credential</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('tamper')}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-sm transition"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Tamper Fraud Sandbox</span>
            </button>
          </div>

          {/* Quick Stats banner */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-brand-100 max-w-4xl mx-auto">
            <div className="bg-white/80 p-3 rounded-xl border border-neutralDark-200/60 shadow-xs">
              <div className="text-2xl font-black text-neutralDark-900">0.00s</div>
              <div className="text-xs text-neutralDark-500 font-medium">Verification Delay</div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-neutralDark-200/60 shadow-xs">
              <div className="text-2xl font-black text-brand-600">&lt; $0.001</div>
              <div className="text-xs text-neutralDark-500 font-medium">Cost per Certificate</div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-neutralDark-200/60 shadow-xs">
              <div className="text-2xl font-black text-neutralDark-900">256-Bit</div>
              <div className="text-xs text-neutralDark-500 font-medium">SHA Cryptography</div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-neutralDark-200/60 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">0%</div>
              <div className="text-xs text-neutralDark-500 font-medium">Possibility of Forgery</div>
            </div>
          </div>

        </div>
      </section>

      {/* Step-by-Step Interactive Workflow */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600">
            End-To-End Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutralDark-900">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-neutralDark-500 max-w-lg mx-auto">
            From the university lecture hall to the employer interview, transparency is guaranteed at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-6 border border-neutralDark-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-neutralDark-200 group-hover:text-brand-300 transition">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-600 group-hover:scale-105 transition">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-neutralDark-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-brand-600 font-medium">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-neutralDark-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-neutralDark-100">
                  <button
                    onClick={() => setActiveTab(step.tab)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-neutralDark-50 hover:bg-brand-500 hover:text-white text-neutralDark-800 transition"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why This Idea Is So Smart (4 Pillars) */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
            Fundamental Advantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Blockchain Verification is Smarter Than Paper or PDFs
          </h2>
          <p className="text-sm text-slate-400">
            Eliminating human bureaucracy, fake diplomas, and expensive background verification agencies with mathematical proof.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {smartPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 hover:border-brand-500/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Test Drive Banner */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Fingerprint className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-white">Ready to test sample certificates?</div>
              <div className="text-xs text-slate-400">Pre-seeded with real cryptographic proofs from MIT & ETHGlobal.</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectPresetVerification('CERT-2026-ETHG-8812')}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition shadow-warm"
            >
              Verify ETHGlobal Prize #8812
            </button>
            <button
              onClick={() => onSelectPresetVerification('CERT-2026-MITX-4109')}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
            >
              Verify MIT Diploma #4109
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
