import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { ETH_CHAINS, SITE_NAME, infuraId } from '../utils/config'
import { useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const { provider, webSocketProvider, chains } = configureChains(ETH_CHAINS, [publicProvider()])

const client = createClient(
  getDefaultClient({
    appName: SITE_NAME,
    // autoConnect: true,
    infuraId,
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
