import * as bcrypt from 'bcrypt';

const aesjs = require('aes-js');

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const encryptPassword = (password: string): string => {
  const textBytes = aesjs.utils.utf8.toBytes(password);
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    fetchKey(),
    new aesjs.Counter(5),
  );
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
};

export const decryptPassword = (encryptedString: string) => {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedString);
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    fetchKey(),
    new aesjs.Counter(5),
  );
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const password = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return password;
};

const fetchKey = () => {
  const key = process.env.SECRET_KEY || '';
  if (key.length < 16) {
    throw new Error('SecretKey Must Be  16 characters or more in length');
  }
  const keyList = aesjs.utils.utf8.toBytes(key);
  const result = new Uint8Array(keyList.buffer.slice(0, 16));
  return result;
};
