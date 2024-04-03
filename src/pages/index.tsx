import { Heading, Button, Badge, Flex, useToast, Link, Box } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { useState, useEffect, useCallback } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../utils/erc20'
import { useEthersSigner, useEthersProvider } from '../hooks/ethersAdapter'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, startBlock, nftAbi } from '../utils/config'
import Image from 'next/image'

export default function Home() {
  const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const toast = useToast()
  const { address, isConnecting, isDisconnected } = useAccount()

  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  // const [signer, setSigner] = useState<any>()
  // const [provider, setProvider] = useState<any>()
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
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
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  const [isMember, setIsMember] = useState(false)

  const baseUrl = '/proposal/'

  const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)

  useEffect(() => {
    const init = async () => {
      if (chain?.id !== 11155420) {
        switchNetwork?.(11155420)
      }
      getBlock()
      getName()
      getManifesto()
      checkMembership()
    }
    init()

    console.log('DAO Contract address:', GOV_CONTRACT_ADDRESS)
  }, [signer])

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
    // console.log('manifestoCall:', manifestoCall)
    if (manifestoCall === '') {
      setManifesto('[unset]')
      setManifestoLink('https://bafkreifnnreoxxgkhty7v2w3qwiie6cfxpv3vcco2xldekfvbiem3nm6dm.ipfs.w3s.link/')
    } else {
      setManifesto(manifestoCall)
      // setManifestoLink('https://' + manifestoCall + '.ipfs.w3s.link/manifesto.md')
      setManifestoLink(manifestoCall)
    }
  }, [])

  const getState = async (proposalId: any) => {
    return await gov.state(proposalId)
  }

  const getProposals = useCallback(async () => {
    console.log('getProposals started')
    if (block > 1) {
      try {
        // console.log('if (block > 1)')
        // console.log('check 1')

        // console.log('gov:', gov)
        console.log('block:', block)
        console.log('startBlock:', startBlock)
        console.log('block - startBlock:', block - startBlock)

        const proposals: any = await gov.queryFilter('ProposalCreated' as any, startBlock, block)

        let i: number = 0
        let proposalsRaw = proposal

        // console.log('proposals:', proposals[0]) // https://github.com/ethers-io/ethers.js/issues/487#issuecomment-1722195086

        // console.log((<EventLog>proposals[0]).args)

        // if (“args” in proposals[0]) { console.log(proposals[0]).args; }
        // console.log('check 3: ' + proposals[0]?.args?.description)

        if (proposals[0].args != undefined) {
          // console.log('hello')
          // console.log('Number(proposals.length:', Number(proposals.length))
          for (i = 0; i < Number(proposals.length); i++) {
            // console.log('iterations (in loop):', i)
            // console.log('proposalsRaw:', proposalsRaw)
            // console.log('proposals (in loop):', proposals)
            // console.log('DESC:', proposals[i].args?.description)
            console.log('proposals[i].args?.description:', proposals[i].args.description)
            proposalsRaw.push(
              ...[
                {
                  id: String(proposals[i]?.args[0]),
                  link: baseUrl + String(proposals[i]?.args[0]),
                  title: proposals[i].args?.description.substring(
                    proposals[i].args?.description == '#' ? 2 : 2,
                    proposals[i].args?.description.indexOf('\n')
                  ),
                  state: Number(await getState(proposals[i]?.args[0])),
                },
              ]
            )
          }
          delete proposal[0]
          setProposal(proposalsRaw)
          console.log('proposalsRaw:', proposalsRaw)
          console.log('proposal:', proposal)
          console.log('getProposals ended')
          setInitialized(true)
        }
      } catch (error) {
        console.log('getProposals error:', error)
      }
    }
  }, [block])

  const checkMembership = async () => {
    if (!signer) {
      return
    }
    try {
      const userAddress = await signer?.getAddress()

      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
      const nftAddress = await gov.token()

      const nft = new ethers.Contract(nftAddress, nftAbi, provider)
      const call3 = await nft.balanceOf(userAddress)
      if (call3 == 1) {
        setIsMember(true)
      } else {
        setIsMember(false)
      }
    } catch (e) {
      console.log('checkMembership error:', e)
    }
  }

  useEffect(() => {
    getProposals()
  }, [getProposals])

  // const mint = async () => {
  //   try {
  //     if (!signer) {
  //       toast({
  //         title: 'No wallet',
  //         description: 'Please connect your wallet first.',
  //         status: 'error',
  //         position: 'bottom',
  //         variant: 'subtle',
  //         duration: 9000,
  //         isClosable: true,
  //       })
  //       return
  //     }
  //     setIsLoading(true)
  //     setTxHash('')
  //     setTxLink('')
  //     const erc20 = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)
  //     const call = await erc20.mint(ethers.parseEther('10000'))
  //     const receipt = await call.wait()
  //     console.log('tx:', receipt)
  //     setTxHash(receipt.hash)
  //     setTxLink('https://sepolia.etherscan.io/tx/' + receipt.hash)
  //     setIsLoading(false)
  //     toast({
  //       title: 'Successful mint',
  //       description: 'Congrats, 10,000 BASIC tokens were minted and sent to your wallet! 🎉',
  //       status: 'success',
  //       position: 'bottom',
  //       variant: 'subtle',
  //       duration: 20000,
  //       isClosable: true,
  //     })
  //   } catch (e) {
  //     setIsLoading(false)
  //     console.log('error:', e)
  //     toast({
  //       title: 'Woops',
  //       description: 'Something went wrong during the minting process...',
  //       status: 'error',
  //       position: 'bottom',
  //       variant: 'subtle',
  //       duration: 9000,
  //       isClosable: true,
  //     })
  //   }
  // }

  function Item(props: any) {
    return (
      <>
        <div className="">
          <Box mt={3} fontSize="lg">
            {' '}
            {/* You can adjust the value of fontSize to other Chakra UI size values (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl) or use
            custom values (e.g., "20px", "2rem") as per your requirements. */}
            <strong>
              <Link style={{ color: '#45a2f8' }} target="blank" href={props.link}>
                {props.title}
              </Link>
            </strong>{' '}
            <Badge ml="1" fontSize="0.5em" colorScheme={stateColor[props.state]} variant="solid">
              {stateText[props.state]}
            </Badge>
          </Box>
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
          <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
        )}
      </div>
    )
  }

  return (
    <>
      <Head />

      <main>
        <>
          <HeadingComponent as="h2">{name}</HeadingComponent>
        </>
        <br />
        <p>
          DAO contract address:{' '}
          <strong>
            <a
              style={{ color: '#45a2f8' }}
              target="_blank"
              rel="noopener noreferrer"
              href={'https://sepolia-optimism.etherscan.io/address/' + GOV_CONTRACT_ADDRESS + '#code'}>
              {GOV_CONTRACT_ADDRESS}
            </a>
          </strong>
        </p>
        {/* <p>
          Manifesto:{' '}
          <strong>
            <a style={{ color: '#45a2f8' }} target="_blank" rel="noopener noreferrer" href={manifestoLink}>
              {manifesto}
            </a>
          </strong>
        </p> */}
        <br />
        <HeadingComponent as="h3">Proposals</HeadingComponent>
        <List />
        <br />
        <br />
        <LinkComponent href="/push">
          <Button rightIcon={<AddIcon />} colorScheme="green" variant="outline">
            ETH transfer
          </Button>
          <br />
        </LinkComponent>
        <LinkComponent href="/erc20">
          <Button mt={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
            ERC-20 transfer
          </Button>
          <br />
        </LinkComponent>
        <LinkComponent href="/add-member">
          <Button mt={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
            Add a new member
          </Button>
          <br />
        </LinkComponent>
        <LinkComponent href="/ban-member">
          <Button mt={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
            Ban a member
          </Button>
          <br />
        </LinkComponent>
        <LinkComponent href="/manifesto">
          <Button mt={5} rightIcon={<AddIcon />} colorScheme="green" variant="outline">
            Edit the manifesto
          </Button>
          <br />
        </LinkComponent>
      </main>
    </>
  )
}
