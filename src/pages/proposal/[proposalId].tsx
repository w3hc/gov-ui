import * as React from 'react'
import { Button, Badge, useToast, Link, Box, Text, Wrap, WrapItem, Center, chakra } from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider, parseEther } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { LinkComponent } from '../../components/layout/LinkComponent'
import { Head } from '../../components/layout/Head'
import govContract from '../../utils/Gov.json'
import nftContract from '../../utils/NFT.json'
import { ethers } from 'ethers'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { AddIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'

const CustomLink = chakra('a', {
  baseStyle: {
    color: 'blue.500',
    textDecoration: 'underline',
    _hover: {
      color: 'blue.700',
    },
  },
})

export default function Proposal() {
  const router = useRouter()

  const proposalId = router.query.proposalId

  const [initialized, setInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [name, setName] = useState<string>('')
  const [block, setBlock] = useState(0)
  const [manifesto, setManifesto] = useState('')
  const [manifestoLink, setManifestoLink] = useState('')
  const [proposal, setProposal] = useState<{ id: string; link: string; title: string; state: number }[]>([])
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  // const [isMember, setIsMember] = useState(false)

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const provider = walletProvider
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [stateBadge, setStateBadge] = useState<any>()
  const [state, setState] = useState<any>()
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState(null)
  const [targets, setTargets] = useState<any>()
  const [values, setValues] = useState<any>()
  const [calldatas, setCalldatas] = useState<any>()
  const [rawDescription, setRawDescription] = useState<any>()
  const [forVotes, setForVotes] = useState<number>(0)
  const [againstVotes, setAgainstVotes] = useState<number>(0)

  const getState = async (proposalId: any) => {
    const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
    const state = await gov.state(proposalId)
    setStateBadge(
      <Badge fontSize="0.5em" colorScheme={stateColor[state]} variant="solid">
        {stateText[state]}
      </Badge>
    )
    setState(stateText[state])
  }

  const getCurrentVotes = async (proposalId: any) => {
    const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)
    const votes = await gov.proposalVotes(proposalId)
    setForVotes(Number(votes.forVotes))
    setAgainstVotes(Number(votes.againstVotes))
  }

  const getProposalData = async () => {
    setIsLoading(true)
    try {
      if (initialized) {
        console.log('already initialized')
        setIsLoading(false)
        return
      }

      console.log('proposalId:', proposalId)

      const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)

      const proposalCreatedBlocks = await gov.getProposalCreatedBlocks()
      console.log('proposalCreatedBlocks', proposalCreatedBlocks)

      let block
      for (let i = 40; i < proposalCreatedBlocks.length; i++) {
        console.log('iteration:', i)

        console.log('proposalCreatedBlocks[i]:', proposalCreatedBlocks[i])
        const proposals: any = await gov.queryFilter('ProposalCreated', block)
        console.log('proposals:', proposals)

        //   console.log('proposals[0].args[0]', proposals[0].args[0])

        console.log('String(proposals[i].args[0])', String(proposals[i].args[0]))
        console.log('proposalId:', proposalId)

        if (String(proposals[i].args[0]) === proposalId) {
          console.log('yo')
          console.log('proposals[0].args[0]', proposals[0].args[0])

          setTitle(proposals[i].args[8].substring(proposals[i].args[8] == '#' ? 2 : 2, proposals[i].args[8].indexOf('\n')))
          setDescription(proposals[i].args[8].substring(proposals[i].args[8].indexOf('\n')))
          setUri(proposals[i].args[8].substring(proposals[i].args[8].indexOf('(') + 1, proposals[i].args[8].indexOf(')')))
          setCalldatas(proposals[i].args[5])
          await getState(proposalId)
          await getCurrentVotes(proposalId)
          setTargets(proposals[i].args[2][0])
          setValues(proposals[i].args[3][0])
          setCalldatas(proposals[i].args[5][0])
          setRawDescription(proposals[i].args[8])
        }
      }

      setInitialized(true)
      setIsLoading(false)
    } catch (error) {
      console.error('error:', error)
      setInitialized(true)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('router.query', router.query)
    if (!initialized) {
      getProposalData()
    }
  }, [proposalId])

  // const hasDelegated = async () => {
  //   console.log('hasDelegated start')
  //   let signer: any
  //   if (provider) {
  //     // setIsLoading(true)
  //     const ethersProvider = new BrowserProvider(provider)
  //     signer = await ethersProvider.getSigner()
  //     const delegateTo = await signer?.getAddress()
  //     const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
  //     const delegate = await nft.delegates(await signer?.getAddress())
  //     if (delegate === delegateTo) {
  //       return true
  //     }
  //     console.log('hasDelegated done')
  //   }
  // }

  // const delegateToMyself = async () => {
  //   console.log('delegateToMyself start')

  //   if ((await hasDelegated()) === true) {
  //     return true
  //   } else {
  //     let signer: any
  //     if (provider) {
  //       // setIsLoading(true)
  //       const ethersProvider = new BrowserProvider(provider)
  //       signer = await ethersProvider.getSigner()
  //       const delegateTo = await signer?.getAddress()
  //       const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
  //       const delegate = await nft.delegate(delegateTo)
  //       const receipt = await delegate.wait(1)
  //       // setIsLoading(false)
  //       return true
  //     }
  //   }
  //   console.log('delegateToMyself done')
  // }

  const handleBalance = async () => {
    console.log('handleBalance start')
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      const balance = await ethersProvider.getBalance(String(address))
      const ethBalance = Number(ethers.formatEther(balance))
      if (ethBalance < 0.0005) {
        console.log('waiting for some ETH...')
        const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
        const specialSigner = new ethers.Wallet(pKey, customProvider)
        const tx = await specialSigner.sendTransaction({
          to: address,
          value: ethers.parseEther('0.0005'),
        })
        const receipt = await tx.wait(1)
        console.log('faucet tx:', receipt)
      }
    }
  }

  const handleMembership = async () => {
    console.log('handleMembership start')
    let signer
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const nftBal = Number(await nft.balanceOf(String(address)))
      console.log('nftBal:', nftBal)
      if (nftBal === 0) {
        try {
          console.log('joining...')
          const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'
          const safeMint = await nft.safeMint(address, uri)
          const receipt = await safeMint.wait(1)
          console.log('safeMint:', receipt)
        } catch (e) {
          console.log('error during mint:', e)
          toast({
            title: 'Error during mint',
            position: 'bottom',
            description: "There was an error in the minting process. Could be because you don't have enough ETH on your wallet.",
            status: 'info',
            variant: 'subtle',
            duration: 9000,
            isClosable: true,
          })
          setIsLoading(false)
        }
      }
    }
  }

  const handleDelegation = async () => {
    console.log('handleDelegation start')
    let signer
    if (provider) {
      const ethersProvider = new BrowserProvider(provider)
      signer = await ethersProvider.getSigner()
      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegateTo = await nft.delegates(address)
      if (delegateTo != address) {
        console.log('delegating...')
        const delegate = await nft.delegate(address)
        const delegateTx = await delegate.wait(1)
        console.log('delegate tx:', delegateTx)
      }
    }
  }

  const voteYes = async () => {
    // https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-COUNTING_MODE--
    // 0 = Against, 1 = For, 2 = Abstain

    setIsLoading(true)

    // Check if user is logged in
    if (!isConnected) {
      toast({
        title: 'Disconnected',
        position: 'bottom',
        description: 'Please connect your wallet first.',
        status: 'info',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      console.log('voting yes...')
      let signer
      if (provider) {
        // make signer
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        // If user has not enough ETH, we send some
        await handleBalance()

        // If user is not a member, make him a member (test only)
        await handleMembership()

        // Check if user is delegated
        await handleDelegation()

        // Load contract
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

        // Call castVote
        await gov.castVote(String(router.query.proposalId), 1)
        await getCurrentVotes(router.query.proposalId)
        setForVotes(forVotes + 1)
        await getState(proposalId)
        toast({
          title: 'Voted!',
          position: 'bottom',
          description: 'Thank you for voting for this proposal.',
          status: 'success',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
        })
      } else {
        console.log('no provider')
        toast({
          title: 'Disconnected',
          position: 'bottom',
          description: 'Please connect your wallet first.',
          status: 'info',
          variant: 'subtle',
          duration: 2000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      }
    } catch (e: any) {
      console.log('vote error:', e)
      toast({
        title: 'Error',
        position: 'bottom',
        description: "You can't vote twice.",
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  const voteNo = async () => {
    // https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-COUNTING_MODE--
    // 0 = Against, 1 = For, 2 = Abstain

    setIsLoading(true)

    // Check if user is logged in
    if (!isConnected) {
      toast({
        title: 'Disconnected',
        position: 'bottom',
        description: 'Please connect your wallet first.',
        status: 'info',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      console.log('voting no...')
      let signer
      if (provider) {
        // make signer
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        // If user has not enough ETH, we send some
        await handleBalance()

        // If user is not a member, make him a member (test only)
        await handleMembership()

        // Check if user is delegated
        await handleDelegation()

        // Load contract
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

        // Call castVote
        await gov.castVote(String(router.query.proposalId), 0)
        await getCurrentVotes(router.query.proposalId)
        setForVotes(againstVotes + 1)
        await getState(proposalId)
        toast({
          title: 'Voted!',
          position: 'bottom',
          description: 'Thank you for voting for this proposal.',
          status: 'success',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
        })
      } else {
        console.log('no provider')
        toast({
          title: 'Disconnected',
          position: 'bottom',
          description: 'Please connect your wallet first.',
          status: 'info',
          variant: 'subtle',
          duration: 2000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      }
    } catch (e: any) {
      console.log('vote error:', e)
      toast({
        title: 'Error',
        position: 'bottom',
        description: "You can't vote twice.",
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  const execute = async () => {
    console.log('executing...')
    console.log('provider:', provider)

    setIsLoading(true)
    try {
      console.log('try')

      let signer
      console.log('provider:', provider)
      if (provider) {
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()
        console.log('signer', signer)

        const targetsFormatted = [targets]
        const valuesFormatted = [values]
        const calldatasFormatted = [calldatas]
        const hashedDescription = ethers.id(rawDescription)

        console.log('targetsFormatted', targetsFormatted)
        console.log('valuesFormatted', valuesFormatted)
        console.log('calldatasFormatted', calldatasFormatted)
        console.log('hashedDescription', hashedDescription)

        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)
        const executeCall = await gov.execute(targetsFormatted, valuesFormatted, calldatasFormatted, hashedDescription)
        await executeCall.wait(1)
        getState(proposalId)
        setIsLoading(false)
      } else {
        toast({
          title: 'Not connected yet',
          position: 'bottom',
          description: 'Please connect your wallet first.',
          status: 'info',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
        })
        setIsLoading(false)
      }
    } catch (e: any) {
      console.log('execute error:', e)
      setIsLoading(false)
      toast({
        title: 'Nasty Error',
        position: 'bottom',
        description: "This proposal can't be executed (and will never be).",
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }
  return initialized ? (
    <>
      <Head title={title} />
      <main>
        <HeadingComponent as="h2">{title}</HeadingComponent>

        <Text>
          {stateBadge} For: <strong>{forVotes}</strong> | Against: <strong>{againstVotes}</strong>
        </Text>

        <div>
          <br />
          <HeadingComponent as="h4">Proposal description</HeadingComponent>
          <ReactMarkdown
            components={{
              a: CustomLink,
            }}>
            {description}
          </ReactMarkdown>

          <br />
        </div>
        {state === 'Active' && (
          <Box mt={10} borderRadius="lg" p={5} shadow="md" borderWidth="2px">
            <HeadingComponent as="h4">Are you in favor of this proposal?</HeadingComponent>
            <br />
            <Button mr="5" colorScheme="green" variant="outline" onClick={voteYes}>
              Yes
            </Button>
            <Button colorScheme="red" variant="outline" onClick={voteNo}>
              No
            </Button>
          </Box>
        )}
        {state === 'Pending' && (
          <Box mt={10} borderRadius="lg" p={5} shadow="md" borderWidth="2px">
            <HeadingComponent as="h4">Are you in favor of this proposal?</HeadingComponent>
            <br />
            <Button mr="5" colorScheme="green" variant="outline" onClick={voteYes}>
              Yes
            </Button>
            <Button colorScheme="red" variant="outline" onClick={voteNo}>
              No
            </Button>
          </Box>
        )}

        {state === 'Succeeded' && (
          <>
            <Button
              size="xs"
              mt={5}
              colorScheme="red"
              variant="solid"
              onClick={execute}
              isLoading={isLoading}
              loadingText="Executing..."
              spinnerPlacement="end">
              Execute
            </Button>
          </>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
