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

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState('')
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState(String(address))

  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()

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

  useEffect(() => {
    const init = async () => {
      checkCurrentDelegate()
    }
    init()
  }, [loadingDelegateToSelf, isLoading, address])

  const handleBalance = async () => {
    console.log('handleBalance start')
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      const balance = await ethersProvider.getBalance(String(address))
      const ethBalance = Number(ethers.formatEther(balance))
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
      }
    }
  }

  const handleMembership = async () => {
    console.log('handleMembership start')
    let signer
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const nftBal = Number(await nft.balanceOf(String(address)))
      console.log('nftBal:', nftBal)
      if (nftBal === 0) {
        try {
          console.log('joining...')
          // If user has not enough ETH, we send some
          await handleBalance()
          const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'
          const safeMint = await nft.safeMint(address, uri)
          const receipt = await safeMint.wait(1)
          console.log('safeMint:', receipt)
        } catch (e) {
          console.log('error during mint:', e)
          toast({
            title: 'Error during mint',
            position: 'bottom',
            description: "There was an error in the minting process. Could be because you don't have enough ETH on your wallet.",
            status: 'info',
            variant: 'subtle',
            duration: 9000,
            isClosable: true,
          })
          setIsLoading(false)
        }
      }
    }
  }

  const handleDelegation = async () => {
    console.log('handleDelegation start')
    let signer
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegateTo = await nft.delegates(address)
      if (delegateTo != address) {
        console.log('delegating...')
        // If user has not enough ETH, we send some
        await handleBalance()
        const delegate = await nft.delegate(address)
        const delegateTx = await delegate.wait(1)
        console.log('delegate tx:', delegateTx)
      }
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

        // Check if user is delegated
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
