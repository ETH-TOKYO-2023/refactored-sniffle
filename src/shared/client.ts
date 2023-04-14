import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
 
export const { chains, provider } = configureChains(
  [mainnet],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains
  });

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })