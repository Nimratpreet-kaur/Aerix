import { BlockchainLedger } from './blockchain.js';
import { CryptoEngine } from './crypto.js';

async function runEndToEndLedgerTest() {
  console.log("Starting End-to-End Blockchain Ledger & Tamper Verification Test...");

  // 1. Initial State
  BlockchainLedger.init();
  const initialCerts = BlockchainLedger.getCertificates();
  const initialBlocks = BlockchainLedger.getBlocks();
  console.log(`Initial state loaded: ${initialCerts.length} certificates, ${initialBlocks.length} blocks.`);
  if (initialCerts.length < 3) throw new Error("Expected at least 3 initial seeded certificates");
  if (initialBlocks.length < 4) throw new Error("Expected at least 4 blocks (Genesis + 3 credentials)");

  // 2. Test Verification of Authentic Credential
  const validCheck = await BlockchainLedger.verifyQuery("CERT-2026-ETHG-8812");
  console.log("Verify 'CERT-2026-ETHG-8812':", validCheck.status, "-", validCheck.message);
  if (validCheck.status !== 'VALID') throw new Error("Seeded ETHGlobal certificate should be VALID");

  // 3. Test Verification of Forged/Unregistered Credential
  const forgedCheck = await BlockchainLedger.verifyQuery("CERT-FAKE-9999");
  console.log("Verify 'CERT-FAKE-9999':", forgedCheck.status, "-", forgedCheck.message);
  if (forgedCheck.status !== 'NOT_FOUND') throw new Error("Fake ID should return NOT_FOUND");

  // 4. Issue a New Certificate
  console.log("Issuing new credential for Elena Rostova...");
  const issueResult = await BlockchainLedger.issueCertificate({
    studentName: "Elena Rostova",
    studentEmail: "elena.rostova@stanford.edu",
    issuerName: "Stanford Institute for Cryptoeconomics",
    courseName: "Doctor of Philosophy in Distributed Ledger Security",
    issueDate: "2026-04-10",
    gradeOrHonor: "Summa Cum Laude",
    skills: ["Zero-Knowledge Proofs", "Consensus Algorithms", "Security Auditing"],
    description: "Conferred for groundbreaking research in verifiable polynomial commitments."
  });

  console.log(`New Certificate Issued: ID=${issueResult.certificate.certificateId}, Block=#${issueResult.block.blockNumber}`);
  if (issueResult.block.blockNumber !== 4) throw new Error("New block should be height 4");
  if (!issueResult.block.previousHash.startsWith("0x")) throw new Error("Block previousHash must link to prior block");

  // Verify the newly issued certificate
  const newCertVerify = await BlockchainLedger.verifyQuery(issueResult.certificate.certificateId);
  console.log("Verify newly issued cert:", newCertVerify.status, "-", newCertVerify.message);
  if (newCertVerify.status !== 'VALID') throw new Error("Newly issued certificate must verify as VALID");

  // 5. Tamper Playground Test: Altering 1 letter in Elena's name
  console.log("Simulating Photoshop Forgery: Changing 'Elena Rostova' to 'Elena Rostovx'...");
  const tamperedPayload = {
    ...issueResult.certificate,
    studentName: "Elena Rostovx"
  };

  const tamperResult = await BlockchainLedger.verifyRawPayload(tamperedPayload);
  console.log("Tamper detection status:", tamperResult.status, "-", tamperResult.message);
  if (tamperResult.status !== 'TAMPERED') throw new Error("Tampered document MUST return TAMPERED status");
  if (!tamperResult.comparison || tamperResult.comparison.matches) throw new Error("Comparison must detect hash mismatch");
  console.log(`Tamper detected! Altered ${tamperResult.comparison.diffCount} of 64 characters (${tamperResult.comparison.percentageChanged}%).`);

  console.log("ALL END-TO-END LEDGER AND TAMPER TESTS PASSED WITH 100% ACCURACY!");
}

runEndToEndLedgerTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
