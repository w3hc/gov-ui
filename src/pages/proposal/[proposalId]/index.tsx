import { Heading, Button, Badge } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { Head } from '../../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import {
  GOV_CONTRACT_ADDRESS,
  GOV_CONTRACT_ABI,
  TALLY_DAO_NAME,
  MEDUSA_ORACLE_CONTRACT_ADDRESS,
  MEDUSA_CLIENT_APP_CONTRACT_ADDRESS,
  meduasaClientAbi,
} from '../../../utils/config'
import { useRouter } from 'next/router'
import { Medusa } from '@medusa-network/medusa-sdk'
import { Base64 } from 'js-base64'

export default function Create() {
  const router = useRouter()
  const proposalId = router.query.proposalId as string
  const tallyLink = 'https://www.tally.xyz/gov/' + TALLY_DAO_NAME + '/proposal/' + proposalId

  const [block, setBlock] = useState(0)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [state, setState] = useState<any>()
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState(null)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [decryptedFile, setDecryptedFile] = useState('')
  const [isDecrypted, setIsDecrypted] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const proposalState = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']

  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)

  const medusaClient = new ethers.Contract(MEDUSA_CLIENT_APP_CONTRACT_ADDRESS, meduasaClientAbi, signer)

  const getBlock = async () => {
    const blockNumber = await provider.getBlockNumber()
    setBlock(blockNumber)
    return blockNumber
  }

  const getState = async (proposalId) => {
    const state = await gov.state(proposalId)
    setState(
      <Badge ml="1" fontSize="0.5em" colorScheme="purple" variant="solid">
        {proposalState[state]}
      </Badge>
    )
  }

  const decrypt = async () => {
    console.log('decrypt triggered...')
    setLoading(true)

    if (isEncrypted === true) {
      // Medusa init
      const medusa = await Medusa.init(MEDUSA_ORACLE_CONTRACT_ADDRESS, signer)
      console.log('medusa init:', medusa)

      // get buyer public key
      const keypair = await medusa.signForKeypair()
      const buyerPublicKey = keypair.pubkey.toEvm()
      console.log('buyer public key:', buyerPublicKey)

      // calling buyListing (client app contract)
      const buyListing = await medusaClient.buyListing(uri, buyerPublicKey)
      console.log('tx hash:', 'https://goerli.arbiscan.io/tx/' + buyListing.hash)
      console.log('Waiting for 5 confirmations...')
      await buyListing.wait(5)
      console.log('buyListing.blockNumber:', buyListing.blockNumber)

      // get requestId from url
      const requestId = await medusaClient.requests(uri)
      const requestIdFormatted = parseInt(requestId)

      // get ciphertext from mapping (requestId)
      const ciphertext = await medusaClient.ciphers(requestIdFormatted)
      console.log('ciphertext:', ciphertext)

      // download and read encrypted data from url
      const myBlob = await fetch(uri)
      let result = null
      if (myBlob.ok) {
        result = await myBlob.text()
      }
      console.log('blob', myBlob)
      const blob = Base64.toUint8Array(result)

      // medusa.decrypt
      try {
        const plaintextBytes = await medusa.decrypt(ciphertext, blob)
        console.log('✅ decrypt done')

        if (plaintextBytes) {
          // from bytes to plaintext
          const plaintextString = new TextDecoder().decode(plaintextBytes)
          console.log('plaintextString:', plaintextString)
          setDecryptedFile(plaintextString)
        } else {
          setDecryptedFile('https://bafybeigetzcsf4vww5pcqonij6o7pctktuxlandszjylw5p3zot5hgyeea.ipfs.w3s.link/lode-runner.png')
        }

        setIsDecrypted(true)
        setLoading(false)
      } catch (error) {
        console.error('Error decrypt: ', error)
      }
    }
  }

  const getProposalData = useCallback(async () => {
    getBlock()

    if (block > 1) {
      const proposals = await gov.queryFilter('ProposalCreated' as any, 5702215, block)

      try {
        let i: number = 0

        if (proposals[0].args != undefined) {
          for (i; i < Number(proposals.length); i++) {
            const id = String(proposals[i].args?.proposalId)

            if (id == proposalId) {
              setTitle(proposals[i].args[8].substring(proposals[i].args[8][0] == '#' ? 2 : 0, proposals[i].args[8].indexOf('\n')))
              setDescription(proposals[i].args[8].substring(proposals[i].args[8].indexOf('\n'), proposals[i].args[8].indexOf('[')))
              setUri(proposals[i].args[8].substring(proposals[i].args[8].indexOf('(') + 1, proposals[i].args[8].indexOf(')')))
              await getState(proposals[i].args?.proposalId)
              if (proposals[i].args[8].substring(proposals[i].args[8].indexOf(')') + 2) === 'encrypted') {
                setIsEncrypted(true)
              } else {
                setIsEncrypted(false)
              }
              setInitialized(true)
              console.log('original description:', proposals[i].args[8])
            }
          }
        }
      } catch (error) {
        console.error('error:', error)
      }
    }
  }, [block])

  useEffect(() => {
    getProposalData()
    console.log('[init] uri:', uri)
    console.log('[init] isEncrypted:', isEncrypted)
    console.log('[init] initialized:', initialized)
  }, [getProposalData])

  return (
    <>
      <Head />

      <main>
        <div>
          {initialized === true ? (
            <>
              <Heading as="h2">{title}</Heading>
              <p>
                {state} |{' '}
                <a href={tallyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#45a2f8' }}>
                  <strong> View on Tally</strong>
                </a>
              </p>
              <div>
                <br />
                <p>{description}</p>

                <br />

                {uri ? (
                  isEncrypted == true ? (
                    <>
                      {decryptedFile === '' ? (
                        <>
                          <div style={{ borderRadius: '15px', overflow: 'hidden' }}>
                            <Image
                              priority
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                width: 'auto',
                              }}
                              width="350"
                              height="350"
                              alt={'uri'}
                              src={
                                decryptedFile === ''
                                  ? 'https://bafybeifk3jjwguug5avwjfi2qxnh5lcq6dhpwf4h333gac6edd3irbylve.ipfs.w3s.link/carre-blanc.png'
                                  : decryptedFile
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <div style={{ borderRadius: '15px', overflow: 'hidden' }}>
                          <Image
                            priority
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              width: 'auto',
                            }}
                            width="350"
                            height="350"
                            alt={'uri'}
                            src={
                              decryptedFile === ''
                                ? 'https://bafybeifk3jjwguug5avwjfi2qxnh5lcq6dhpwf4h333gac6edd3irbylve.ipfs.w3s.link/carre-blanc.png'
                                : decryptedFile
                            }
                          />
                        </div>
                      )}

                      {isDecrypted ? (
                        ''
                      ) : (
                        <>
                          <p style={{ color: 'red' }}>
                            <small>
                              <strong>This file is only accessible to the DAO members.</strong>
                            </small>
                          </p>
                          <br />

                          <div>
                            {!loading ? (
                              <Button onClick={decrypt} colorScheme="green" variant="outline">
                                Decrypt
                              </Button>
                            ) : (
                              <Button isLoading loadingText="Decrypting..." onClick={decrypt} colorScheme="green" variant="outline">
                                Decrypt
                              </Button>
                            )}
                            <br />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Image priority width="400" height="400" alt={'uri'} src={uri} />
                    </>
                  )
                ) : (
                  <p>No document attached.</p>
                )}
              </div>

              <br />
            </>
          ) : (
            <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
          )}
        </div>
      </main>
    </>
  )
}
