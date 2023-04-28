import { createContext } from "react";
import CryptoJs from "crypto-js";

class User {
  constructor() {
    this.secret = null;
    this.password = null;
  }

  isAuthenticated() {
    return this.secret !== null && this.password !== null;
  }

  setSecret(secret, password) {
    this.password = password;
    const encryptedSecret = CryptoJs.AES.encrypt(
      secret,
      process.env.REACT_APP_ENCRYPTION_KEY
    ).toString();
    const encryptedPassword = CryptoJs.AES.encrypt(
      password,
      process.env.REACT_APP_ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(process.env.REACT_APP_LOCAL_SECRET, encryptedSecret);
    localStorage.setItem(
      process.env.REACT_APP_ENCRYPTED_PASSWORD,
      encryptedPassword
    );
  }

  verifyLogin(secret, password) {
    const savedSecret = localStorage.getItem(
      process.env.REACT_APP_LOCAL_SECRET
    );
    const savedPassword = localStorage.getItem(
      process.env.REACT_APP_ENCRYPTED_PASSWORD
    );

    const decryptedPasswordBytes = CryptoJs.AES.decrypt(
      savedPassword,
      process.env.REACT_APP_ENCRYPTION_KEY
    );
    const decryptedSecretBytes = CryptoJs.AES.decrypt(
      savedSecret,
      process.env.REACT_APP_ENCRYPTION_KEY
    );

    const decryptedPassword = decryptedPasswordBytes.toString(
      CryptoJs.enc.Utf8
    );

    const decryptedSecret = decryptedSecretBytes.toString(CryptoJs.enc.Utf8);

    if (secret === decryptedSecret && password === decryptedPassword) {
      this.secret = decryptedSecret;
      this.password = decryptedPassword;
      return true;
    }

    return false;
  }

  resetSecret(secret) {
    this.secret = secret;
    const encryptedSecret = CryptoJs.AES.encrypt(
      secret,
      process.env.REACT_APP_ENCRYPTION_KEY
    ).toString();
    localStorage.removeItem(process.env.REACT_APP_LOCAL_SECRET);
    localStorage.setItem(process.env.REACT_APP_LOCAL_SECRET, encryptedSecret);
  }

  logout() {
    this.secret = null;
    this.password = null;
  }
}

export const UserContext = createContext(new User());
