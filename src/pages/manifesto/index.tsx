import {
  Heading,
  Button,
  Badge,
  FormControl,
  FormLabel,
  Textarea,
  ListItem,
  UnorderedList,
  Input,
  FormHelperText,
  Checkbox,
  useToast,
  Text,
} from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { Head } from '../../components/layout/Head'
import { useState, useEffect } from 'react'
import { useEthersSigner, useEthersProvider } from '../../hooks/ethersAdapter'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi, ERC20_CONTRACT_ABI, ERC20_CONTRACT_ADRESS } from '../../utils/config'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { HeadingComponent } from 'components/layout/HeadingComponent'

// const baseUrl = 'https://www.tally.xyz/gov/' + TALLY_DAO_NAME + '/proposal/'

export default function Manifesto() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('0')
  const [title, setTitle] = useState('Manifesto update')
  const [newManifesto, setNewManifesto] = useState('https://bafkreifnnreoxxgkhty7v2w3qwiie6cfxpv3vcco2xldekfvbiem3nm6dm.ipfs.w3s.link/ ')
  const [targets, setTargets] = useState('')
  const [description, setDescription] = useState("Let's edit the manifesto!")
  const [encryptionRequested, setEncryptionRequested] = useState(false)
  const [name, setName] = useState('')
  const [plaintext, setPlaintext] = useState('')
  const [initialized, setInitialized] = useState(true)
  const [manifesto, setManifesto] = useState('')

  const toast = useToast()
  const router = useRouter()
  const provider = useEthersProvider()
  const signer = useEthersSigner()

  useEffect(() => {
    const init = async () => {
      if (!signer) {
        return
      }
      getManifesto()
      setInitialized(true)
    }
    init()
  }, [signer])

  const getManifesto = async () => {
    const userAddress = await signer?.getAddress()
    console.log('userAddress:', userAddress)
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const manifesto = await gov.manifesto()
    console.log('manifesto CID:', manifesto)
    // const manifestoContent = await (await fetch('https://' + manifesto + '.ipfs.w3s.link/manifesto.md')).text()
    const manifestoContent = await (await fetch(manifesto)).text()
    console.log('manifestoContent:', manifestoContent.substring(manifestoContent.indexOf('\n')))
    setManifesto(manifestoContent)
  }

  const submitProposal = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    console.log('submitProposal triggered')
    // console.log('file name:', name)
    console.log('encryptionRequested:', encryptionRequested)

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
      const setManifesto = gov.interface.encodeFunctionData('setManifesto', [newManifesto])
      const calldatas = [setManifesto.toString()]

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

      PROPOSAL_DESCRIPTION = PROPOSAL_DESCRIPTION

      // set targets and values
      const values = [0]

      console.log(amount)
      console.log(description)
      setAmount(amount)

      console.log('encryptionRequested:', encryptionRequested)

      // delegate to self before calling propose
      await delegateToMyself()

      // call propose
      console.log('caller address:', await signer?.getAddress())
      const propose = await gov.propose([GOV_CONTRACT_ADDRESS], values, calldatas, PROPOSAL_DESCRIPTION)
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
        <Heading as="h2">Manifesto</Heading>
        <br />
        <Text>
          <ReactMarkdown>{manifesto}</ReactMarkdown>
        </Text>
        <br />
        <br />
        <br />

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

          {!loading ? (
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
