import { Heading, Button, FormControl, FormLabel, Textarea, Input, FormHelperText, useToast, UnorderedList, ListItem } from '@chakra-ui/react'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { Head } from '../components/layout/Head'
import { useState, useEffect } from 'react'
import { useSigner, useProvider, useNetwork, useAccount } from 'wagmi'
import { ethers, ContractFactory } from 'ethers'
import { NFT_ABI, NFT_BYTECODE, GOV_ABI, GOV_BYTECODE } from '../utils/config'
import { UploadFile } from '../components/layout/UploadFile'
import { UploadData } from '../components/layout/UploadData'
import { UploadUserData } from '../components/layout/UploadUserData'
import { useRouter } from 'next/router'
import { LinkComponent } from '../components/layout/LinkComponent'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function Index() {
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDeployed, setIsDeployed] = useState('')
  const [daoName, setDaoName] = useState('Thistles Collective')
  const [missionStatement, setMissionStatement] = useState('We want to protect the thistles.')

  const [fileName, setFileName] = useState(null)
  const [votingPeriod, setVotingPeriod] = useState('10000')
  const [votingDelay, setVotingDelay] = useState('1')
  const [votingThreshold, setVotingThreshold] = useState('1')
  const [quorum, setQuorum] = useState('20')
  const [nftName, setNftName] = useState(daoName + ' Membership NFT')
  const [nftSymbol, setNftSymbol] = useState('THISTLES')
  const [nftAttributes, setNftAttributes] = useState('1')
  const [plaintext, setPlaintext] = useState(null)
  const [daoInfo, setDaoInfo] = useState({ govAddress: '', govBlock: 0, nftAddress: '', nftBlock: 0 })

  const router = useRouter()
  const { data: signer, isError, isLoading } = useSigner()
  const { chain } = useNetwork()
  const toast = useToast()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [firstMembers, setFirstMembers] = useState<any>([
    address,
    '0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977',
    '0xe61A1a5278290B6520f0CEf3F2c71Ba70CF5cf4C',
  ])
  function App() {
    const provider = useProvider()
  }

  const deployDao = async (e: any) => {
    e.preventDefault()

    try {
      setLoading(true)
      console.log('Deployment started...')
      console.log('daoName:', daoName)
      console.log('missionStatement:', missionStatement)
      console.log('firstMembers:', firstMembers)
      console.log('fileName:', fileName)
      console.log('votingPeriod:', votingPeriod)
      console.log('votingDelay:', votingDelay)
      console.log('votingThreshold:', votingThreshold)
      console.log('quorum:', quorum)
      console.log('nftName:', nftName)
      console.log('nftSymbol:', nftSymbol)
      console.log('nftAttributes:', nftAttributes)

      const uri = await makeNftMetadata()

      console.log('chain:', chain)

      // Deploy the NFT contract
      const nftFactory = new ContractFactory(NFT_ABI, NFT_BYTECODE, signer)
      const nft = await nftFactory.deploy(firstMembers, uri)
      console.log('tx:', nft.deployTransaction)
      console.log('NFT contract address:', nft.address)
      const nftDeployment = await nft.deployTransaction.wait(1)
      console.log('NFT contract deployed ✅')
      console.log('nft:', nft)
      console.log('nft.deployTransaction:', nft.deployTransaction)

      // Deploy the Gov contract
      const manifestoContent = '# ' + daoName + ' Manifesto ## Statement of intent ' + '**' + missionStatement + '**'
      const manifesto = UploadData(manifestoContent, 'manifesto.md')
      const govFactory = new ContractFactory(GOV_ABI, GOV_BYTECODE, signer)
      const gov = await govFactory.deploy(nft.address, manifesto, daoName, votingDelay, votingPeriod, votingThreshold, quorum)
      console.log('Gov deployment tx:', gov.deployTransaction)
      console.log('Gov contract address:', gov.address)
      const govDeployment = await gov.deployTransaction.wait(1)
      console.log('Gov contract deployed ✅')

      // Transfer ownership to the DAO
      const ownershipTransfer = await nft.transferOwnership(gov.address)
      const receipt = await ownershipTransfer.wait()
      console.log('\nNFT contract ownership transferred to the DAO', '✅')
      toast({
        title: 'Success!',
        description: 'Your DAO is deployed at ' + nft.address,
        status: 'success',
        duration: 20000,
        isClosable: true,
      })
      setLoading(false)
      setIsDeployed(gov.address)
      setDaoInfo({
        govAddress: gov.address,
        govBlock: govDeployment.blockNumber,
        nftAddress: nft.address,
        nftBlock: nftDeployment.blockNumber,
      })
    } catch (e) {
      console.log('error:', e)
      console.log('e.message:', e.message)
      toast({
        title: 'Tx failed',
        description: e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  const handleDaoNameChange = (newName: any) => {
    setNftName(newName + ' Membership NFT')
    setDaoName(newName)
    setNftSymbol(newName.substring(0, 3).toUpperCase())
  }

  const makeNftMetadata = async () => {
    let nftImageCid: any
    console.log('plaintext:', plaintext)
    console.log('fileName:', fileName)

    if (fileName) {
      nftImageCid = 'https://bafybeichjaz2dxyvsinz2nx4ho4dmx3qkgvtkitymaeh7jsguhrpbknsru.ipfs.w3s.link/thistle-black-pixel.jpg'
    } else {
      nftImageCid = 'https://bafybeichjaz2dxyvsinz2nx4ho4dmx3qkgvtkitymaeh7jsguhrpbknsru.ipfs.w3s.link/thistle-black-pixel.jpg'
    }
    console.log('nftImageCid:', nftImageCid)

    const metadata = {
      name: nftName,
      description: 'The owner of this NFT has a right to vote on the test DAO proposals.',
      image: nftImageCid,
      attributes: [
        {
          trait_type: 'Participation rate (%)',
          value: 'unset',
        },
        {
          trait_type: 'Contribs',
          value: 'unset',
        },
        {
          trait_type: 'DAO',
          value: 'unset',
        },
        {
          trait_type: 'Nickname',
          value: 'unset',
        },
        {
          trait_type: 'Role',
          value: 'unset',
        },
        {
          trait_type: 'Tally URL',
          value: 'unset',
        },
      ],
    }

    console.log('metadata:', metadata)

    return UploadData(metadata, 'metadata.json')
  }

  const handleFileChange = (event: any) => {
    const file = event
    setFileName(file.name)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const plaintext = event.target?.result as string
      setPlaintext(plaintext)
    }
    reader.onerror = (error) => {
      console.log('File Input Error: ', error)
    }
  }

  return (
    <>
      <Head />

      <main>
        {isDeployed !== '' ? (
          <>
            <Heading as="h3" size="lg">
              {daoName}
            </Heading>
            <br />
            <Heading as="h4" size="md">
              Governor
            </Heading>
            <br />

            <UnorderedList>
              <ListItem>
                Governor address: <strong>{daoInfo.govAddress}</strong>
              </ListItem>
              <ListItem>
                Network: <strong>{chain.name}</strong>
              </ListItem>
              <ListItem>
                Type: <strong>Open Zeppelin Governor</strong>
              </ListItem>
              <ListItem>
                Start Block: <strong>{daoInfo.govBlock}</strong>
              </ListItem>
            </UnorderedList>
            <br />
            <Heading as="h4" size="md">
              Token
            </Heading>
            <br />

            <UnorderedList>
              <ListItem>
                Token address: <strong>{daoInfo.nftAddress}</strong>
              </ListItem>
              <ListItem>
                Type / DAO Standard: <strong>ERC721</strong>
              </ListItem>
              <ListItem>
                Start Block: <strong>{daoInfo.nftBlock}</strong>
              </ListItem>
            </UnorderedList>
            <br />
            <LinkComponent href="https://www.tally.xyz/add-a-dao">
              <Button mt={4} colorScheme="blue" variant="outline" type="submit">
                Add your DAO to Tally &nbsp; <ExternalLinkIcon />
              </Button>
            </LinkComponent>
          </>
        ) : (
          <>
            <Heading as="h2">Deploy your DAO</Heading>
            <br />{' '}
            {chain ? (
              <>
                <p>
                  <i>
                    You&apos;re about to deploy your own DAO to <strong>{chain.name}</strong>. This means you&apos;ll deploy <strong>two</strong>{' '}
                    Solidity contracts: a membership NFT contract (ERC-721) and a Governor contract. Once deployed, you&apos;ll be able to add it in
                    Tally.
                  </i>{' '}
                </p>
                <br />
              </>
            ) : (
              <>
                <p style={{ color: 'red' }}>Please connect your wallet.</p>
                <br />
              </>
            )}
            <p>
              Feel free to{' '}
              <LinkComponent href="https://w3hc.github.io/gov-docs/deployment.html#deployment">
                <strong>read the docs</strong>
              </LinkComponent>{' '}
              to learn more about what&apos;s required to deploy.
            </p>
            <br />
            <FormControl>
              <FormLabel>DAO Name</FormLabel>
              <Input value={daoName} onChange={(e) => handleDaoNameChange(e.target.value)} placeholder="Butterfly Collective" />
              <br />
              <br />
              <FormLabel>Mission statement</FormLabel>
              <Textarea value={missionStatement} onChange={(e) => setMissionStatement(e.target.value)} placeholder={missionStatement} />
              <br />
              <br />
              <FormLabel>First members wallet adresses</FormLabel>
              <Input value={firstMembers} onChange={(e) => setFirstMembers(e.target.value)} placeholder={firstMembers} />
              <FormHelperText>These wallets will receive the membership NFT.</FormHelperText>
              {/*<br />

          <FormLabel>DAO Membership NFT image</FormLabel>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            style={{ minWidth: '400px', width: '100%' }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          /> */}

              {!showAdvanced && (
                <>
                  <br />
                  <br />
                  <Button rightIcon={<ArrowDownIcon />} colorScheme="red" size="xs" onClick={() => setShowAdvanced(!showAdvanced)}>
                    Advanced
                  </Button>
                </>
              )}

              {showAdvanced && (
                <>
                  <br />
                  <br />

                  <FormLabel>Voting period</FormLabel>
                  <Input value={votingPeriod} onChange={(e) => setVotingPeriod(e.target.value)} placeholder={votingPeriod} />
                  <br />
                  <br />
                  <FormLabel>Voting delay</FormLabel>
                  <Input value={votingDelay} onChange={(e) => setVotingDelay(e.target.value)} placeholder={votingDelay} />
                  <br />
                  <br />
                  <FormLabel>Voting threshold</FormLabel>
                  <Input value={votingThreshold} onChange={(e) => setVotingThreshold(e.target.value)} placeholder={votingThreshold} />
                  <br />
                  <br />
                  <FormLabel>Quorum</FormLabel>
                  <Input value={quorum} onChange={(e) => setQuorum(e.target.value)} placeholder={quorum} />
                  <br />
                  <br />
                  <FormLabel>NFT name</FormLabel>
                  <Input value={nftName} onChange={(e) => setNftName(e.target.value)} placeholder={nftName} />
                  <FormHelperText>What&apos;s the name of the membership NFT?</FormHelperText>
                  <br />
                  <FormLabel>NFT symbol</FormLabel>
                  <Input value={nftSymbol} onChange={(e) => setNftSymbol(e.target.value)} placeholder={nftSymbol} />
                  <FormHelperText>What&apos;s the symbol of the membership NFT?</FormHelperText>
                  {/* <br /> */}
                  <Link hidden href="/deploy">
                    Deploy
                  </Link>
                  {/* <FormLabel>Contribs (NFT attributes)</FormLabel>
              <Input value={nftAttributes} onChange={(e) => setNftAttributes(e.target.value)} placeholder={nftAttributes} />
              <FormHelperText>Only one attribute on this version. The membership NFT metadata can be edited in the future.</FormHelperText> */}
                  {showAdvanced && (
                    <>
                      <br />
                      <Button rightIcon={<ArrowUpIcon />} colorScheme="red" size="xs" onClick={() => setShowAdvanced(!showAdvanced)}>
                        Hide details
                      </Button>
                    </>
                  )}
                </>
              )}
            </FormControl>
            <br />
            {!loading ? (
              <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={deployDao}>
                Deploy
              </Button>
            ) : (
              <Button isLoading loadingText="Deploying..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={deployDao}>
                Deploy
              </Button>
            )}
          </>
        )}
      </main>
    </>
  )
}
