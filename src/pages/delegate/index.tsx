import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Text, Flex, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import Image from 'next/image'
import { faucetAmount } from '../../utils/config'

export default function Delegate() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState('')
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState(String(address ? address : ''))

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
        setTargetAddress(String(address))
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
        console.log('checkCurrentDelegate done')
        setInitialized(true)
      }
    }
    init()
  }, [address, walletProvider])

  const handleBalance = async () => {
    console.log('handle balance start')
    const ethersProvider = new BrowserProvider(provider)
    const balance = await ethersProvider.getBalance(String(address))
    const ethBalance = Number(ethers.formatEther(balance))
    console.log('ethBalance:', ethBalance)
    if (ethBalance < faucetAmount) {
      console.log('waiting for some ETH...')
      const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
      const specialSigner = new ethers.Wallet(pKey, customProvider)
      const tx = await specialSigner.sendTransaction({
        to: address,
        value: ethers.parseEther(String(faucetAmount)),
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
        return true
      } else {
        console.log('already member')
        console.log('membership done')
        return true
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
        return false
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
        return false
      }
    }
  }

  const delegate = async (e: any) => {
    e.preventDefault()
    try {
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

      // If user is not a member, make him a member (test only)
      const membership = await handleMembership()
      if (membership === false) {
        return
      }

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

      // If user has not enough ETH, we send some
      await handleBalance()

      console.log('delegating...')

      console.log('targetAddress:', targetAddress)

      const delegate = await nft.delegate(targetAddress)
      const delegateTx = await delegate.wait(1)
      console.log('delegate tx:', delegateTx)

      setCurrentDelegate(targetAddress)
      setIsDelegatedToSelf(false)
      setIsLoading(false)
      toast({
        title: 'Success',
        position: 'bottom',
        description: "You've just delegated your vote.",
        status: 'success',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
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
    try {
      setLoadingDelegateToSelf(true)

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

      // If user is not a member, make him a member (test only)
      // const membership = await handleMembership()
      // if (membership === false) {
      //   return
      // }

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

      // If user has not enough ETH, we send some
      await handleBalance()

      console.log('delegating...')

      console.log('address:', address)

      const delegate = await nft.delegate(address)
      const delegateTx = await delegate.wait(1)
      console.log('delegate tx:', delegateTx)

      setCurrentDelegate(String(address))
      setLoadingDelegateToSelf(false)
      setIsDelegatedToSelf(true)
      toast({
        title: 'Success',
        position: 'bottom',
        description: "You've just delegated to yourself.",
        status: 'success',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
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
      setLoadingDelegateToSelf(false)
    }
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Delegation management</HeadingComponent>
        {!initialized && isConnected && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
          </Box>
        )}
        {!isConnected && (
          <>
            <Text>Please connect your wallet.</Text>
          </>
        )}
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
