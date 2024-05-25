import * as React from 'react'
import { Button, useToast, FormControl, FormLabel, FormHelperText, Input, Textarea } from '@chakra-ui/react'
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
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../../utils/erc20'
import { faucetAmount } from '../../utils/config'

export default function RequestEur() {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [displayJoinLink, setDisplayJoinLink] = useState<boolean>(false)
  const [amount, setAmount] = useState('1000')
  const [title, setTitle] = useState('One cool contrib (EUR transfer)')
  const [beneficiary, setBeneficiary] = useState<string>('')
  const [description, setDescription] = useState("Let's transfer 1000 € for this cool contrib!")
  const [targetContract, setTargetContract] = useState(ERC20_CONTRACT_ADDRESS)

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

      await handleBalance()

      // Load contracts
      const gov = new ethers.Contract(govContract.address, govContract.abi, signer)
      const erc20 = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)

      // Prep call
      console.log('beneficiary:', beneficiary)
      console.log('title:', title)
      console.log('targetContract:', targetContract)
      console.log('ethers.parseEther(String(amount)):', ethers.parseEther(String(amount)))

      const erc20Transfer = erc20.interface.encodeFunctionData('transfer', [beneficiary, ethers.parseEther(String(amount))])
      const call = [erc20Transfer.toString()]
      const calldatas = [call.toString()]
      const PROPOSAL_DESCRIPTION: string = '# ' + title + '\n' + description + ''
      const targets = [targetContract]
      const values = [0]

      // Call propose
      console.log('submitting proposal...')
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
      console.log('submitProposal error:', e)
      toast({
        title: 'Error',
        position: 'bottom',
        description: 'submitProposal error',
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
      </main>
    </>
  )
}
