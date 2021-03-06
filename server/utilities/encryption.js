const crypto = require('crypto');
const CryptoJS = require('crypto-js');

module.exports = {
    generateSalt: () => {
        return crypto.randomBytes(128).toString('base64');
    },
    generateHashedPassword: (salt, pwd) => {
        return crypto
            .createHmac('sha256', salt)
            .update(pwd)
            .digest('hex');
    },
    fileEncrypt: (file, encryptionKey) => {
        // Encrypt 
        var ciphertext = CryptoJS.AES.encrypt(file, encryptionKey);
        return ciphertext;
    },
    fileDecrypt: (encModel, encryptionKey) => {

        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(encModel.toString(), encryptionKey);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log("decrypted data: ", decryptedData);
        return decryptedData;
    },
}