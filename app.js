import { CryptoEngine } from './crypto.js';
import { BlockchainLedger, SEED_CREDENTIALS } from './blockchain.js';

// Global application state
const state = {
  activeTab: 'overview',
  activeCertificate: null,
  verifyResultCert: null,
};

export const App = {
  init() {
    BlockchainLedger.init();
    const certs = BlockchainLedger.getCertificates();
    state.activeCertificate = certs[0];

    // Set today's date in issue form
    const issueDateInput = document.getElementById('issue-issueDate');
    if (issueDateInput) {
      issueDateInput.value = new Date().toISOString().split('T')[0];
    }

    // Check URL hash for direct verification links
    this.checkUrlHash();

    // Re-run Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.checkUrlHash());
  },

  checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#verify')) {
      const params = new URLSearchParams(hash.replace('#verify', ''));
      const id = params.get('id');
      if (id) {
        this.switchTab('verify');
        const input = document.getElementById('verify-search-input');
        if (input) input.value = id;
        this.verifySpecificId(id);
      }
    }
  },

  switchTab(tabId) {
    state.activeTab = tabId;

    // Update Panes (Overview, Issue, Verify)
    document.querySelectorAll('.tab-pane').forEach(el => {
      el.classList.add('hidden');
    });
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
      targetPane.classList.remove('hidden');
    }

    // Update Desktop Nav Buttons
    document.querySelectorAll('#nav-tabs-desktop .nav-btn').forEach(btn => {
      const btnTab = btn.getAttribute('data-nav-tab');
      if (btnTab === tabId) {
        btn.className = 'nav-btn flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition bg-neutralDark-900 text-white shadow-xs';
      } else {
        btn.className = 'nav-btn flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-neutralDark-600 hover:text-neutralDark-900 hover:bg-neutralDark-100';
      }
    });

    // Update Mobile Nav Buttons
    document.querySelectorAll('.nav-btn-mob').forEach(btn => {
      const btnTab = btn.getAttribute('data-nav-mob');
      if (btnTab === tabId) {
        btn.className = 'nav-btn-mob flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition bg-neutralDark-900 text-white';
      } else {
        btn.className = 'nav-btn-mob flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition text-neutralDark-600 hover:bg-neutralDark-100';
      }
    });

    // Re-initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* =========================================================================
     ISSUE CREDENTIAL (FOR SCHOOLS & ORGANIZERS)
     ========================================================================= */
  applyIssuePreset(presetKey) {
    const presets = {
      stanford: {
        name: 'Maya Lin Patel',
        email: 'maya.patel@stanford.edu',
        issuer: 'Stanford Center for Blockchain Research',
        course: 'Advanced Smart Contract Engineering & Security Fellowship',
        honor: 'Highest Distinction (Top 1%)',
        skills: 'Solidity, Security Auditing, Smart Contracts',
        desc: 'Awarded for extraordinary mastery in decentralized consensus algorithms, cryptographic primitive implementation, and formal protocol auditing.'
      },
      hackathon: {
        name: 'Jordan Vance & Team Cipher',
        email: 'team.cipher@solanahack.org',
        issuer: 'Global Web3 Builders Olympiad 2026',
        course: 'Decentralized AI Agents & Oracle Systems Hackathon',
        honor: 'Grand Champion ($50,000 Award)',
        skills: 'Rust, Solana, Oracles, Autonomous Agents',
        desc: '1st place out of 840 international submissions for developing a low-latency verifiable oracle protocol.'
      },
      cybersecurity: {
        name: 'Ethan Brooks',
        email: 'ethan.brooks@mit.alumni.edu',
        issuer: 'MIT Cybersecurity Defense Initiative',
        course: 'Certified Zero-Trust Cryptographic Architect',
        honor: 'Grade: 99.1% (Exemplary)',
        skills: 'Cryptography, HSMs, Zero Trust Security',
        desc: 'Complete certification covering quantum-resistant key exchange, distributed verifiable credentials, and enterprise threat modeling.'
      }
    };

    const p = presets[presetKey];
    if (!p) return;

    document.getElementById('issue-studentName').value = p.name;
    document.getElementById('issue-studentEmail').value = p.email;
    document.getElementById('issue-issuerName').value = p.issuer;
    document.getElementById('issue-courseName').value = p.course;
    document.getElementById('issue-gradeOrHonor').value = p.honor;
    document.getElementById('issue-skills').value = p.skills;
    document.getElementById('issue-description').value = p.desc;

    this.showToast(`Applied preset: ${p.course.substring(0, 30)}...`, 'success');
  },

  async handleIssueSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('issue-submit-btn');
    const miningBox = document.getElementById('mining-status-box');
    const miningText = document.getElementById('mining-status-text');
    const successBox = document.getElementById('issue-success-box');

    const data = {
      studentName: document.getElementById('issue-studentName').value,
      studentEmail: document.getElementById('issue-studentEmail').value,
      issuerName: document.getElementById('issue-issuerName').value,
      courseName: document.getElementById('issue-courseName').value,
      issueDate: document.getElementById('issue-issueDate').value,
      gradeOrHonor: document.getElementById('issue-gradeOrHonor').value,
      skills: document.getElementById('issue-skills').value,
      description: document.getElementById('issue-description').value,
    };

    // UI state: Issuing in progress
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    miningBox.classList.remove('hidden');
    successBox.classList.add('hidden');

    miningText.innerText = 'Applying digital stamp of authenticity...';
    await new Promise(r => setTimeout(r, 600));

    miningText.innerText = 'Creating permanent public authenticity record...';
    await new Promise(r => setTimeout(r, 600));

    const result = await BlockchainLedger.issueCertificate(data);

    // Hide progress, show success
    miningBox.classList.add('hidden');
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');

    document.getElementById('success-cert-id').innerText = result.certificate.certificateId;

    const viewBtn = document.getElementById('success-view-cert-btn');
    viewBtn.onclick = () => {
      state.activeCertificate = result.certificate;
      this.switchTab('verify');
      document.getElementById('verify-search-input').value = result.certificate.certificateId;
      this.renderVerifyResult({
        status: 'VALID',
        certificate: result.certificate,
        message: `100% Real, issued by ${result.certificate.issuerName} on ${result.certificate.issueDate}`
      });
    };

    successBox.classList.remove('hidden');

    // Confetti celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F97316', '#EA580C', '#10B981', '#3B82F6']
      });
    }

    this.showToast(`Certificate ${result.certificate.certificateId} issued!`, 'success');
  },

  /* =========================================================================
     VERIFY CREDENTIAL (FOR EMPLOYERS & STUDENTS)
     ========================================================================= */
  async handleVerifySubmit(event) {
    if (event) event.preventDefault();
    const query = document.getElementById('verify-search-input')?.value;
    if (query) {
      await this.verifySpecificId(query);
    }
  },

  async verifySpecificId(query) {
    const clean = query.trim();
    if (!clean) return;

    this.switchTab('verify');
    const input = document.getElementById('verify-search-input');
    if (input) input.value = clean;

    const btn = document.getElementById('verify-btn');
    const originalBtn = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span><span>Verifying...</span>`;

    await new Promise(r => setTimeout(r, 400));

    const result = await BlockchainLedger.verifyQuery(clean);

    btn.disabled = false;
    btn.innerHTML = originalBtn;

    this.renderVerifyResult(result);
  },

  renderVerifyResult(result) {
    const validCard = document.getElementById('verify-valid-card');
    const invalidCard = document.getElementById('verify-invalid-card');

    if (result.status === 'VALID') {
      validCard.classList.remove('hidden');
      invalidCard.classList.add('hidden');

      state.verifyResultCert = result.certificate;
      state.activeCertificate = result.certificate;

      document.getElementById('valid-summary-text').innerText = `Issued by ${result.certificate.issuerName} on ${result.certificate.issueDate}`;
      
      // Update the certificate presentation view
      document.getElementById('cert-display-name').innerText = result.certificate.studentName;
      document.getElementById('cert-display-course').innerText = result.certificate.courseName;
      document.getElementById('cert-display-honor').innerText = result.certificate.gradeOrHonor || 'Verified Credential';
      document.getElementById('cert-display-desc').innerText = `"${result.certificate.description || 'Verified course completion and credential issuance.'}"`;
      document.getElementById('cert-display-issuer').innerText = result.certificate.issuerName;
      document.getElementById('cert-display-sign').innerText = `${result.certificate.issuerName.split(' ')[0]} Chancellor`;
      document.getElementById('cert-display-date').innerText = `Issued: ${result.certificate.issueDate}`;
      document.getElementById('cert-display-id').innerText = result.certificate.certificateId;

      // Render Dynamic QR Code
      const verifyUrl = `${window.location.origin}${window.location.pathname}#verify?id=${result.certificate.certificateId}`;
      const qrCanvas = document.getElementById('cert-qr-canvas');
      if (qrCanvas && window.QRCode) {
        window.QRCode.toCanvas(qrCanvas, verifyUrl, {
          width: 75,
          margin: 1,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF'
          }
        }, err => {
          if (err) console.error('QR Canvas error', err);
        });
      }

      this.showToast('100% Real! Digital certificate confirmed authentic.', 'success');
      validCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      validCard.classList.add('hidden');
      invalidCard.classList.remove('hidden');

      document.getElementById('invalid-title').innerText = result.status === 'TAMPERED' 
        ? 'Document Altered or Forged!' 
        : 'Unregistered Credential — Not Found';
      document.getElementById('invalid-message').innerText = result.status === 'TAMPERED'
        ? 'The details on this document do not match the official record issued by the institution. It may have been edited in Photoshop.'
        : 'No matching certificate found in the official public record book. This credential may be counterfeit or unissued.';

      this.showToast('Warning: Credential verification failed!', 'error');
      invalidCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (window.lucide) window.lucide.createIcons();
  },

  async downloadCertificatePDF() {
    const certElement = document.getElementById('printable-certificate');
    if (!certElement || !window.html2canvas || !window.jspdf) return;

    this.showToast('Generating official certificate PDF...', 'info');

    try {
      const canvas = await window.html2canvas(certElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = `${state.activeCertificate.certificateId}_${state.activeCertificate.studentName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);
      this.showToast(`Downloaded ${filename}`, 'success');
    } catch (err) {
      console.error('PDF error', err);
      this.showToast('Failed to generate PDF', 'error');
    }
  },

  copyCurrentVerificationLink() {
    if (!state.activeCertificate) return;
    const link = `${window.location.origin}${window.location.pathname}#verify?id=${state.activeCertificate.certificateId}`;
    navigator.clipboard.writeText(link);
    this.showToast('Verification link copied to clipboard!', 'info');
  },

  /* =========================================================================
     TOAST NOTIFICATIONS
     ========================================================================= */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-600 text-white shadow-lg',
      error: 'bg-rose-600 text-white shadow-lg',
      info: 'bg-neutralDark-900 text-white shadow-lg',
    };

    toast.className = `toast px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
};

// Expose App to global window for inline onclick handlers
window.App = App;

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
