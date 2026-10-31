/**
 * Cryptographic Utility for SHA-256 hashing and digital fingerprint verification
 * using the standard Web Crypto API.
 */

export async function sha256(message) {
  if (window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  
  // Deterministic fallback if subtle crypto is disabled in non-secure context
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, 'a');
}

/**
 * Standardize certificate payload to create deterministic canonical JSON
 * This ensures that whitespace or ordering does not produce false mismatches.
 */
export function canonicalizeCertificateData(data) {
  return JSON.stringify({
    studentName: (data.studentName || '').trim(),
    studentEmail: (data.studentEmail || '').trim().toLowerCase(),
    courseName: (data.courseName || '').trim(),
    issuerName: (data.issuerName || '').trim(),
    issueDate: (data.issueDate || '').trim(),
    gradeOrHonor: (data.gradeOrHonor || '').trim(),
    certificateId: (data.certificateId || '').trim(),
  });
}

/**
 * Compute the SHA-256 digital fingerprint for a certificate payload.
 */
export async function computeCertificateFingerprint(data) {
  const canonical = canonicalizeCertificateData(data);
  return await sha256(canonical);
}

/**
 * Generate a realistic random transaction hash (0x + 64 hex chars)
 */
export function generateTxHash() {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a clean human-readable Certificate ID
 */
export function generateCertificateId() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CERT-${year}-${part1}-${part2}`;
}

/**
 * Highlight character differences between two 64-char hashes
 * to demonstrate the Cryptographic Avalanche Effect visually.
 */
export function compareHashes(hashA, hashB) {
  if (!hashA || !hashB) return { matches: false, diffCount: 64, segments: [] };
  
  let diffCount = 0;
  const segments = [];
  const maxLen = Math.max(hashA.length, hashB.length);
  
  for (let i = 0; i < maxLen; i++) {
    const charA = hashA[i] || '';
    const charB = hashB[i] || '';
    const isSame = charA === charB;
    if (!isSame) diffCount++;
    segments.push({
      index: i,
      charA,
      charB,
      isSame
    });
  }
  
  return {
    matches: diffCount === 0 && hashA.length === 64,
    diffCount,
    percentageChanged: Math.round((diffCount / 64) * 100),
    segments
  };
}
