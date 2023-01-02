import { TW, WalletCore } from "@trustwallet/wallet-core";
declare global {
    interface Window {
        WalletCore: WalletCore;
        TW: typeof TW;
    }
}
