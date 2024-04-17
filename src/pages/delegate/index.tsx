import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Text, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import govContract from '../../utils/Gov.json'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useRouter } from 'next/router'

export default function Delegate() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('Transfer 0.00001 ETH')
  const [beneficiary, setBeneficiary] = useState('0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977')
  const [description, setDescription] = useState("Let's transfer 0.00001 ETH for this and that resaon!")
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState('')
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState(false)
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState('')
  const [initialized, setInitialized] = useState(true)

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()
  const router = useRouter()

  const checkCurrentDelegate = async () => {
    let signer: any
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      console.log('signer:', signer)
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegate = await nft.delegate(address)
      console.log('delegate:', delegate)
      const receipt = await delegate.wait(1)

      setCurrentDelegate(delegate)
      console.log('delegate:', delegate)
      if (delegate === address) {
        setIsDelegatedToSelf(true)
      } else {
        setIsDelegatedToSelf(false)
      }
    }
  }

  const delegate = async () => {
    setIsLoading(true)
    try {
      if (!targetAddress) {
        toast({
          title: 'Missing target address',
          position: 'bottom',
          description: 'Please select the wallet address of the member you want to delegate your vote to.',
          status: 'info',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
        })
        return
      }
      let signer: any
      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        console.log('signer:', signer)
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
        const delegate = await nft.delegate(targetAddress)
        console.log('delegate:', delegate)
        const receipt = await delegate.wait(1)
        console.log('receipt:', receipt)
        checkCurrentDelegate()
        toast({
          title: 'Done!',
          position: 'bottom',
          description: 'Thank you for delegating your vote.',
          status: 'success',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
      }
    } catch (e: any) {
      console.log(e)
      setIsLoading(false)

      toast({
        title: 'Error',
        position: 'bottom',
        description: e,
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const delegateToSelf = async () => {
    setLoadingDelegateToSelf(true)
    let signer: any

    try {
      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        console.log('signer:', signer)
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

        const delegate = await nft.delegate(address)
        console.log('delegate:', delegate)
        setLoadingDelegateToSelf(false)
        toast({
          title: 'Done!',
          position: 'bottom',
          description: 'Thank you for delegating your vote to yourself.',
          status: 'success',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (e: any) {
      console.log(e)
      setLoadingDelegateToSelf(false)

      toast({
        title: 'Error',
        position: 'bottom',
        description: e,
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      checkCurrentDelegate()
      setInitialized(true)
    }
    init()
  }, [])

  //   const handleFileChange = (event: any) => {
  //     console.log('handleFileChange:', event)
  //     const file = event
  //     setName(file.name)
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.onload = (event) => {
  //       const plaintext = String(event.target?.result)
  //       setPlaintext(plaintext)
  //     }
  //     reader.onerror = (error) => {
  //       console.log('File Input Error: ', error)
  //     }
  //   }

  const hasDelegated = async () => {
    console.log('hasDelegated start')
    let signer: any
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      const delegateTo = await signer?.getAddress()
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegate = await nft.delegates(await signer?.getAddress())
      if (delegate === delegateTo) {
        return true
      }
      console.log('hasDelegated done')
    }
  }

  const delegateToMyself = async () => {
    console.log('delegateToMyself start')

    if ((await hasDelegated()) === true) {
      return true
    } else {
      let signer: any
      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        const delegateTo = await signer?.getAddress()
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
        const delegate = await nft.delegate(delegateTo)
        await delegate.wait(1)
        return true
      }
    }
    console.log('delegateToMyself done')
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Delegation management</HeadingComponent>
        <br />
        {isDelegatedToSelf === true ? (
          <Text>
            You&apos;ve delegated your vote to <strong>yourself</strong>. If you feel like you may not be willing to vote on a regular basis, you can
            delegate to someone who will vote on your behalf. You can take it back anytime you want.
          </Text>
        ) : (
          <Text>
            You&apos;ve delegated to <strong>{currentDelegate ? currentDelegate : ''}</strong>
          </Text>
        )}
        <br />
        <FormControl>
          <FormLabel>Target address</FormLabel>
          <Input value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} placeholder="0x..." />
          <FormHelperText>
            You can either delegate to yourself or delegate to another member. You always can delegate back to yourself at any time.
          </FormHelperText>
          <Flex as="header" py={5} mb={8} alignItems="center">
            {!isLoading ? (
              <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegate}>
                Delegate
              </Button>
            ) : (
              <Button isLoading loadingText="Delegating..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegate}>
                Delegate
              </Button>
            )}
            {!loadingDelegateToSelf ? (
              <Button ml={5} mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegateToSelf}>
                Delegate to myself
              </Button>
            ) : (
              <Button
                ml={5}
                isLoading
                loadingText="Delegating to myself..."
                mt={4}
                colorScheme="blue"
                variant="outline"
                type="submit"
                onClick={delegateToSelf}>
                Delegate to myself
              </Button>
            )}
          </Flex>
        </FormControl>
      </main>
    </>
  )
}
