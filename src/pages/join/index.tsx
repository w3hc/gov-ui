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
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('XYZ as a new member')
  const [beneficiary, setBeneficiary] = useState(String(address))
  const [description, setDescription] = useState('XYZ as a new member')
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState('')
  const [showButtons, setShowButtons] = useState(false)

  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()
  const router = useRouter()

  const join = async (e: any) => {
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
    e.preventDefault()
    setIsLoading(true)
    let signer

    try {
      console.log('minting...')

      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        console.log('signer:', signer)
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)

        const nftBal = await nft.balanceOf(String(address))
        console.log('nftBal:', nftBal)
        if (nftBal > 0) {
          toast({
            title: 'NFT detected',
            position: 'bottom',
            description: 'You already own a membership NFT.',
            status: 'info',
            variant: 'subtle',
            duration: 2000,
            isClosable: true,
          })
          setShowButtons(true)
          setIsLoading(false)
          return
        }

        await delegateToMyself()

        // call propose
        console.log('caller address:', await signer?.getAddress())

        const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'

        const safeMint = await nft.safeMint(beneficiary, uri)
        const safeMintReceipt: any = await safeMint.wait(1)

        console.log('safeMintReceipt:', safeMintReceipt)
        // const targetURL = '/proposal/' + proposalId
        // router.push(targetURL)
        setShowButtons(true)
      }
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      console.log('delegate error:', e)
    }
  }

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
        <Box borderRadius="lg" overflow="hidden">
          <Image priority width="2000" height="2000" alt="dao-image" src="/warning-sign.gif" />
        </Box>
        <br />
        <HeadingComponent as="h2">Become a member</HeadingComponent>

        <FormControl>
          <FormLabel>New member address</FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>The wallet address of the new member</FormHelperText>
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
        </FormControl>
        <br />
        {showButtons && (
          <>
            <Wrap>
              <WrapItem>
                <LinkComponent href="/erc20">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    ERC-20 transfer
                  </Button>
                </LinkComponent>
              </WrapItem>
              <WrapItem>
                <LinkComponent href="/erc20">
                  <Button mt={3} mr={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                    ERC-20 transfer
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
      </main>
    </>
  )
}
