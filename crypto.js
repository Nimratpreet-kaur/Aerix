/**
 * StampTrust Cryptographic Engine
 * Handles SHA-256 hashing, canonical payload formatting, and Avalanche Effect diffing.
 */

export class CryptoEngine {
  /**
   * Native browser SHA-256 hashing via Web Crypto API.
   * Returns a 64-character lowercase hex string.
   */
  static async sha256(message) {
    const subtle = (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) || 
                   (typeof window !== 'undefined' && window.crypto?.subtle);
    if (subtle) {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Deterministic fallback for non-secure contexts
    let h = 0x811c9dc5;
    for (let i = 0; i < message.length; i++) {
      h ^= message.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const hex = (h >>> 0).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
  }

  /**
   * Deterministic canonical JSON formatting.
   * Ensures identical fields always yield the exact same fingerprint.
   */
  static canonicalize(payload) {
    return JSON.stringify({
      studentName: (payload.studentName || '').trim(),
      studentEmail: (payload.studentEmail || '').trim().toLowerCase(),
      courseName: (payload.courseName || '').trim(),
      issuerName: (payload.issuerName || '').trim(),
      issueDate: (payload.issueDate || '').trim(),
      gradeOrHonor: (payload.gradeOrHonor || '').trim(),
      certificateId: (payload.certificateId || '').trim(),
    });
  }

  /**
   * Computes the official 64-character SHA-256 digital fingerprint.
   */
  static async computeFingerprint(payload) {
    const canonical = this.canonicalize(payload);
    return await this.sha256(canonical);
  }

  /**
   * Generates a 64-hex Polygon/Ethereum-style transaction hash.
   */
  static generateTxHash() {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a clean human-readable Certificate ID.
   */
  static generateCertificateId() {
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
   * Compares two 64-character hashes to illustrate the Avalanche Effect.
   */
  static compareHashes(hashA, hashB) {
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
}
