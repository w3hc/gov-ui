import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ChakraProvider } from '@chakra-ui/react'
import { Seo } from '../components/layout/Seo'
import { useIsMounted } from '../hooks/useIsMounted'

// https://github.com/wslyvh/nexth/blob/chakra/src/pages/_app.tsx
// https://socialsharepreview.com/
// https://www.opengraph.xyz/

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <>
      <ChakraProvider>
        <Seo />
        {isMounted && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </>
  )
}
