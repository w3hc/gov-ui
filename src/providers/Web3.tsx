import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { ETH_CHAINS, SITE_NAME } from '../utils/config'
import { useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

interface Props {
  children: ReactNode
}

export const { provider, webSocketProvider, chains } = configureChains(ETH_CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => ({
      // http: `https://optimism-goerli.infura.io/v3/2cd8708d4b6546ba8ab1dceacc3c1447`,
      http: `https://rpc-test.arthera.net`,
    }),
  }),
])

const client = createClient(
  getDefaultClient({
    appName: SITE_NAME,
    autoConnect: true,
    provider,
    webSocketProvider,
    chains,
  })
)

export function Web3Provider(props: Props) {
  const { colorMode } = useColorMode()

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto" mode={colorMode}>
        {props.children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
