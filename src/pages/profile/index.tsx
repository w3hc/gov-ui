import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Textarea, Box, Wrap, WrapItem, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useRouter } from 'next/router'
import { LinkComponent } from '../../components/layout/LinkComponent'
import { AddIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import QRCode from 'react-qr-code'

export default function Profile() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
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
      return
    }

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

  const join = async (e: any) => {
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
      console.log('start...')

      // If user is not a member, make him a member (test only)
      await handleMembership()

      // Check if user is delegated
      await handleDelegation()

      setIsLoading(false)
      console.log('done')
    } catch (e) {
      console.log('error submitting proposal:', e)
      toast({
        title: 'Woops',
        position: 'bottom',
        description: 'Sorry',
        status: 'info',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Your wallet address</HeadingComponent>
        <br />

        {isConnected && (
          <>
            <Box borderRadius="lg" overflow="hidden">
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={address ? address : 'hello'}
                viewBox={`0 0 256 256`}
              />
            </Box>
            <LinkComponent href={'https://sepolia.etherscan.io/address/' + address}>
              <Text mt={5}>{address}</Text>
            </LinkComponent>
          </>
        )}

        {/* 
        <Box borderRadius="lg" overflow="hidden">
          <Image priority width="2000" height="2000" alt="dao-image" src="/warning-sign.gif" />
        </Box>
        <br /> */}

        {!isLoading ? (
          <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={join}>
            Join as a member
          </Button>
        ) : (
          <Button isLoading loadingText="Joining..." mt={4} colorScheme="blue" variant="outline" type="submit">
            Join as a member
          </Button>
        )}

        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  )
}
