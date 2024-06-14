import * as React from 'react'
import { NextSeo } from 'next-seo'
import { Button, Badge, useToast, Box, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { LinkComponent } from '../components/layout/LinkComponent'
import govContract from '../utils/Gov.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../components/layout/HeadingComponent'
import { ArrowForwardIcon, WarningIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { startBlock, firstIteration, listOfBlocks, SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../utils/config'
import { Head } from '../components/layout/Head'

export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()

  const [initialized, setInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(undefined)
  const [name, setName] = useState<string>('')
  const [proposal, setProposal] = useState<{ id: string; link: string; title: string; state: number }[]>([])
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL
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

  const getName = async () => {
    const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
    setName(await gov.name())
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
      setProposal([])

      const currentBlock = await customProvider.getBlockNumber()
      const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)

      console.log('listOfBlocks:', listOfBlocks)

      let proposals: any
      let i: number = 0
      let proposalsRaw: any = proposal

      // TODO: add a static list of blocks https://github.com/w3hc/gov-ui/issues/79
      if (listOfBlocks.length > 0) {
        console.log('listOfBlocks.length > 0')

        let staticProposalsRaw = proposal

        const firstBlock = listOfBlocks[0]
        console.log('firstBlock', firstBlock)

        const lastBlock = listOfBlocks[listOfBlocks.length - 1]
        console.log(' lastBlock', lastBlock)

        const staticProposals = await gov.queryFilter('ProposalCreated' as any, firstBlock, lastBlock)
        console.log('staticProposals', staticProposals)

        console.log('Number(listOfBlocks.length)', Number(listOfBlocks.length))

        for (i = 0; i < Number(listOfBlocks.length); i++) {
          console.log('iterations', i)

          const staticProposal: any = await gov.queryFilter('ProposalCreated' as any, firstBlock, firstBlock)
          console.log('staticProposal', staticProposal)

          console.log('staticProposal proposalId', staticProposal[0].args?.proposalId)
          console.log('staticProposal description', staticProposal[0].args?.description)
          console.log('staticProposal title', staticProposal[0].args?.description)

          staticProposalsRaw.push(
            ...[
              {
                id: String(staticProposal[0].args?.proposalId),
                link: baseUrl + String(staticProposal[0].args?.proposalId),
                // title: 'hey',
                title: staticProposal[0].args?.description.substring(
                  staticProposal[0].args?.description == '#' ? 2 : 0,
                  staticProposal[0].args?.description.indexOf('\n')
                ),
                state: await getState(staticProposal[0].args?.proposalId),
              },
            ]
          )
        }

        const uniqueProposals = staticProposalsRaw.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        setProposal(uniqueProposals)
        console.log('all proposals fetched ✅')
        setInitialized(true)
        setIsLoading(false)

        // proposals = await gov.queryFilter('ProposalCreated' as any, lastBlock, currentBlock)
        // console.log('proposals:', proposals)

        // let proposalsRaw = proposal // to remove

        // if (proposals[0].args != undefined) {
        //   for (i = 0; i < Number(proposals.length); i++) {
        //     proposalsRaw.push(
        //       ...[
        //         {
        //           id: String(proposals[i].args?.proposalId),
        //           link: baseUrl + String(proposals[i].args?.proposalId),
        //           title: proposals[i].args[8].substring(proposals[i].args[8][0] == '#' ? 2 : 0, proposals[i].args[8].indexOf('\n')),
        //           state: await getState(proposals[i].args?.proposalId),
        //         },
        //       ]
        //     )
        //   }
        //   const uniqueProposals = proposal.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        //   setProposal(uniqueProposals)
        //   console.log('all proposals fetched ✅')
        //   setInitialized(true)
        //   setIsLoading(false)
        // }
        // }
      } else {
        proposals = await gov.queryFilter('ProposalCreated' as any, startBlock, currentBlock)
        console.log('proposals:', proposals)

        if (proposals[0].args != undefined) {
          for (i = firstIteration; i < Number(proposals.length); i++) {
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
          const uniqueProposals = proposal.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
          setProposal(uniqueProposals)
          console.log('all proposals fetched ✅')
          setInitialized(true)
          setIsLoading(false)
        }
      }
      setIsLoading(false)
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
    if (!initialized) {
      makeProposalObject()
      getName()
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
      <Head title="Gov" description={SITE_DESCRIPTION} />
      <NextSeo
        title="Gov"
        description="DAOs for everyday people"
        titleTemplate={`%s`}
        // description={SITE_DESCRIPTION}
        // defaultOpenGraphImageWidth={1200}
        // defaultOpenGraphImageHeight={630}
        openGraph={{
          type: 'website',
          siteName: SITE_NAME,
          url: origin,
          images: [
            {
              url: `${origin}/huangshan.png`,
              width: 1200,
              height: 630,
              alt: 'Huangshan',
            },
          ],
        }}
      />
      <main>
        <Box borderRadius="lg" overflow="hidden">
          <Image priority width="2000" height="2000" alt="dao-image" src="/huangshan.png" />
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
          Using Gov, adding a new member typically requires a community vote, but in this version you can become a member to try out features like
          submitting a proposal, delegating your voting power to someone, and voting.
        </Text>
        <br />
        <Text>
          <WarningIcon w={4} h={4} color="red.500" /> Please note that the voting period is set to <strong>5 minutes.</strong>
        </Text>
        {/* <br />
        <Text>
          <WarningIcon w={4} h={4} color="red.500" /> Also, if you&apos;re using the email login some faetures may not be working yet. Thanks for your
          patience!
        </Text> */}
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
          <Button mt={3} rightIcon={<ArrowForwardIcon />} colorScheme="green" variant="outline" size="sm">
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
