import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Seo } from '../components/layout/Seo'
import govContract from '../utils/Gov.json'

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    console.log('DAO contract address:', govContract.address)
  }, [])

  return (
    <>
      {ready ? (
        <ChakraProvider>
          <Seo />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      ) : null}
    </>
  )
}
