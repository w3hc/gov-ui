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

export default function RequestEth() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('Transfer 0.00001 ETH')
  const [beneficiary, setBeneficiary] = useState('0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977')
  const [description, setDescription] = useState("Let's transfer 0.00001 ETH for this and that resaon!")
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState('')

  const { address, chainId, isConnected } = useWeb3ModalAccount()
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

        const call = '0x'
        const calldatas = [call.toString()]
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

          {/* <FormLabel>Banner image</FormLabel>
          <FormHelperText>
            Recommended format: <strong>1500x500</strong> (jpeg or png)
          </FormHelperText> */}
          {/* <br /> */}
          {/* <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            style={{ minWidth: '400px', width: '100%' }}
            onChange={(e: any) => handleFileChange(e.target.files[0])}
          /> */}
          {/* <LockIcon w={3} h={3} color="red.500" />{' '}
          <Checkbox onChange={(e) => setEncryptionRequested(e.target.checked)}>Only accessible to DAO members</Checkbox> */}
          {/* <FormHelperText>Your file will be stored encrypted on IPFS (Filecoin)</FormHelperText> */}
          {/* <FormHelperText>Your file will be stored on IPFS (Filecoin), so the image you&lsquo;re sharing will be public.</FormHelperText> */}
          {/* <br /> */}
          {!isLoading ? (
            <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Push
            </Button>
          ) : (
            <Button isLoading loadingText="Pushing..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={submitProposal}>
              Push
            </Button>
          )}
        </FormControl>
      </main>
    </>
  )
}
