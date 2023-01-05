import { TTranx } from '../wallet/types';
import * as nearAPI from 'near-api-js';
import { toBN } from 'web3-utils';
import * as bs58 from 'bs58';
import BigNumber from 'bignumber.js';

export async function signNearRaw(tx: TTranx, prvKey: string) {
  const { keyStores, KeyPair, connect, transactions } = nearAPI;
  const config = {
    networkId: 'mainnet',
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  };
  const near = await connect(config);
  const createAccountKeyPair = KeyPair.fromString(prvKey);
  await config.keyStore.setKey(config.networkId, tx.fromAddress, createAccountKeyPair);
  const createAccount = await near.account(tx.fromAddress);
  const actions = [nearAPI.transactions.transfer(toBN(tx.amountHex ?? ""))];
  const { accessKey, publicKey } = await createAccount.findAccessKey(tx.fromAddress ?? '', actions);
  const nonce = accessKey.nonce.add(toBN(1));
  const signedTx = await transactions.signTransaction(tx.toAddress ?? '', nonce, actions, bs58.decode(tx.blockHash ?? ''), near.connection.signer, createAccount.accountId, config.networkId);
  const nearApiJs = Buffer.from(signedTx[1].encode()).toString('base64');
  return nearApiJs;
}
