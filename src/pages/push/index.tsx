import { Heading, Button, Badge, FormControl, FormLabel, Textarea, ListItem, UnorderedList, Input, FormHelperText, Checkbox } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { Head } from '../../components/layout/Head'
import { useState } from 'react'
import { useEthersSigner, useEthersProvider } from '../../hooks/ethersAdapter'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi } from '../../utils/config'
// import { UploadFile } from '../../components/layout/UploadFile'
// import { UploadData } from '../../components/layout/UploadData'
import { useRouter } from 'next/router'

// const baseUrl = 'https://www.tally.xyz/gov/' + TALLY_DAO_NAME + '/proposal/'

export default function Create() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('')
  const [beneficiary, setBeneficiary] = useState('0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977')
  const [description, setDescription] = useState('')
  const [whyJoin, setWhyJoin] = useState('')
  const [encryptionRequested, setEncryptionRequested] = useState(false)
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState('')

  const router = useRouter()
  const provider = useEthersProvider()
  const signer = useEthersSigner()

  const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)

  const submitProposal = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    console.log('submitProposal triggered')
    // console.log('file name:', name)
    console.log('encryptionRequested:', encryptionRequested)
    console.log('whyJoin:', whyJoin)

    let fileToAddInDescription: string = ''
    let plaintextString = ''

    // if encryption is not requested, upload the file to ipfs
    // fileToAddInDescription = await UploadFile(plaintext, name)
    // console.log('[no encryption] fileToAddInDescription:', fileToAddInDescription)
    // }

    try {
      // prepare Gov
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)

      // prepare calldatas
      const call = '0x'
      const calldatas = [call.toString()]

      // prepare proposal description
      let PROPOSAL_DESCRIPTION: string
      // console.log('fileToAddInDescription:', fileToAddInDescription)
      // console.log('encryptionRequested:', encryptionRequested)
      // console.log('plaintextString:', plaintextString)

      if (fileToAddInDescription) {
        // won't work if no file attached
        if (plaintextString) {
          PROPOSAL_DESCRIPTION = '' + title + '\n' + description + '\n\n[View attached document](' + fileToAddInDescription + ')'
          if (encryptionRequested) {
            PROPOSAL_DESCRIPTION += ' encrypted' /*+ (cipherId === null ? "没有" : cipherId)*/
          } else {
            PROPOSAL_DESCRIPTION = '' + title + '\n' + description + ''
          }
        } else {
          PROPOSAL_DESCRIPTION = '' + title + '\n' + description + '\n\n[View attached document](' + fileToAddInDescription + ')'
        }
      } else {
        PROPOSAL_DESCRIPTION = '' + title + '\n' + description + ''
      }

      // console.log('PROPOSAL_DESCRIPTION:', PROPOSAL_DESCRIPTION)

      PROPOSAL_DESCRIPTION = PROPOSAL_DESCRIPTION + '\n\nWHYJOIN' + whyJoin

      // set targets and values
      const targets = [beneficiary]
      const values = [ethers.parseEther(amount)]

      console.log(amount)
      console.log(description)
      setAmount(amount)

      console.log('encryptionRequested:', encryptionRequested)

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
      // console.log('Tally link:', baseUrl + proposalId)
      const targetURL = '/proposal/' + proposalId
      setLoading(false)
      router.push(targetURL)
    } catch (e) {
      console.log('error:', e)
      setLoading(false)
    }
  }

  const handleFileChange = (event: any) => {
    if (encryptionRequested) {
      console.log('handleFileChange:', event)
      const file = event
      setName(file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const plaintext = String(event.target?.result)
        setPlaintext(plaintext)
      }
      reader.onerror = (error) => {
        console.log('File Input Error: ', error)
      }
    } else {
      console.log('event:', event)
      const file = event
      setName(file.name)
      setPlaintext(file)
    }
  }

  const hasDelegated = async () => {
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
    const delegateTo = await signer?.getAddress()
    const nftAddress = await gov.token()
    const nft = new ethers.Contract(nftAddress, nftAbi, signer)
    const delegate = await nft.delegates(await signer?.getAddress())
    if (delegate === delegateTo) {
      return true
    }
  }

  const delegateToMyself = async () => {
    if ((await hasDelegated()) === true) {
      return true
    } else {
      console.log('delegating to self...')
      const delegateTo = await signer?.getAddress()
      console.log('hello signer address:', await signer?.getAddress())
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const nftAddress = await gov.token()
      const nft = new ethers.Contract(nftAddress, nftAbi, signer)
      const delegate = await nft.delegate(delegateTo)
      const receippt = await delegate.wait(1)
      console.log('delegate receipt:', receippt)
      return true
    }
  }

  return (
    <>
      <Head />

      <main>
        <br />

        <Heading as="h2">Submit a proposal</Heading>
        <br />

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" />
          <FormHelperText>How should we refer to your proposal?</FormHelperText>
          <br />
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
          <FormLabel>Target address</FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>Who should receive the money?</FormHelperText>
          <br />
          {/* <FormLabel>Banner image</FormLabel>
          <FormHelperText>
            Recommended format: <strong>1500x500</strong> (jpeg or png)
          </FormHelperText> */}
          <br />
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
          <br />
          {!loading ? (
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
