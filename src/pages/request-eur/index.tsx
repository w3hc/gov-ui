import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Head } from '../../components/layout/Head'
import govContract from '../../utils/Gov.json'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useRouter } from 'next/router'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../../utils/erc20'

export default function RequestEur() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState('1000')
  const [title, setTitle] = useState('Transfer 1000 € to Alice')
  const [beneficiary, setBeneficiary] = useState('0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977')
  const [description, setDescription] = useState("Let's transfer 1000 € to Alice for this and that reason.")
  const [targetContract, setTargetContract] = useState(ERC20_CONTRACT_ADDRESS)

  const { address, chainId, isConnected } = useWeb3ModalAccount()
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

  const submitProposal = async (e: any) => {
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

        // If user is not a member, make him a member (test only)
        await handleMembership()

        // Check if user is delegated
        await handleDelegation()

        // Load contracts
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)
        const erc20 = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)

        // Prep call
        console.log('beneficiary:', beneficiary)
        console.log('title:', title)
        console.log('targetContract:', targetContract)
        // console.log('ethers.parseEther(amount):', ethers.parseEther(amount))
        console.log('ethers.parseEther(String(amount)):', ethers.parseEther(String(amount)))

        const erc20Transfer = erc20.interface.encodeFunctionData('transfer', [beneficiary, ethers.parseEther(String(amount))])
        const call = [erc20Transfer.toString()]
        const calldatas = [call.toString()]
        const PROPOSAL_DESCRIPTION: string = '# ' + title + '\n' + description + ''
        const targets = [targetContract]
        const values = [0]

        // If user has not enough ETH, we send some
        await handleBalance()

        // Call propose
        console.log('caller address:', await signer?.getAddress())
        const propose = await gov.propose(targets, values, calldatas, PROPOSAL_DESCRIPTION)
        console.log('Propose triggered')
        const proposeReceipt: any = await propose.wait(1)
        console.log('propose tx', proposeReceipt)
        const proposals: any = await gov.queryFilter('ProposalCreated' as any, proposeReceipt.blockNumber)
        const proposalId: any = proposals[0].args?.proposalId.toString()
        console.log('proposalId:', proposalId)

        // Redirect to proposal page
        const targetURL = '/proposal/' + proposalId
        router.push(targetURL)
      } else {
        console.log('provider unset')
        setIsLoading(false)
        return
      }
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
        <HeadingComponent as="h2">Request EUR</HeadingComponent>
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

          <FormLabel>Amount (in EUR)</FormLabel>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={amount} />
          <FormHelperText>How much EUR are you asking for?</FormHelperText>
          <br />
          <br />

          <FormLabel>ERC-20 token contract address</FormLabel>
          <Input value={targetContract} onChange={(e) => setTargetContract(e.target.value)} placeholder={targetContract} />
          <FormHelperText>Which token you you like to transfer from the DAO to the beneficiary?</FormHelperText>
          <br />
          <br />

          <FormLabel>Beneficiary</FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>Who should receive the money?</FormHelperText>
          <br />
          <br />
          {!isLoading ? (
            <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Submit
            </Button>
          ) : (
            <Button isLoading loadingText="Submitting..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Submitting
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
