import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Text, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'

export default function Delegate() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState('')
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState(String(address))

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
        await checkCurrentDelegate()
      }
    }
    init()
  }, [address, walletProvider, loadingDelegateToSelf, isLoading])

  const checkCurrentDelegate = async () => {
    if (address) {
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, customProvider)
      const getDelegate = await nft.delegates(address)
      console.log('getDelegate:', getDelegate)
      setCurrentDelegate(getDelegate)
      if (getDelegate === address) {
        setIsDelegatedToSelf(true)
      } else {
        setIsDelegatedToSelf(false)
      }
    }
  }

  const handleBalance = async () => {
    console.log('handle balance start')
    const ethersProvider = new BrowserProvider(provider)
    const balance = await ethersProvider.getBalance(String(address))
    const ethBalance = Number(ethers.formatEther(balance))
    console.log('ethBalance:', ethBalance)
    if (ethBalance < 0.0005) {
      console.log('waiting for some ETH...')
      const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
      const specialSigner = new ethers.Wallet(pKey, customProvider)
      const tx = await specialSigner.sendTransaction({
        to: address,
        value: ethers.parseEther('0.0005'),
      })
      const receipt = await tx.wait(1)
      console.log('faucet tx:', receipt)
      console.log('balance ok')
    } else {
      console.log('balance ok')
    }
  }

  const handleMembership = async () => {
    try {
      console.log('handleMembership start')

      await handleBalance()

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const nftBal = Number(await nft.balanceOf(address))
      console.log('nftBal:', nftBal)

      if (nftBal < 1) {
        console.log('joining...')

        const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'
        const tx = await nft.safeMint(address, uri)
        console.log('tx:', tx)
        const receipt = await tx.wait(1)
        console.log('receipt:', receipt)
        console.log('membership done')
      } else {
        console.log('already member')
        console.log('membership done')
      }
    } catch (e: any) {
      console.log('handleMembership error', e)

      if (e.toString().includes('could not coalesce error')) {
        console.log('This is the coalesce error.')
        toast({
          title: 'Email login not supported',
          position: 'bottom',
          description: "Sorry, this feature is not supported yet if you're using the email login.",
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      } else {
        toast({
          title: 'Error',
          position: 'bottom',
          description: 'handleMembership error',
          status: 'error',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      }
    }
  }

  const handleDelegation = async () => {
    console.log('delegation start')

    await handleBalance()

    const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
    const delegateTo = await nft.delegates(address)
    if (delegateTo != address) {
      console.log('delegating...')

      const delegate = await nft.delegate(address)
      const delegateTx = await delegate.wait(1)
      console.log('delegate tx:', delegateTx)
      console.log('delegation done')
    } else {
      console.log('already delegated')
      console.log('delegation done')
    }
  }

  const delegate = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if user is logged in
    if (!isConnected) {
      toast({
        title: 'Disconnected',
        position: 'bottom',
        description: 'Please connect your wallet first.',
        status: 'info',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('delegating...')
      let signer
      if (provider) {
        // make signer
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        // If user is not a member, make him a member (test only)
        await handleMembership()

        console.log('delegating...')
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

        // If user has not enough ETH, we send some
        await handleBalance()

        const delegate = await nft.delegate(targetAddress)
        const delegateTx = await delegate.wait(1)
        console.log('delegate tx:', delegateTx)

        setIsLoading(false)
      } else {
        console.log('provider unset')
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      console.log('delegated')
    } catch (e) {
      console.log('error delegating:', e)
      toast({
        title: "Can't delegate",
        position: 'bottom',
        description: "Can't delegate.",
        status: 'info',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  const delegateToSelf = async (e: any) => {
    e.preventDefault()

    // Check if user is logged in
    if (!isConnected) {
      toast({
        title: 'Disconnected',
        position: 'bottom',
        description: 'Please connect your wallet first.',
        status: 'info',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
      setLoadingDelegateToSelf(false)
      return
    }

    try {
      console.log('delegating...')
      let signer
      if (provider) {
        // make signer
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        // If user has not enough ETH, we send some
        await handleBalance()

        // If user is not a member, make him a member (test only)
        await handleMembership()

        await handleDelegation()
        setLoadingDelegateToSelf(false)
      } else {
        console.log('provider unset')
        setLoadingDelegateToSelf(false)
        return
      }
      setLoadingDelegateToSelf(false)
      console.log('delegated')
    } catch (e) {
      console.log('error delegating:', e)
      toast({
        title: "Can't propose",
        position: 'bottom',
        description: "You can't delegate.",
        status: 'info',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
      setLoadingDelegateToSelf(false)
    }
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Delegation management</HeadingComponent>
        <br />
        {currentDelegate === address && (
          <Text>
            You&apos;ve delegated your vote to <strong>yourself</strong>. If you feel like you may not be willing to vote on a regular basis, you can
            delegate to someone who will vote on your behalf. You can take it back anytime you want.
          </Text>
        )}
        {currentDelegate === '0x0000000000000000000000000000000000000000' && (
          <Text>
            You&apos;ve delegated your vote to <strong>nobody</strong> yet. You can go ahead and delegate to yourself or to someone who will vote on
            your behalf. You can take modify that anytime you want.
          </Text>
        )}
        {isDelegatedToSelf === false && currentDelegate !== '0x0000000000000000000000000000000000000000' && (
          <Text>
            You&apos;ve delegated to <strong>{currentDelegate ? currentDelegate : ''}</strong>. If you feel like you may not be willing to vote on a
            regular basis, you can delegate to someone who will vote on your behalf. You can take it back anytime you want.
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
              <Button isLoading loadingText="Delegating..." mt={4} colorScheme="blue" variant="outline" type="submit">
                Delegate
              </Button>
            )}
            {!loadingDelegateToSelf ? (
              <Button ml={5} mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegateToSelf}>
                Delegate to myself
              </Button>
            ) : (
              <Button ml={5} isLoading loadingText="Delegating to myself..." mt={4} colorScheme="blue" variant="outline" type="submit">
                Delegate to myself
              </Button>
            )}
          </Flex>
        </FormControl>
        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  )
}
