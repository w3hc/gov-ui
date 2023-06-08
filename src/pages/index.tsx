import { Heading, Button, Badge } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Head } from '../components/layout/Head'
import Image from 'next/image'
import Link from 'next/link'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect, useCallback } from 'react'
import { useSigner, useAccount, useBalance, useNetwork, useProvider } from 'wagmi'
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
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['pink', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'green']

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
    const manifestoCall = await gov.manifesto()
    console.log('manifestoCall:', manifestoCall)
    if (manifestoCall === '') {
      setManifesto('[unset]')
      setManifestoLink('https://bafybeihmgfg2gmm23ozur3ylmkxgwkyr5dlpruivv3wjeujrdktxihqe3a.ipfs.w3s.link/manifesto.md')
    } else {
      setManifesto(manifestoCall)
      setManifestoLink('https://' + manifestoCall + '.ipfs.w3s.link/manifesto.md')
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
          for (i = 103; i < Number(proposals.length); i++) {
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
      } else {
        getBlock()
        getName()
        getManifesto()
      }
    }
  }, [chain, getBlock, getName, getManifesto])

  function Item(props) {
    return (
      <>
        <div className="">
          <div>
            <strong>
              <Link style={{ color: '#45a2f8' }} target="blank" href={props.link}>
                {props.title}
              </Link>
            </strong>{' '}
            <Badge ml="1" fontSize="0.5em" colorScheme={stateColor[props.state]} variant="solid">
              {stateText[props.state]}
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
          <Image priority width="200" height="200" alt="loader" src="./reggae-loader.svg" />
        )}
      </div>
    )
  }

  return (
    <>
      <Head />

      <main>
        <>
          <Heading as="h2">{name}</Heading>
        </>
        <br />

        {isDisconnected ? (
          <>
            <br />
            <p>Please connect your wallet.</p>
          </>
        ) : (
          <>
            <p>
              DAO contract address:{' '}
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
            <p>
              Manifesto:{' '}
              <strong>
                <a style={{ color: '#45a2f8' }} target="_blank" rel="noopener noreferrer" href={manifestoLink}>
                  {manifesto}
                </a>
              </strong>
            </p>
            <br />
            <List />
            <br />{' '}
            <LinkComponent href="/push">
              <Button rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                New proposal
              </Button>
              <br />
            </LinkComponent>
          </>
        )}
      </main>
    </>
  )
}
