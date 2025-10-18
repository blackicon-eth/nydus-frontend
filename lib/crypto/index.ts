/**
 * Nydus Crypto Library
 *
 * This library provides cryptographic utilities for the Nydus network,
 * including Diffie-Hellman key exchange and Poseidon CTR encryption.
 */

// Re-export all DH utilities
export * from "./dh-utils";

// Re-export all Poseidon CTR encryption utilities
export * from "./poseidon-ctr-encryption";

// Convenience exports for common functions
export {
  generatePublicKey,
  performDHKeyExchange,
  testDHKeyExchange,
  type Point,
  type KeyPair,
  type DHResult,
} from "./dh-utils";

export {
  poseidonKeystream,
  poseidonCtrEncrypt,
  poseidonCtrDecrypt,
  poseidonEncryptAllFields,
  poseidonEncryptAllFieldsArray,
  testPoseidonCtrEncryption,
} from "./poseidon-ctr-encryption";
