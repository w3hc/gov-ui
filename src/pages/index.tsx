import { Heading, Button, Badge, Flex } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Head } from '../components/layout/Head'
import Image from 'next/image'
import Link from 'next/link'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect, useCallback } from 'react'
import { useSigner, useAccount, useBalance, useNetwork, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi } from '../utils/config'

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
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  const [isMember, setIsMember] = useState(false)

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
    console.log('getProposals started')
    if (block > 1) {
      console.log('if (block > 1)')

      // const proposals = await gov.queryFilter('ProposalCreated' as any, 15146965, block)
      const proposals = await gov.queryFilter('ProposalCreated' as any, 95771, block)

      try {
        let i: number = 0
        let proposalsRaw = proposal
        console.log('proposals[0].args?.proposalId:', proposals[0])
        if (proposals[0].args != undefined) {
          for (i = 0; i < Number(proposals.length); i++) {
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
  }, [block])

  const checkMembership = async () => {
    try {
      const userAddress = await signer.getAddress()
      console.log('userAddress:', userAddress)

      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
      const dontbelate = new ethers.Contract(await gov.token(), nftAbi, provider)
      const call3 = await dontbelate.balanceOf(userAddress)
      console.log('dontbelate:', Number(call3))
      if (Number(call3) == 1) {
        setIsMember(true)
      } else {
        setIsMember(false)
      }
    } catch (e) {
      console.log('error:', e)
    }
  }

  useEffect(() => {
    getProposals()
  }, [getProposals])

  useEffect(() => {
    checkMembership()
  }, [signer])

  useEffect(() => {
    console.log('chain', chain)
    if (chain !== undefined) {
      console.log('chain !== undefined')
      getBlock()
      getName()
      getManifesto()
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
                {/* {props.title ? props.title : 'yo'} */}
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
          <Image priority width="100" height="100" alt="loader" src="./reggae-loader.svg" />
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

        {isDisconnected || !initialized ? (
          <>
            <br />
            {isDisconnected ? <p>Please connect your wallet.</p> : <Image priority width="100" height="100" alt="loader" src="./reggae-loader.svg" />}
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
                  // href={'https://goerli.arbiscan.io/address/' + GOV_CONTRACT_ADDRESS + '#code'}>
                  href={'https://explorer-test.arthera.net/address/' + GOV_CONTRACT_ADDRESS}>
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
            <Flex as="header" py={5} mb={8} alignItems="center">
              <LinkComponent href="/push">
                <Button rightIcon={<AddIcon />} colorScheme="green" variant="outline">
                  New proposal
                </Button>
                <br />
              </LinkComponent>
              {isMember === false && (
                <LinkComponent href="/join">
                  <Button ml={5} colorScheme="blue" variant="outline">
                    Become a member
                  </Button>
                  <br />
                </LinkComponent>
              )}
            </Flex>
          </>
        )}
      </main>
    </>
  )
}
