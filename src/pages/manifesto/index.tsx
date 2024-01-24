import { Heading, Button, Badge, Text, FormControl, FormLabel, Textarea, Input, FormHelperText, useToast, Flex } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useEthersSigner, useEthersProvider } from '../../hooks/ethersAdapter'
import { ethers } from 'ethers'
import { nftAbi, GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI } from '../../utils/config'
import ReactMarkdown from 'react-markdown'

export default function Manifesto() {
  const [initialized, setInitialized] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState(false)
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState('')
  const [manifesto, setManifesto] = useState('')
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const toast = useToast()

  useEffect(() => {
    const init = async () => {
      if (!signer) {
        return
      }
      getManifesto()
      setInitialized(true)
    }
    init()
  }, [signer])

  const getManifesto = async () => {
    const userAddress = await signer?.getAddress()
    console.log('userAddress:', userAddress)
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const manifesto = await gov.manifesto()
    console.log('manifesto CID:', manifesto)
    // const manifestoContent = await (await fetch('https://' + manifesto + '.ipfs.w3s.link/manifesto.md')).text()
    const manifestoContent = await (await fetch(manifesto)).text()
    console.log('manifestoContent:', manifestoContent.substring(manifestoContent.indexOf('\n')))
    setManifesto(manifestoContent)
  }

  return initialized ? (
    <>
      <Head />
      <main>
        <Heading as="h2">Manifesto</Heading>
        <br />
        <Text>
          <ReactMarkdown>{manifesto}</ReactMarkdown>
        </Text>
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
