import { Heading, Button, Badge, Flex, useToast, Link } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { useState, useEffect, useCallback } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../utils/erc20'
import { useEthersSigner, useEthersProvider } from '../hooks/ethersAdapter'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi } from '../utils/config'
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
      if (chain?.id !== 11155111) {
        switchNetwork?.(11155111)
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
    // console.log('getProposals started')
    if (block > 1) {
      // console.log('if (block > 1)')

      const proposals: any = await gov.queryFilter('ProposalCreated' as any, 5065858, block) // TODO: fix type casting

      try {
        let i: number = 0
        let proposalsRaw = proposal

        // console.log('proposals:', proposals[0]) // https://github.com/ethers-io/ethers.js/issues/487#issuecomment-1722195086

        // console.log((<EventLog>proposals[0]).args)

        // if (“args” in proposals[0]) { console.log(proposals[0]).args; }

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
      // console.log('userAddress:', userAddress)

      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
      const nftAddress = await gov.token()
      // console.log('nftAddress:', nftAddress)
      // console.log('nftAbi:', nftAbi)
      // console.log('provider:', provider)

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

  // useEffect(() => {
  //   checkMembership()
  // }, [signer])

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
          <Heading as="h2">{name}</Heading>
        </>
        <br />
        <p>
          DAO contract address:{' '}
          <strong>
            <a
              style={{ color: '#45a2f8' }}
              target="_blank"
              rel="noopener noreferrer"
              href={'https://sepolia.etherscan.io/address/' + GOV_CONTRACT_ADDRESS + '#code'}>
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
      </main>
    </>
  )
}
