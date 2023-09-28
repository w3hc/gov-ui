import { Heading, Button, Badge } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi } from '../../utils/config'

export default function Join() {
  const [initialized, setInitialized] = useState(true)

  const provider = useProvider()
  const { data: signer } = useSigner()

  return initialized ? (
    <>
      <Head />
      <main>
        <Heading as="h2">Welcome home!</Heading>
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
