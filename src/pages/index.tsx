import * as React from 'react'
import { Heading, Button, Badge, Flex, useToast, Link, Box, Text } from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider, Eip1193Provider, parseEther } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { LinkComponent } from '../components/layout/LinkComponent'
import govContract from '../utils/Gov.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../components/layout/HeadingComponent'
import Image from 'next/image'

export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [name, setName] = useState<string>('')
  const [block, setBlock] = useState(0)
  const [manifesto, setManifesto] = useState('')
  const [manifestoLink, setManifestoLink] = useState('')
  const [proposal, setProposal] = useState<{ id: string; link: string; title: string; state: number }[]>([
    {
      id: '88888',
      link: 'http://link.com',
      title: '88888',
      state: 88888,
    },
  ])
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  const [isMember, setIsMember] = useState(false)

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  // const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()

  const baseUrl = '/proposal/'

  useEffect(() => {
    console.log('DAO Contract address:', govContract.address)
  }, [])

  const getBal = async () => {
    if (isConnected) {
      const ethersProvider = new BrowserProvider(provider as any)
      const balance = await ethersProvider.getBalance(address as any)
      const ethBalance = ethers.formatEther(balance)
      if (ethBalance !== '0') {
        return Number(ethBalance)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  const getName = async () => {
    const ethersProvider = new BrowserProvider(walletProvider as any)
    const gov = new ethers.Contract(govContract.address, govContract.abi, ethersProvider)
    const name = await gov.name()
    if (name === '') {
      return 'no name'
    } else {
      return name
    }
  }

  const getState = async (proposalId: any) => {
    const ethersProvider = new BrowserProvider(provider as any)
    const gov = new ethers.Contract(govContract.address, govContract.abi, ethersProvider)
    return await gov.state(proposalId)
  }

  const faucetTx = async () => {
    const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
    const specialSigner = new ethers.Wallet(pKey, provider as any)
    const tx = await specialSigner.sendTransaction({
      to: address,
      value: parseEther('0.0001'),
    })
    const receipt = await tx.wait(1)
    return receipt
  }

  const makeProposalObject = useCallback(async () => {
    console.log('getProposals start')
    try {
      setIsLoading(true)
      console.log('provider:', provider)
      const ethersProvider = new BrowserProvider(provider as any)
      const gov = new ethers.Contract(govContract.address, govContract.abi, ethersProvider)
      if (!initialized) {
        if (typeof gov.getProposalCreatedBlocks === 'function') {
          const bal = (await getBal()) || 1
          console.log('bal:', bal)
          if (bal < 0.0000001) {
            const faucet = await faucetTx()
            console.log('faucet tx', faucet)
          }

          const proposalCreatedBlocks = await gov.getProposalCreatedBlocks()
          // console.log('proposals', proposalCreatedBlocks)
          let proposalRaw = proposal
          for (let i = 0; i < proposalCreatedBlocks.length; i++) {
            const proposals = (await gov.queryFilter('ProposalCreated', proposalCreatedBlocks[i])) as any
            if (proposalCreatedBlocks[1] === proposals[0].args[0]) {
              setInitialized(true)
              setIsLoading(false)
              return
            }
            if (proposals.length > 0) {
              // console.log(Number(proposalCreatedBlocks[i]), proposals[0].args[0])
              proposalRaw.push(
                ...[
                  {
                    id: String(proposals[0].args[0]),
                    link: baseUrl + String(proposals[0].args[0]),
                    title: proposals[0].args[8],
                    state: Number(await getState(proposals[0].args[0])),
                  },
                ]
              )
            } else {
              console.log('\nNo proposals found at block #' + Number(proposalCreatedBlocks[i]))
            }
          }
          setProposal(proposalRaw)
          console.log('proposal:', proposal)
          console.log('getProposals executed ✅')
          setInitialized(true)
          setIsLoading(false)
        } else {
          console.error('getProposalCreatedBlocks method not available on this DAO contract')
          setIsLoading(false)
          toast({
            title: 'Oh no!',
            description: 'The getProposalCreatedBlocks method is NOT available on this contract',
            status: 'error',
            position: 'bottom',
            variant: 'subtle',
            duration: 9000,
            isClosable: true,
          })
        }
      } else {
        setIsLoading(false)
      }
    } catch (e) {
      setIsLoading(false)
      console.error('error:', e)
      toast({
        title: 'Woops',
        description: 'Something went wrong...',
        status: 'error',
        position: 'bottom',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
    }
  }, [provider])

  useEffect(() => {
    console.log('init')
    if (provider) {
      makeProposalObject()
      getName()
    }
  }, [provider])

  function Item(props: any) {
    return (
      <>
        <div className="">
          <Box mt={3} fontSize="lg">
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
    // Filter out the element with key 0
    const filteredProposal = proposal.filter((p, index) => index !== 0)

    return (
      <div>
        {initialized === true ? (
          filteredProposal.map((p) => <Item key={p.id} title={p.title} state={p.state} id={p.id} link={p.link} />)
        ) : (
          <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
        )}
      </div>
    )
  }

  return (
    <>
      <main>
        <Text>
          DAO contract address:{' '}
          <strong>
            <a
              style={{ color: '#45a2f8' }}
              target="_blank"
              rel="noopener noreferrer"
              href={'https://sepolia.etherscan.io/address/' + govContract.address + '#code'}>
              {govContract.address}
            </a>
          </strong>
        </Text>
        <br />
        <HeadingComponent as="h3">Proposals</HeadingComponent>
        <List />

        <br />
        <br />
        <Button
          // mt={7}
          colorScheme="blue"
          variant="outline"
          type="submit"
          onClick={makeProposalObject}
          isLoading={isLoading}
          loadingText="Testing..."
          spinnerPlacement="end">
          Test
        </Button>
      </main>
    </>
  )
}
