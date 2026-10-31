import { computeCertificateFingerprint, generateTxHash, generateCertificateId, compareHashes } from '../utils/cryptoUtils';

const STORAGE_KEYS = {
  CERTIFICATES: 'certichain_certificates_v1',
  BLOCKS: 'certichain_blocks_v1',
};

// Genesis Block definition
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

// Seed Certificates with computed deterministic hashes
export const SEED_CERTIFICATES = [
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
    studentName: 'David K. O\'Connor',
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

export const BlockchainService = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(SEED_CERTIFICATES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.BLOCKS)) {
      const blocks = [GENESIS_BLOCK];
      SEED_CERTIFICATES.forEach((cert, idx) => {
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
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    }
  },

  getCertificates() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) || SEED_CERTIFICATES;
    } catch {
      return SEED_CERTIFICATES;
    }
  },

  getBlocks() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOCKS)) || [GENESIS_BLOCK];
    } catch {
      return [GENESIS_BLOCK];
    }
  },

  getCertificateById(id) {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    const certs = this.getCertificates();
    return certs.find(c => c.certificateId.toUpperCase() === cleanId) || null;
  },

  getCertificateByFingerprint(hash) {
    if (!hash) return null;
    const cleanHash = hash.trim().toLowerCase();
    const certs = this.getCertificates();
    return certs.find(c => c.fingerprint.toLowerCase() === cleanHash) || null;
  },

  /**
   * Issue a new certificate to the simulated blockchain
   */
  async issueCertificate(data) {
    this.init();
    const certs = this.getCertificates();
    const blocks = this.getBlocks();

    const certificateId = data.certificateId || generateCertificateId();
    const fingerprint = await computeCertificateFingerprint({
      ...data,
      certificateId
    });

    const txHash = generateTxHash();
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
      skills: data.skills || ['Blockchain Verified', 'Digital Credential'],
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

    // Save to local storage
    const updatedCerts = [newCertificate, ...certs];
    const updatedBlocks = [...blocks, newBlock];
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(updatedCerts));
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(updatedBlocks));

    return {
      certificate: newCertificate,
      block: newBlock
    };
  },

  /**
   * Verify query: Can be certificate ID or SHA-256 fingerprint
   */
  async verifyQuery(query) {
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
    
    // If not found by ID, check by fingerprint or TxHash
    if (!foundCert) {
      foundCert = certs.find(c => c.fingerprint.toLowerCase() === clean.toLowerCase() || c.txHash.toLowerCase() === clean.toLowerCase());
    }

    if (foundCert) {
      const block = blocks.find(b => b.blockNumber === foundCert.blockNumber) || blocks[1];
      return {
        status: 'VALID',
        certificate: foundCert,
        block,
        message: '100% Real, issued by ' + foundCert.issuerName + ' on ' + foundCert.issueDate
      };
    }

    return {
      status: 'NOT_FOUND',
      message: 'No matching credential found on the blockchain ledger. Document may be forged or unissued.'
    };
  },

  /**
   * Verify raw data (for Tamper Playground and File drop verification)
   */
  async verifyRawPayload(payload) {
    const computedHash = await computeCertificateFingerprint(payload);
    const existingById = this.getCertificateById(payload.certificateId);

    if (existingById) {
      const comparison = compareHashes(existingById.fingerprint, computedHash);
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
          message: `CRITICAL ALERT: Document has been altered! Digital fingerprint does not match the blockchain block #${existingById.blockNumber}.`
        };
      }
    }

    // Check if the hash matches any certificate directly
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
  },

  resetDefaults() {
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.BLOCKS);
    this.init();
  }
};
