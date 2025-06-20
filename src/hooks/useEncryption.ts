import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'SUPER_EIS_SECRET_KEY';

const useEncryption = () => {
  const encrypt = useCallback((data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  }, []);

  const decrypt = useCallback((cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }, []);

  return { encrypt, decrypt };
};

export default useEncryption;