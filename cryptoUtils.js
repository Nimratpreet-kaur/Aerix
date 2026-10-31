
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