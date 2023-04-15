import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  Wallet,
} from "@rainbow-me/rainbowkit";
import {
  createClient,
  configureChains,
  WagmiConfig,
  mainnet,
  goerli,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  StarknetConfig,
  InjectedConnector,
  useConnectors,
} from "@starknet-react/core";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "RainbowKit Mint NFT Demo",
  chains,
});

const demoAppInfo = {
  appName: "RainbowKit Mint NFT Demo",
};

const connectors = connectorsForWallets([...wallets]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];

  return (
    <StarknetConfig connectors={connectors} autoConnect={true}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </StarknetConfig>
  );
}
