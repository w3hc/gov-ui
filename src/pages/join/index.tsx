import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Textarea, Box, Wrap, WrapItem } from '@chakra-ui/react'
import { useState } from 'react'
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

export default function Join() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showButtons, setShowButtons] = useState(false)

  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()
  const router = useRouter()

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
        const delegate = await nft.delegate(address)
        const delegateTx = await delegate.wait(1)
        console.log('delegate tx:', delegateTx)
      }
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
      console.log('submitting proposal...')
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

        setShowButtons(true)
        setIsLoading(false)
      } else {
        console.log('provider unset')
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      console.log('proposal submitted')
    } catch (e) {
      console.log('error submitting proposal:', e)
      toast({
        title: "Can't propose",
        position: 'bottom',
        description: "You can't submit this kind of proposal.",
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
        <HeadingComponent as="h2">Become a member</HeadingComponent>
        <br />

        <Box borderRadius="lg" overflow="hidden">
          <Image priority width="2000" height="2000" alt="dao-image" src="/warning-sign.gif" />
        </Box>
        <br />

        {!isLoading ? (
          <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={join}>
            Join
          </Button>
        ) : (
          <Button isLoading loadingText="Joining..." mt={4} colorScheme="blue" variant="outline" type="submit">
            Join
          </Button>
        )}
        <br />
        <br />
        {showButtons && (
          <>
            <Wrap>
              <WrapItem>
                <LinkComponent href="/request-eth">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    Request ETH
                  </Button>
                </LinkComponent>
              </WrapItem>
              <WrapItem>
                <LinkComponent href="/request-eur">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    Request EUR
                  </Button>
                </LinkComponent>
              </WrapItem>
              <WrapItem>
                <LinkComponent href="/add-member">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    Add a new member
                  </Button>
                </LinkComponent>
              </WrapItem>
              <WrapItem>
                <LinkComponent href="/manifesto">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    Edit the manifesto
                  </Button>
                </LinkComponent>
              </WrapItem>
              <WrapItem>
                <LinkComponent href="/ban-member">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="red" variant="outline">
                    Ban a member
                  </Button>
                </LinkComponent>
              </WrapItem>
            </Wrap>
          </>
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
