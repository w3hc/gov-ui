import { Heading, Button, Badge } from '@chakra-ui/react'
// import ExternalLinkIcon from '@chakra-ui/icon'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { Head } from '../components/layout/Head'
import Image from 'next/image'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect, useCallback } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork, useProvider, useSwitchNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI } from '../utils/config'

export default function Home() {
  const [name, setName] = useState<string>('')
  const [block, setBlock] = useState(0)
  const [manifesto, setManifesto] = useState('')
  const [manifestoLink, setManifestoLink] = useState('')
  const [proposal, setProposal] = useState<{ id: string; link: string; title: string; state: number }[]>([
    {
      id: '12345678',
      link: 'http://link.com',
      title: '',
      state: 0,
    },
  ])
  const [initialized, setInitialized] = useState(false)
  const proposalState = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const [pleaseConnect, setPleaseConnect] = useState(false)

  const baseUrl = '/proposal/'

  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: signer } = useSigner()
  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })
  const provider = useProvider()

  const { chain } = useNetwork()
  // const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork()
  const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)

  const getName = useCallback(async () => {
    const name = await gov.name()
    if (name === '') {
      setName('unset')
    } else {
      setName(name)
    }
  }, [])

  const getBlock = useCallback(async () => {
    const blockNumber = await provider.getBlockNumber()
    setBlock(blockNumber)
  }, [])

  const getManifesto = useCallback(async () => {
    const manifesto = await gov.manifesto()
    // console.log('manifesto:', manifesto)
    if (manifesto === '') {
      setManifesto('unset')
      setManifestoLink('https://bafybeihmgfg2gmm23ozur3ylmkxgwkyr5dlpruivv3wjeujrdktxihqe3a.ipfs.w3s.link/manifesto.md')
    } else {
      console.log('manifesto:', manifesto)

      setManifesto(manifesto)
      setManifestoLink('https://' + manifesto + '.ipfs.w3s.link')
    }
  }, [])

  const getState = async (proposalId) => {
    return await gov.state(proposalId)
  }

  const getProposals = useCallback(async () => {
    if (block > 1) {
      const proposals = await gov.queryFilter('ProposalCreated' as any, 5702215, block)
      try {
        let i: number = 0
        let proposalsRaw = proposal
        if (proposals[0].args != undefined) {
          for (i = 93; i < Number(proposals.length); i++) {
            // console.log('proposals[i]:', proposals[i].args[8])
            proposalsRaw.push(
              ...[
                {
                  id: String(proposals[i].args?.proposalId),
                  link: baseUrl + String(proposals[i].args?.proposalId),
                  title: proposals[i].args[8].substring(proposals[i].args[8][0] == '#' ? 2 : 0, proposals[i].args[8].indexOf('\n')),
                  state: await getState(proposals[i].args?.proposalId),
                },
              ]
            )
          }
          delete proposal[0]
          setProposal(proposalsRaw)
          setInitialized(true)
        }
      } catch (error) {
        console.log('error:', error)
      }
    }
  }, [block, proposal])

  useEffect(() => {
    getProposals()
  }, [getProposals, proposal])

  useEffect(() => {
    console.log('chain', chain)
    if (chain !== undefined) {
      console.log('chain !== undefined')

      if (chain.id !== 421613) {
        setWrongNetwork(true)

        // console.log('switchNetwork:', switchNetwork?.name)
      } else {
        getBlock()
        getName()
        getManifesto()
      }
    } else {
      setPleaseConnect(true)
      console.log('setPleaseConnect')
    }
  }, [chain, getBlock, getManifesto, getName])

  function Item(props) {
    return (
      <>
        <div className="">
          <div>
            <strong>
              <a style={{ color: '#45a2f8' }} href={props.link}>
                {props.title}
              </a>
            </strong>{' '}
            <Badge ml="1" fontSize="0.5em" colorScheme="purple" variant="solid">
              {proposalState[props.state]}
            </Badge>
          </div>
        </div>
      </>
    )
  }

  function List() {
    return (
      <div>
        {initialized === true ? (
          proposal.map((p) => <Item key={p.id} title={p.title} state={p.state} id={p.id} link={p.link} />)
        ) : (
          <Image width="100" height="100" alt="loader" src="./reggae-loader.svg" />
        )}
      </div>
    )
  }

  // Wrong network: please switch to <strong>Arbitrum Goerli</strong>.</p>
  // Please <strong>connect your wallet</strong>.</p>

  return (
    <>
      <Head />

      <main>
        <>
          <Heading as="h2">{name}</Heading>
          <br />
          <p>
            Gov contract address:{' '}
            <strong>
              <a
                style={{ color: '#45a2f8' }}
                target="_blank"
                rel="noopener noreferrer"
                href={'https://goerli.arbiscan.io/address/' + GOV_CONTRACT_ADDRESS + '#code'}>
                {GOV_CONTRACT_ADDRESS}
              </a>
            </strong>
          </p>
          <br />
          <br />
          <p>
            Manifesto CID: <a href={manifestoLink}> {manifesto}</a>
          </p>
          <br />
          <LinkComponent href="/push">
            <Button rightIcon={<AddIcon />} colorScheme="green" variant="outline">
              New proposal
            </Button>
            <br />
          </LinkComponent>
          <br />
          <List />
          <br />{' '}
        </>
      </main>
    </>
  )
}
