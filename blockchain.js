import { CryptoEngine } from './crypto.js';

const STORAGE_KEYS = {
  CERTIFICATES: 'stamptrust_certificates_v2',
  BLOCKS: 'stamptrust_blocks_v2',
};

// In-memory fallback if localStorage is unavailable (e.g. Node tests)
const memoryStore = {};
const storage = {
  getItem: (k) => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : memoryStore[k] || null),
  setItem: (k, v) => (typeof localStorage !== 'undefined' ? localStorage.setItem(k, v) : (memoryStore[k] = v)),
  removeItem: (k) => (typeof localStorage !== 'undefined' ? localStorage.removeItem(k) : delete memoryStore[k]),
};

const GENESIS_BLOCK = {
  blockNumber: 0,
  hash: '0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
  previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  timestamp: '2026-01-01T00:00:00.000Z',
  txCount: 1,
  validator: '0xPolygonValidatorNode#01',
  gasUsed: '21000',
  gasFeeMatic: '0.000018',
  note: 'Genesis Block - StampTrust Verifiable Credential Protocol'
};

export const SEED_CREDENTIALS = [
  {
    certificateId: 'CERT-2026-ETHG-8812',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@ethglobal.dev',
    courseName: 'ETHGlobal 2026 - Autonomous Web3 Systems Hackathon',
    issuerName: 'ETHGlobal Foundation & Polygon Labs',
    issuerAddress: '0x71C948d3A943F2913e201b17dF00224b172a8E41',
    issueDate: '2026-03-15',
    gradeOrHonor: '1st Place Winner - Grand Prize ($25,000)',
    skills: ['Smart Contracts', 'Solidity', 'Zero-Knowledge Proofs', 'Layer 2 Rollups'],
    description: 'Awarded for architecting a decentralized identity verification protocol during the 36-hour international hackathon with 1,200+ competing developers.',
    fingerprint: '3b890f5c87de64a2f8b5a03498cb0de89e4726bf6ecdf1488c005b8214227f29',
    txHash: '0x9d4b31278ca90124fe88b710041289cf00a7b649d2110287cfeb0310245a9812',
    blockNumber: 1,
    minedAt: '2026-03-15T18:42:10.000Z'
  },
  {
    certificateId: 'CERT-2026-MITX-4109',
    studentName: 'Sophia Chen',
    studentEmail: 'sophia.chen@alumni.mit.edu',
    courseName: 'Applied Cryptography & Distributed Ledgers Specialization',
    issuerName: 'MIT Cryptography & Security Laboratory',
    issuerAddress: '0x3f982847E7A685B6C0100778B2818987d2C19901',
    issueDate: '2026-01-20',
    gradeOrHonor: 'Grade: 98.4% (Highest Honors)',
    skills: ['SHA-256 Hashing', 'Merkle DAGs', 'Byzantine Fault Tolerance', 'Security Auditing'],
    description: 'Successfully completed rigorous advanced coursework spanning zero-knowledge cryptographic proofs, decentralized consensus, and formal verification.',
    fingerprint: 'e289bf674a0199d8b723556012487eaf43b1790409aef411cb34589d312984ef',
    txHash: '0x7b88210334ac3415ef45091a182944bfe1028c4600219803bd5109bca7821674',
    blockNumber: 2,
    minedAt: '2026-01-20T14:15:33.000Z'
  },
  {
    certificateId: 'CERT-2026-GCP-7731',
    studentName: "David K. O'Connor",
    studentEmail: 'david.oconnor@cloudfellows.io',
    courseName: 'Cloud Infrastructure & Cybersecurity Fellow',
    issuerName: 'Google Cloud Student Developer Network',
    issuerAddress: '0x89A44091a27cf8949824c1619a8614271b3FE827',
    issueDate: '2026-04-02',
    gradeOrHonor: 'Distinction - Fellowship Awardee',
    skills: ['Cloud Native Security', 'Zero Trust Architecture', 'OAuth2 & JWT', 'Microservices'],
    description: 'Recognized for distinguished execution in high-availability cloud architecture, automated disaster recovery, and cryptographic key management.',
    fingerprint: '94ef01827b55ca1209b67324819aa3021984fbca98102374eab89312bca00129',
    txHash: '0x41908b29cfa01844bfe192801456dce88720194bc028174092bdf61099238102',
    blockNumber: 3,
    minedAt: '2026-04-02T11:05:48.000Z'
  }
];

export class BlockchainLedger {
  static init() {
    if (!storage.getItem(STORAGE_KEYS.CERTIFICATES)) {
      storage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(SEED_CREDENTIALS));
    }

    if (!storage.getItem(STORAGE_KEYS.BLOCKS)) {
      const blocks = [GENESIS_BLOCK];
      SEED_CREDENTIALS.forEach((cert, idx) => {
        blocks.push({
          blockNumber: idx + 1,
          hash: `0x0000${cert.fingerprint.substring(0, 60)}`,
          previousHash: blocks[blocks.length - 1].hash,
          timestamp: cert.minedAt,
          txCount: 1,
          certificateId: cert.certificateId,
          recipient: cert.studentName,
          issuer: cert.issuerName,
          fingerprint: cert.fingerprint,
          txHash: cert.txHash,
          validator: `0xPolygonValidatorNode#0${(idx % 4) + 1}`,
          gasUsed: '42890',
          gasFeeMatic: '0.000034',
        });
      });
      storage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    }
  }

  static getCertificates() {
    this.init();
    try {
      return JSON.parse(storage.getItem(STORAGE_KEYS.CERTIFICATES)) || SEED_CREDENTIALS;
    } catch {
      return SEED_CREDENTIALS;
    }
  }

  static getBlocks() {
    this.init();
    try {
      return JSON.parse(storage.getItem(STORAGE_KEYS.BLOCKS)) || [GENESIS_BLOCK];
    } catch {
      return [GENESIS_BLOCK];
    }
  }

  static getCertificateById(id) {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    const certs = this.getCertificates();
    return certs.find(c => c.certificateId.toUpperCase() === cleanId) || null;
  }

  static getCertificateByFingerprint(hash) {
    if (!hash) return null;
    const cleanHash = hash.trim().toLowerCase();
    const certs = this.getCertificates();
    return certs.find(c => c.fingerprint.toLowerCase() === cleanHash) || null;
  }

  static async issueCertificate(data) {
    this.init();
    const certs = this.getCertificates();
    const blocks = this.getBlocks();

    const certificateId = data.certificateId || CryptoEngine.generateCertificateId();
    const fingerprint = await CryptoEngine.computeFingerprint({
      ...data,
      certificateId
    });

    const txHash = CryptoEngine.generateTxHash();
    const blockNumber = blocks.length;
    const minedAt = new Date().toISOString();
    const previousBlock = blocks[blocks.length - 1];

    const newCertificate = {
      certificateId,
      studentName: data.studentName.trim(),
      studentEmail: data.studentEmail.trim(),
      courseName: data.courseName.trim(),
      issuerName: data.issuerName.trim(),
      issuerAddress: data.issuerAddress || '0x' + Math.random().toString(16).substring(2, 42),
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      gradeOrHonor: data.gradeOrHonor ? data.gradeOrHonor.trim() : 'Verified Completion',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map(s => s.trim()) : ['Verified Credential']),
      description: data.description || 'Verified course completion and credential issuance recorded on the public ledger.',
      fingerprint,
      txHash,
      blockNumber,
      minedAt
    };

    const newBlock = {
      blockNumber,
      hash: `0x0000${fingerprint.substring(0, 60)}`,
      previousHash: previousBlock.hash,
      timestamp: minedAt,
      txCount: 1,
      certificateId,
      recipient: newCertificate.studentName,
      issuer: newCertificate.issuerName,
      fingerprint,
      txHash,
      validator: `0xPolygonValidatorNode#0${Math.floor(Math.random() * 8) + 1}`,
      gasUsed: (38000 + Math.floor(Math.random() * 5000)).toString(),
      gasFeeMatic: '0.000031',
    };

    const updatedCerts = [newCertificate, ...certs];
    const updatedBlocks = [...blocks, newBlock];
    storage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(updatedCerts));
    storage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(updatedBlocks));

    return {
      certificate: newCertificate,
      block: newBlock
    };
  }

  static async verifyQuery(query) {
    if (!query || !query.trim()) {
      return {
        status: 'EMPTY',
        message: 'Please enter a Certificate ID or SHA-256 Hash'
      };
    }

    const clean = query.trim();
    const certs = this.getCertificates();
    const blocks = this.getBlocks();

    // Check by ID
    let foundCert = certs.find(c => c.certificateId.toLowerCase() === clean.toLowerCase());
    
    // Check by fingerprint or TxHash
    if (!foundCert) {
      foundCert = certs.find(c => c.fingerprint.toLowerCase() === clean.toLowerCase() || c.txHash.toLowerCase() === clean.toLowerCase());
    }

    if (foundCert) {
      const block = blocks.find(b => b.blockNumber === foundCert.blockNumber) || blocks[1];
      return {
        status: 'VALID',
        certificate: foundCert,
        block,
        message: `100% Real, issued by ${foundCert.issuerName} on ${foundCert.issueDate}`
      };
    }

    return {
      status: 'NOT_FOUND',
      message: 'No matching credential found on the blockchain ledger. Document may be forged or unissued.'
    };
  }

  static async verifyRawPayload(payload) {
    const computedHash = await CryptoEngine.computeFingerprint(payload);
    const existingById = this.getCertificateById(payload.certificateId);

    if (existingById) {
      const comparison = CryptoEngine.compareHashes(existingById.fingerprint, computedHash);
      if (comparison.matches) {
        return {
          status: 'VALID',
          certificate: existingById,
          computedHash,
          originalHash: existingById.fingerprint,
          comparison,
          message: '100% Authentic! Digital fingerprint matches the immutable blockchain record perfectly.'
        };
      } else {
        return {
          status: 'TAMPERED',
          certificate: existingById,
          computedHash,
          originalHash: existingById.fingerprint,
          comparison,
          message: `CRITICAL ALERT: Document has been altered! Digital fingerprint does not match blockchain block #${existingById.blockNumber}.`
        };
      }
    }

    const existingByHash = this.getCertificateByFingerprint(computedHash);
    if (existingByHash) {
      return {
        status: 'VALID',
        certificate: existingByHash,
        computedHash,
        originalHash: existingByHash.fingerprint,
        message: '100% Authentic! Valid record found on-chain.'
      };
    }

    return {
      status: 'NOT_FOUND',
      computedHash,
      message: 'Fingerprint not registered on the blockchain.'
    };
  }

  static resetDefaults() {
    storage.removeItem(STORAGE_KEYS.CERTIFICATES);
    storage.removeItem(STORAGE_KEYS.BLOCKS);
    this.init();
  }
}
