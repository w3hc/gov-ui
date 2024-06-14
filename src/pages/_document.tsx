import { Html, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import { Head } from '../components/layout/Head'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript initialColorMode={'dark'} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
