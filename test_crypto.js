import { CryptoEngine } from './crypto.js';

async function testCrypto() {
  console.log("Testing StampTrust Cryptographic Suite...");

  // Test 1: SHA-256
  const hash1 = await CryptoEngine.sha256("Hello Blockchain");
  console.log("SHA-256('Hello Blockchain'):", hash1);
  if (hash1.length !== 64) throw new Error("Hash length must be 64 characters");

  // Test 2: Deterministic Canonical JSON
  const payload1 = {
    studentName: "Alex Rivera",
    studentEmail: "alex.rivera@ethglobal.dev",
    courseName: "ETHGlobal 2026",
    issuerName: "ETHGlobal Foundation",
    issueDate: "2026-03-15",
    gradeOrHonor: "1st Place",
    certificateId: "CERT-2026-001"
  };

  const payload2 = {
    // Different key insertion order, same values
    certificateId: "CERT-2026-001",
    issueDate: "2026-03-15",
    issuerName: "ETHGlobal Foundation",
    courseName: "ETHGlobal 2026",
    gradeOrHonor: "1st Place",
    studentEmail: "alex.rivera@ethglobal.dev",
    studentName: "Alex Rivera"
  };

  const fp1 = await CryptoEngine.computeFingerprint(payload1);
  const fp2 = await CryptoEngine.computeFingerprint(payload2);
  console.log("Fingerprint 1:", fp1);
  console.log("Fingerprint 2:", fp2);
  if (fp1 !== fp2) throw new Error("Canonicalization failed: Hash must be order-invariant");

  // Test 3: Avalanche Effect (altering 1 character)
  const tamperedPayload = {
    ...payload1,
    studentName: "Alex Riverb" // 1 char changed ('a' -> 'b')
  };
  const fpTampered = await CryptoEngine.computeFingerprint(tamperedPayload);
  const diff = CryptoEngine.compareHashes(fp1, fpTampered);
  console.log(`Avalanche test: Changing 1 character altered ${diff.diffCount} of 64 hex characters (${diff.percentageChanged}%)`);
  if (diff.matches) throw new Error("Hash should not match for tampered document");
  if (diff.diffCount < 20) throw new Error("Avalanche effect should alter significant portion of bits");

  console.log("All Cryptographic Engine Tests PASSED successfully!");
}

testCrypto().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
