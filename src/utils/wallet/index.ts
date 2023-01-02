import { TTranx } from './types';
import * as bs58 from 'bs58';
import Long from 'long';
import { TW } from '@trustwallet/wallet-core';
const { WalletCore } = window;

export class Wallet {
  account: any;
  CoinType: typeof WalletCore.CoinType;
  HexCoding: typeof WalletCore.HexCoding;
  AnySigner: typeof WalletCore.AnySigner;
  HDWallet: typeof WalletCore.HDWallet;
  PublicKey: typeof WalletCore.PublicKey;
  AnyAddress: typeof WalletCore.AnyAddress;
  PrivateKey: typeof WalletCore.PrivateKey;
  Mnemonic: typeof WalletCore.Mnemonic;
  Curve: typeof WalletCore.Curve;
  SolanaAddress: typeof WalletCore.SolanaAddress;
  StoredKey: typeof WalletCore.StoredKey;

  constructor(_walletCore = WalletCore) {
    const { HDWallet, CoinType, AnySigner, HexCoding, PublicKey, PrivateKey, Mnemonic, Curve, AnyAddress, SolanaAddress, StoredKey } = _walletCore;
    this.account = HDWallet;
    this.CoinType = CoinType;
    this.AnySigner = AnySigner;
    this.HexCoding = HexCoding;
    this.HDWallet = HDWallet;
    this.PublicKey = PublicKey;
    this.PrivateKey = PrivateKey;
    this.Mnemonic = Mnemonic;
    this.Curve = Curve;
    this.AnyAddress = AnyAddress;
    this.SolanaAddress = SolanaAddress;
    this.StoredKey = StoredKey;
  }

  signNearTx = async (tx: TTranx, prvKey: string) => {
    const keypair = this.PrivateKey.createWithData(this.HexCoding.decode(prvKey));
    const txDataInput = TW.NEAR.Proto.SigningInput.create({
      nonce: Long.fromString(tx.nonce.toString()),
      blockHash: bs58.decodeUnsafe(tx.blockHash ?? ''),
      signerId: tx.fromAddress,
      receiverId: tx.toAddress,
      actions: [
        {
          transfer: TW.NEAR.Proto.Transfer.create({
            deposit: toBufferLE(BigInt(tx.amount * Math.pow(10, tx.contractDecimals)), 16),
          }),
        },
      ],
      privateKey: keypair.data(),
    });
    const output = TW.NEAR.Proto.SigningInput.encode(txDataInput).finish();
    const outputData = this.AnySigner.sign(output, this.CoinType.near);
    const NearSigningOutput = TW.NEAR.Proto.SigningOutput.decode(outputData);
    const txHash = Buffer.from(NearSigningOutput.signedTransaction).toString('base64');
    return txHash;
  };
}

export function toBufferBE(num: bigint, width: number): Buffer {
  const hex = num.toString(16);
  const buf = Buffer.from(hex.padStart(width * 2, '0'), 'hex');
  if (buf.length != width) throw Error('int too big');
  return buf;
}

export function toBufferLE(num: bigint, width: number): Buffer {
  return toBufferBE(num, width).reverse();
}
