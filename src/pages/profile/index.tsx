import * as React from 'react'
import { Button, useToast, Box, Text, Badge } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { LinkComponent } from '../../components/layout/LinkComponent'
import QRCode from 'react-qr-code'
import { faucetAmount } from '../../utils/config'
import { useRouter } from 'next/router'

export default function Profile() {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingBurn, setIsLoadingBurn] = useState<boolean>(false)

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

  const join = async (e: any) => {
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

      await handleBalance()
      const nftCustom = new ethers.Contract(nftContract.address, nftContract.abi, customProvider)

      const nftBal = Number(await nftCustom.balanceOf(address))
      console.log('nftBal:', nftBal)

      if (nftBal < 1) {
        console.log('joining...')

        const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

        const tx = await nft.safeMint(address, uri)
        console.log('tx:', tx)
        const receipt = await tx.wait(1)
        console.log('receipt:', receipt)
        console.log('membership done')
        setIsLoading(false)
        toast({
          title: 'Success',
          position: 'bottom',
          description: "Congrats, you're now a member of the DAO! You can now delegate your voting power to yourself.",
          status: 'success',
          variant: 'subtle',
          duration: 8000,
          isClosable: true,
        })
        const targetURL = '/delegate/'
        router.push(targetURL)
        return true
      } else {
        console.log('already member')
        console.log('membership done')
        setIsLoading(false)
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

  const burn = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoadingBurn(true)

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
        setIsLoadingBurn(false)
        return
      }

      console.log('burn start')

      await handleBalance()

      const nftCustom = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const nftBal = Number(await nftCustom.balanceOf(address))
      console.log('nftBal:', nftBal)

      if (nftBal > 0) {
        console.log('burning nft...')
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
        const tokenId = await nft.tokenOfOwnerByIndex(address, 0)
        const tx = await nft.burn(Number(tokenId))
        console.log('tx:', tx)
        const receipt = await tx.wait(1)
        console.log('receipt:', receipt)
        console.log('burn done')
        setIsLoadingBurn(false)

        return true
      } else {
        console.log('not a member')
        console.log('burn func executed')
        setIsLoadingBurn(false)
        return true
      }
    } catch (e: any) {
      console.log('burn error', e)

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
        setIsLoadingBurn(false)
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
        setIsLoadingBurn(false)
        return false
      }
    }
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Your wallet address</HeadingComponent>

        {isConnected && (
          <>
            <Box borderRadius="lg" overflow="hidden">
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '400', width: '100%' }}
                value={address ? address : 'hello'}
                viewBox={`0 0 256 256`}
              />
            </Box>
            <LinkComponent href={'https://sepolia.etherscan.io/address/' + address}>
              <Text color={'#45a2f8'} _hover={{ color: '#8c1c84' }} mt={5}>
                {address}
              </Text>
            </LinkComponent>
          </>
        )}

        <Button
          mt={4}
          colorScheme="blue"
          variant="outline"
          type="submit"
          isLoading={isLoading}
          loadingText="Joining..."
          onClick={!isLoading ? join : undefined}>
          {isLoading ? 'Joining...' : 'Join as a member'}
        </Button>
        <br />
        <br />
        <HeadingComponent as="h2">Delegation</HeadingComponent>

        <Text>
          To vote, you <strong>must</strong> delegate your voting power to yourself or to another member{' '}
        </Text>
        <LinkComponent href="/delegate">
          <Button mt={4} colorScheme="green" variant="outline" rightIcon={<ArrowForwardIcon />}>
            Delegate
          </Button>
        </LinkComponent>
        <br />
        <br />
        <HeadingComponent as="h2">Leave the DAO</HeadingComponent>

        <Text>You can burn your membership to resign from your DAO membership. You will then lose your voting power. </Text>
        <LinkComponent href="/delegate">
          <Button
            mt={4}
            colorScheme="red"
            variant="outline"
            type="submit"
            isLoading={isLoadingBurn}
            loadingText="Leaving the DAO ..."
            onClick={!isLoadingBurn ? burn : undefined}>
            {isLoadingBurn ? 'Burning your NFT...' : 'Leave the DAO'}
          </Button>
        </LinkComponent>
        <br />
        <br />
        <HeadingComponent as="h2">
          Wallet
          <Badge ml={3} fontSize="0.5em" colorScheme={'pink'} variant="solid">
            SOON
          </Badge>
        </HeadingComponent>

        <Text>You will be able to transfer some value here. </Text>

        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  )
}
