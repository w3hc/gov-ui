import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Textarea } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import govContract from '../../utils/Gov.json'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useRouter } from 'next/router'
import { faucetAmount } from '../../utils/config'

export default function RequestEth() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [amount, setAmount] = useState('0.000000001')
  const [title, setTitle] = useState('One cool contrib (ETH transfer)')
  const [beneficiary, setBeneficiary] = useState('')
  const [description, setDescription] = useState("Let's transfer 0.000000001 ETH to Alice for this cool contrib!")

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
        setBeneficiary(address as string)
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

  const submitProposal = async (e: any) => {
    try {
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
        console.log('user disconnected')
        setIsLoading(false)
        return
      }

      // Load contract
      const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

      // Prep call
      const call = '0x'
      const calldatas = [call.toString()]
      const PROPOSAL_DESCRIPTION: string = '# ' + title + '\n' + description + ''
      const targets = [beneficiary]
      const values = [ethers.parseEther(amount)]

      // If user is not a member, make him a member (test only)
      // const membership = await handleMembership()
      // if (membership === false) {
      //   return
      // }

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
      console.log('delegate error:', e)
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
        <HeadingComponent as="h2">Request ETH</HeadingComponent>
        <br />

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" />
          <FormHelperText>How should we refer to your proposal?</FormHelperText>
          <br />
          <br />

          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="" />
          <FormHelperText>Supports markdown.</FormHelperText>
          <br />
          <br />

          <FormLabel>Amount (in ETH)</FormLabel>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1" />
          <FormHelperText>How much ETH are you asking for?</FormHelperText>
          <br />
          <br />

          <FormLabel>Target address</FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>Who should receive the money?</FormHelperText>
          <br />
          <br />

          {!isLoading ? (
            <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Submit proposal
            </Button>
          ) : (
            <Button isLoading loadingText="Submitting proposal..." mt={4} colorScheme="blue" variant="outline" type="submit">
              Submitting proposal
            </Button>
          )}
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
