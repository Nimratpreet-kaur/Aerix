import React from 'react';
import { ShieldCheck, Award, Search, Database, AlertTriangle, Layers, RotateCcw, ExternalLink } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onResetLedger, certCount }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck },
    { id: 'issue', label: 'Issue (School)', icon: Award },
    { id: 'verify', label: 'Verify (Employer)', icon: Search },
    { id: 'student', label: 'My Proofs', icon: Award, badge: certCount },
    { id: 'tamper', label: 'Tamper Sandbox', icon: AlertTriangle, highlight: true },
    { id: 'ledger', label: 'Ledger Explorer', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutralDark-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Network Status */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-warm">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-neutralDark-900 font-sans">
                  Stamp<span className="text-brand-500">Trust</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold border border-brand-200">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-neutralDark-500 hidden sm:block">
                Decentralized Credential & Verifier
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-neutralDark-900 text-white shadow-sm'
                      : item.highlight
                      ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                      : 'text-neutralDark-600 hover:text-neutralDark-900 hover:bg-neutralDark-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : item.highlight ? 'text-amber-600' : 'text-neutralDark-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-brand-500 text-white' : 'bg-neutralDark-200 text-neutralDark-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-1 rounded bg-amber-100 text-amber-800">
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Network Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-800">Polygon Testnet</span>
              <span className="text-slate-400">|</span>
              <span className="text-brand-600 font-bold">$0.0004 gas</span>
            </div>

            {/* Quick Action */}
            <button
              onClick={() => setActiveTab('issue')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-warm transition-transform active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Issue Credential</span>
            </button>

            {/* Reset ledger option */}
            <button
              onClick={onResetLedger}
              title="Reset Demo Data to Initial Seeds"
              className="p-2 text-neutralDark-400 hover:text-neutralDark-700 hover:bg-neutralDark-100 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto space-x-1 py-2 border-t border-neutralDark-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-neutralDark-900 text-white'
                    : 'text-neutralDark-600 hover:bg-neutralDark-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
