import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Text, Textarea, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { LinkComponent } from '../../components/layout/LinkComponent'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Head } from '../../components/layout/Head'
import govContract from '../../utils/Gov.json'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { faucetAmount } from '../../utils/config'

export default function Manifesto() {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [displayJoinLink, setDisplayJoinLink] = useState<boolean>(false)
  const [manifesto, setManifesto] = useState('')
  const [newManifesto, setNewManifesto] = useState('https://bafkreifnnreoxxgkhty7v2w3qwiie6cfxpv3vcco2xldekfvbiem3nm6dm.ipfs.w3s.link/ ')
  const [title, setTitle] = useState('Manifesto update')
  const [description, setDescription] = useState("Let's update the manifesto.")

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
        await getManifesto()
      }
    }
    init()
  }, [address, walletProvider])

  const getManifesto = async () => {
    const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
    const manifesto = await gov.manifesto()
    console.log('manifesto CID:', manifesto)
    const manifestoContent = await (await fetch(manifesto)).text()
    console.log('manifestoContent:', manifestoContent.substring(manifestoContent.indexOf('\n')))
    setManifesto(manifestoContent)
  }

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

  const submitProposal = async (e: any) => {
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

      // const nft = new ethers.Contract(nftContract.address, nftContract.abi, customProvider)
      // const nftBal = Number(await nft.balanceOf(address))
      // if (nftBal < 1) {
      //   toast({
      //     title: 'Not a member',
      //     position: 'bottom',
      //     description: 'You mmust be a member to submit a proposal.',
      //     status: 'info',
      //     variant: 'subtle',
      //     duration: 2000,
      //     isClosable: true,
      //   })
      //   console.log('not a member')
      //   setDisplayJoinLink(true)
      //   setIsLoading(false)
      //   return
      // }

      console.log('submitting proposal...')

      // Load contract
      const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

      // Prep call
      const setManifesto = gov.interface.encodeFunctionData('setManifesto', [newManifesto])
      const call = [setManifesto.toString()]
      const calldatas = [call.toString()]
      const PROPOSAL_DESCRIPTION: string = '# ' + title + '\n' + description + ''
      const targets = [govContract.address]
      const values = [0]

      // If user has not enough ETH, we send some
      await handleBalance()

      // Call propose
      console.log('caller address:', await signer?.getAddress())
      const propose = await gov.propose(targets, values, calldatas, PROPOSAL_DESCRIPTION)
      console.log('propose triggered')
      const proposeReceipt: any = await propose.wait(1)
      console.log('propose tx', proposeReceipt)
      const proposals: any = await gov.queryFilter('ProposalCreated' as any, proposeReceipt.blockNumber)
      const proposalId: any = proposals[0].args?.proposalId.toString()
      console.log('proposalId:', proposalId)

      // Redirect to proposal page
      const targetURL = '/proposal/' + proposalId
      router.push(targetURL)

      setIsLoading(false)
      console.log('proposal submitted')
    } catch (e) {
      console.log('error submitting proposal:', e)
      toast({
        title: "Can't submit a proposal",
        position: 'bottom',
        description: 'To submit a proposal, you must (1) be a member and (2) delegate your voting power to yourself.',
        status: 'error',
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
        <br />
        <HeadingComponent as="h2">Manifesto</HeadingComponent>

        {manifesto ? (
          <>
            <Text>
              <ReactMarkdown>{manifesto ? manifesto : ''}</ReactMarkdown>
            </Text>
            <br />
            <br />{' '}
          </>
        ) : (
          <>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
            </Box>
          </>
        )}

        <HeadingComponent as="h3">Update the manifesto</HeadingComponent>
        <br />

        <FormControl>
          <FormLabel>Name of the proposal</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={title} />
          <FormHelperText>How should we refer to your proposal?</FormHelperText>
          <br />
          <br />

          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="" />
          <FormHelperText>Supports markdown.</FormHelperText>
          <br />
          <br />
          <FormLabel>New Manifesto URL</FormLabel>
          <Input value={newManifesto} onChange={(e) => setNewManifesto(e.target.value)} placeholder={newManifesto} />
          <FormHelperText>The URL of the newly edited manifesto</FormHelperText>
          <br />

          {displayJoinLink && (
            <>
              <LinkComponent href="/profile">
                <Button mt={3} rightIcon={<ArrowForwardIcon />} colorScheme="green" variant="outline" size="sm">
                  Join
                </Button>
              </LinkComponent>
              <br />
            </>
          )}
          <Button
            mt={4}
            colorScheme="blue"
            variant="outline"
            type="submit"
            isLoading={isLoading}
            isDisabled={displayJoinLink}
            loadingText="Submitting proposal..."
            onClick={submitProposal}>
            {isLoading ? 'Submitting proposal' : 'Submit proposal'}
          </Button>
        </FormControl>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  )
}
