import * as React from 'react'
import { Button, Badge, useToast, Box, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { LinkComponent } from '../components/layout/LinkComponent'
import govContract from '../utils/Gov.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../components/layout/HeadingComponent'
import { AddIcon, WarningIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { firstIteration } from '../utils/config'

export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()

  const [initialized, setInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [name, setName] = useState<string>('Test DAO')
  const [proposal, setProposal] = useState<{ id: string; link: string; title: string; state: number }[]>([])
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']

  const baseUrl = '/proposal/'

  useEffect(() => {
    const init = async () => {
      if (customProvider) {
        setProvider(customProvider)
      }
    }
    init()
  }, [address, walletProvider])

  const getState = async (proposalId: any) => {
    const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
    return await gov.state(proposalId)
  }

  const makeProposalObject = async () => {
    try {
      console.log('fetching proposals...')
      if (initialized) {
        console.log('already initialized')
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
      setProposal([])

      if (typeof gov.getProposalCreatedBlocks === 'function') {
        const proposalCreatedBlocks = await gov.getProposalCreatedBlocks()
        let proposalRaw = proposal
        for (let i = firstIteration; i < proposalCreatedBlocks.length; i++) {
          console.log('iteration:', i)
          /////////////////*******//////////////

          const proposals = (await gov.queryFilter('ProposalCreated', proposalCreatedBlocks[i])) as any

          if (proposals.length > 0) {
            proposalRaw.push(
              ...[
                {
                  id: String(proposals[0].args[0]),
                  link: baseUrl + String(proposals[0].args[0]),
                  title: proposals[0].args[8].substring(proposals[0].args[8] == '#' ? 2 : 2, proposals[0].args[8].indexOf('\n')),
                  state: Number(await getState(proposals[0].args[0])),
                },
              ]
            )
          } else {
            console.log('\nNo proposals found at block #' + Number(proposalCreatedBlocks[i]))
          }
        }

        // TODO: fix executed twice...
        // Remove duplicates based on the `id` property
        const uniqueProposals = proposal.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        setProposal(uniqueProposals)

        console.log('all proposals fetched ✅')
        setInitialized(true)
        setIsLoading(false)
      } else {
        console.error('getProposalCreatedBlocks method not available on this DAO contract')
        setInitialized(true)
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
    } catch (error: any) {
      setIsLoading(false)
      setInitialized(true)
      console.error('error:', error)
      if (!error.message.includes('could not decode result data')) {
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
    }
  }

  useEffect(() => {
    console.log('useEffect executed')
    if (!initialized) {
      makeProposalObject()
    }
  }, [initialized])

  function Item(props: any) {
    return (
      <>
        <div className="">
          <Box mt={3} fontSize="md">
            {/* You can adjust the value of fontSize to other Chakra UI size values (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl) or use
            custom values (e.g., "20px", "2rem") as per your requirements. */}
            <strong>
              <LinkComponent href={props.link}>{props.title}</LinkComponent>
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
        {isLoading === false ? (
          proposal.map((p) => <Item key={p.id} title={p.title} state={p.state} id={p.id} link={p.link} />)
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
          </Box>
        )}
      </div>
    )
  }

  return (
    <>
      <main>
        <Box borderRadius="lg" overflow="hidden">
          <Image priority width="2000" height="2000" alt="dao-image" src="/huangshan.jpeg" />
        </Box>
        <Text fontSize={9}>
          <i>
            Photo:{' '}
            <LinkComponent href="https://unsplash.com/photos/a-view-of-a-mountain-range-from-the-top-of-a-hill-pZDcvou8bRw">
              Ruslan Kaptsan
            </LinkComponent>
          </i>
        </Text>
        <br />
        <HeadingComponent as="h3">{name}</HeadingComponent>
        <Text>The purpose of this DAO is to test Gov. </Text>
        <br />
        <Text>
          Using Gov, adding a new member typically requires a community vote, but in this version, you can become a member to try out features like
          submitting a proposal, delegating your voting power to someone, and voting.
        </Text>
        <br />
        <Text>
          <WarningIcon w={4} h={4} color="red.500" /> Please note that the voting period is set to <strong>5 minutes.</strong>
        </Text>
        <br />
        <Text>
          <WarningIcon w={4} h={4} color="red.500" /> Also, if you&apos;re using the email login some fetures may not be working yet. Thanks for your
          patience!
        </Text>
        <br />
        <Text fontSize={12}>
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
        <LinkComponent href="/profile">
          <Button mt={3} rightIcon={<AddIcon />} colorScheme="green" variant="outline" size="sm">
            Join
          </Button>
        </LinkComponent>

        {initialized ? (
          <>
            <br />
            <br />
            <HeadingComponent as="h3">Proposals</HeadingComponent>
            <List />

            <br />
            <br />
          </>
        ) : (
          <>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
            </Box>

            <br />
            <br />
          </>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  )
}
