import CryptoJS from 'crypto-js';

const S_KEY = String(import.meta.env.VITE_STORAGE_KEY);

/**
 * Encrypts data using AES encryption.
 * @param {T} value - The data to be encrypted.
 * @returns {string} - The encrypted data.
 */
const encrypt = <T>(value: T): string | null => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(value), S_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypts data using AES decryption.
 * @param {string} value - The encrypted data to be decrypted.
 * @returns {T} - The decrypted data.
 */
const decrypt = <T>(value: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, S_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
export const useCrypto = {
  encrypt,
  decrypt,
};
