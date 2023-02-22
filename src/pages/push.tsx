import { Heading, Button, Badge, FormControl, FormLabel, Textarea, ListItem, UnorderedList, Input, FormHelperText, Checkbox } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { Head } from '../components/layout/Head'
import { useState } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import {
  GOV_CONTRACT_ADDRESS,
  GOV_CONTRACT_ABI,
  TALLY_DAO_NAME,
  MEDUSA_ORACLE_CONTRACT_ADDRESS,
  MEDUSA_CLIENT_APP_CONTRACT_ADDRESS,
  meduasaClientAbi,
} from '../../src/utils/config'
import { UploadFile } from '../components/layout/UploadFile'
import { UploadData } from '../components/layout/UploadData'
import { useRouter } from 'next/router'
import { Medusa } from '@medusa-network/medusa-sdk'
import { Base64 } from 'js-base64'

const baseUrl = 'https://www.tally.xyz/gov/' + TALLY_DAO_NAME + '/proposal/'

export default function Create() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('0.00001')
  const [title, setTitle] = useState('One more cool contrib')
  const [beneficiary, setBeneficiary] = useState('0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977')
  const [description, setDescription] = useState(
    'Desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc...'
  )
  const [encryptionRequested, setEncryptionRequested] = useState(true)
  const [name, setName] = useState(null)
  const [plaintext, setPlaintext] = useState(null)

  const router = useRouter()
  const { data: signer, isError, isLoading } = useSigner()
  const provider = useProvider()

  const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)

  const submitProposal = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    console.log('submitProposal triggered')
    console.log('file name:', name)
    console.log('encryptionRequested:', encryptionRequested)

    let fileToAddInDescription: string = ''
    let plaintextString = ''

    if (encryptionRequested === true) {
      try {
        e.preventDefault()

        console.log('encrypt start //////////')

        // Medusa init
        console.log('signer:', signer)

        const medusa = await Medusa.init(MEDUSA_ORACLE_CONTRACT_ADDRESS, signer)
        console.log('medusa:', medusa)

        // prepare medusa client (https://github.com/w3hc/private-doc/blob/main/contracts/PrivateDoc.sol)
        const medusaClient = new ethers.Contract(MEDUSA_CLIENT_APP_CONTRACT_ADDRESS, meduasaClientAbi, signer)

        // get plaintextBytes
        plaintextString = plaintext
        console.log('plaintextString:', plaintextString)
        const plaintextBytes = new TextEncoder().encode(plaintextString)
        console.log('plaintextBytes:', plaintextBytes)

        // medusa.encrypt
        const { encryptedData, encryptedKey } = await medusa.encrypt(plaintextBytes, MEDUSA_CLIENT_APP_CONTRACT_ADDRESS)

        console.log('encryptedData:', encryptedData)
        console.log('encryptedKey:', encryptedKey)

        // to Base64
        const encryptedDataBase64 = Base64.fromUint8Array(encryptedData)

        // upload (Web3.Storage)
        const ipfsUrl = await UploadData(encryptedDataBase64, name)
        console.log('ipfsUrl:', ipfsUrl)
        fileToAddInDescription = ipfsUrl

        console.log('[before medusaCall] encryptedKey', encryptedKey)

        // medusa call
        const medusaCall = await medusaClient.createListing(encryptedKey, ipfsUrl)
        console.log('[after medusaCall] medusaCall:', medusaCall)
        console.log('tx hash:', 'https://goerli.arbiscan.io/tx/' + medusaCall.hash)
      } catch (e) {
        console.log('error:', e)
      }
    } else {
      console.log('[no encryption] plaintext:', plaintext)
      console.log('[no encryption] name:', name)

      // if encryption is not requested, upload the file to ipfs
      fileToAddInDescription = await UploadFile(plaintext, name)
      console.log('[no encryption] fileToAddInDescription:', fileToAddInDescription)
    }

    try {
      // prepare Gov
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)

      // prepare calldatas
      const call = '0x'
      const calldatas = [call.toString()]

      // prepare proposal description
      let PROPOSAL_DESCRIPTION: string
      console.log('fileToAddInDescription:', fileToAddInDescription)
      console.log('encryptionRequested:', encryptionRequested)
      console.log('plaintextString:', plaintextString)

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
          PROPOSAL_DESCRIPTION = '' + title + '\n' + description + ''
        }
      } else {
        PROPOSAL_DESCRIPTION = '' + title + '\n' + description + ''
      }

      console.log('PROPOSAL_DESCRIPTION:', PROPOSAL_DESCRIPTION)

      // set targets and values
      const targets = [beneficiary]
      const values = [ethers.utils.parseEther(amount)]

      console.log(amount)
      console.log(description)
      setAmount(amount)

      console.log('encryptionRequested:', encryptionRequested)

      // call propose
      const propose = await gov.propose(targets, values, calldatas, PROPOSAL_DESCRIPTION)
      console.log('Propose triggered')
      const proposeReceipt = await propose.wait(1)
      const proposalId = proposeReceipt.events![0].args!.proposalId.toString()
      console.log('proposalId:', proposalId)
      console.log('Tally link:', baseUrl + proposalId)
      const targetURL = '/proposal/' + proposalId
      setLoading(false)
      router.push(targetURL)
    } catch (e) {
      console.log('error:', e)
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
        const plaintext = event.target?.result as string
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

  return (
    <>
      <Head />

      <main>
        <Heading as="h2">Submit a proposal</Heading>
        <br />
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Proposal title" />
          <FormHelperText>How should we refer to your proposal?</FormHelperText>
          <br />
          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="" />
          <br />
          <br />
          <FormLabel>Amount (in ETH)</FormLabel>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1" />
          <br />
          <br />
          <FormLabel>
            Target address <a>(mine)</a>
          </FormLabel>
          <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder={beneficiary} />
          <FormHelperText>How much ETH are you asking for?</FormHelperText>
          <br />
          <FormLabel>File</FormLabel>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            style={{ minWidth: '400px', width: '100%' }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <LockIcon w={3} h={3} color="red.500" />{' '}
          <Checkbox defaultChecked onChange={(e) => setEncryptionRequested(e.target.checked)}>
            Only accessible to DAO members
          </Checkbox>
          <FormHelperText>Your file will be stored encrypted on IPFS (Filecoin)</FormHelperText>
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
