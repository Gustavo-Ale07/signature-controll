import { encryptSecret, decryptSecret, generateEncryptionKey } from '../crypto';

describe('Crypto Utils', () => {
  // Set test encryption key
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = generateEncryptionKey();
  });

  describe('encryptSecret', () => {
    it('should encrypt a plaintext string', () => {
      const plaintext = 'mySecretPassword123!';
      const encrypted = encryptSecret(plaintext);
      
      expect(encrypted).toHaveProperty('ciphertext');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('authTag');
      expect(encrypted.ciphertext).toBeTruthy();
      expect(encrypted.iv).toBeTruthy();
      expect(encrypted.authTag).toBeTruthy();
    });

    it('should produce different ciphertext for same input', () => {
      const plaintext = 'mySecretPassword123!';
      const encrypted1 = encryptSecret(plaintext);
      const encrypted2 = encryptSecret(plaintext);
      
      // Different IVs mean different ciphertext
      expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });
  });

  describe('decryptSecret', () => {
    it('should decrypt encrypted data back to original plaintext', () => {
      const plaintext = 'mySecretPassword123!';
      const encrypted = encryptSecret(plaintext);
      const decrypted = decryptSecret(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should handle special characters', () => {
      const plaintext = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:",.<>?/~`';
      const encrypted = encryptSecret(plaintext);
      const decrypted = decryptSecret(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode characters', () => {
      const plaintext = 'Senha123!çãõáéíóú';
      const encrypted = encryptSecret(plaintext);
      const decrypted = decryptSecret(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('generateEncryptionKey', () => {
    it('should generate a valid base64 key', () => {
      const key = generateEncryptionKey();
      const buffer = Buffer.from(key, 'base64');
      
      expect(buffer.length).toBe(32); // 256 bits
    });
  });
});
