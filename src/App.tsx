import { useState } from 'react';
import { initWasm } from '@trustwallet/wallet-core';
import './App.css';
import { signNearRaw } from './utils/near';
import { TTranx } from './utils/wallet/types';
import { Wallet } from './utils/wallet';

function App() {
  const txData: TTranx = {
    chainId: 'near',
    amount: 0.025,
    contractAddress: '0x1fa4a73a3f0133f0025378af00236f3abdee5d63',
    contractDecimals: 24,
    nonce: 81780636000002,
    fromAddress: 'e2f235b702f8d77aff6187f4a2a7df197716e00803ebd313733c24ef5d863b41',
    amountHex: '054b40b1f852bdc00000',
    blockHash: '9NQ37w3FcZcPPS9ksy3QWAuWkA3xxNdiskaUr5xM2E2u',
    toAddress: 'e2f235b702f8d77aff6187f4a2a7df197716e00803ebd313733c24ef5d863b41',
    amountValue: 25000000000000000000000,
    gasLimit: 0,
    gasPrice: 0,
  };

  const [hash, setHash] = useState('');

  const signNearTrust = async () => {
    const walletCore = await initWasm();
    const wallet = new Wallet(walletCore);
    const hexPrvKeyFromTrustWallet = 'f92589ed1e5568cc10838611996e08c0b5b6922de5024050e3311164df496c1d';
    const txHash = await wallet.signNearTx(txData, hexPrvKeyFromTrustWallet);
    console.log('txHash Trust Wallet ', txHash);
  };

  const signNearAPIJs = async () => {
    const fullPrvKey = '5yutZ7z1NUFmUbqBdFuAgWbqdXzpY1wZB7cnau4s9L4gzSFhMKb68XkJiY5yEVJSge3D3ib1bZGyrwnTj17bVvGg';
    const txHash = await signNearRaw(txData, fullPrvKey);
    console.log('txHash Near API Js ', txHash);
    setHash(txHash);
  };

  return (
    <div className="App">
      <h1>Wallet Core Near Sign Example</h1>
      <div className="">
        <button
          onClick={async () => {
            await signNearAPIJs();
          }}
        >
          Sign Near APIjs
        </button>
        <button
          onClick={async () => {
            await signNearTrust();
          }}
        >
          Sign Near Wallet Core
        </button>
      </div>
      <p className="read-the-docs">Click on the above buttons and check the console</p>
    </div>
  );
}

export default App;
