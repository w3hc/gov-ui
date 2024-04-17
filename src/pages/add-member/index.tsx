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

export default function AddMember() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('XYZ as a new member')
  const [beneficiary, setBeneficiary] = useState(String(address))
  const [description, setDescription] = useState('XYZ as a new member')
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState('')

  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()
  const router = useRouter()

  const submitProposal = async (e: any) => {
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
      console.log('submitting proposal...')

      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        console.log('signer:', signer)
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)
        const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
        const safeMint = nft.interface.encodeFunctionData('safeMint', [
          beneficiary,
          'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/',
        ])
        const calldatas = [safeMint.toString()]
        const PROPOSAL_DESCRIPTION: string = '# ' + title + '\n' + description + ''
        const targets = [beneficiary]
        const values = [ethers.parseEther(amount)]

        // delegate to self before calling propose
        await delegateToMyself()

        // call propose
        console.log('caller address:', await signer?.getAddress())
        const propose = await gov.propose(targets, values, calldatas, PROPOSAL_DESCRIPTION)
        console.log('Propose triggered')
        const proposeReceipt: any = await propose.wait(1)
        const proposals: any = await gov.queryFilter('ProposalCreated' as any, proposeReceipt.blockNumber) // TODO: fix type casting
        const proposalId: any = proposals[0].args?.proposalId.toString()
        console.log('proposalId:', proposalId)
        const targetURL = '/proposal/' + proposalId
        router.push(targetURL)
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
        <HeadingComponent as="h2">Add a member</HeadingComponent>
        <br />

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={title} />
          <FormHelperText>How should we refer to your proposal?</FormHelperText>
          <br />
          <br />

          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="" />
          <FormHelperText>Supports markdown.</FormHelperText>
          <br />
          <br />
          <FormLabel>New member address</FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>The wallet address of the new member</FormHelperText>
          <br />

          {!isLoading ? (
            <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Submit proposal
            </Button>
          ) : (
            <Button isLoading loadingText="Submitting proposal..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Submit proposal
            </Button>
          )}
        </FormControl>
      </main>
    </>
  )
}
