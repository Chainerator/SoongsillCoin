const elliptic = require('elliptic');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const ec = new elliptic.ec('secp256k1');

const privateKeyLocation = path.join(__dirname, 'privateKey');

const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const getPrivateFromWallet = () => {
  const buffer = fs.readFileSync(privateKeyLocation, 'utf-8');
  return buffer.toString();
};

const getPublicFromWallet = () => {
  const privateKey = getPrivateFromWallet();
  const key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic().encode('hex');
};

const getBalance = (address, uTxOuts) =>
  _(uTxOuts)
    .filter(uTxO => uTxOuts.address === address)
    .map(uTxO => uTxO.amount)
    .sum();

const initWallet = () => {
  if (fs.existsSync(privateKeyLocation)) {
    return;
  }
  const newPrivateKey = generatePrivateKey();

  fs.writeFileSync(privateKeyLocation, newPrivateKey);
};

module.exports = {
  initWallet,
};