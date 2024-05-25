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
import Image from 'next/image'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { firstIteration, faucetAmount } from '../../utils/config'

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
  const [provider, setProvider] = useState<any>(undefined)
  const [signer, setSigner] = useState<any>(undefined)
  const [title, setTitle] = useState('')
  const [stateBadge, setStateBadge] = useState<any>()
  const [state, setState] = useState<any>()
  const [description, setDescription] = useState('')
  const [targets, setTargets] = useState<any>()
  const [values, setValues] = useState<any>()
  const [calldatas, setCalldatas] = useState<any>()
  const [rawDescription, setRawDescription] = useState<any>()
  const [forVotes, setForVotes] = useState<number>(0)
  const [againstVotes, setAgainstVotes] = useState<number>(0)
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  const [executeTxLink, setExecuteTxLink] = useState<string>('')

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
  const toast = useToast()

  useEffect(() => {
    const init = async () => {
      if (walletProvider) {
        setProvider(walletProvider)
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setSigner(signer)
      }
    }
    init()
  }, [address, walletProvider])

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

      const gov = new ethers.Contract(govContract.address, govContract.abi, customProvider)

      const proposalCreatedBlocks = await gov.getProposalCreatedBlocks()

      let block
      for (let i = firstIteration; i < proposalCreatedBlocks.length; i++) {
        console.log('iteration:', i)

        const proposals: any = await gov.queryFilter('ProposalCreated', block)

        if (String(proposals[i].args[0]) === proposalId) {
          setTitle(proposals[i].args[8].substring(proposals[i].args[8] == '#' ? 2 : 2, proposals[i].args[8].indexOf('\n')))
          setDescription(proposals[i].args[8].substring(proposals[i].args[8].indexOf('\n')))
          setCalldatas(proposals[i].args[5])
          await getState(proposalId)
          await getCurrentVotes(proposalId)
          setTargets(proposals[i].args[2][0])
          setValues(proposals[i].args[3][0])
          setCalldatas(proposals[i].args[5][0])
          setRawDescription(proposals[i].args[8])
          const proposalExecuted: any = await gov.queryFilter('ProposalExecuted', block)
          for (let i = 18; i < proposalExecuted.length; i++) {
            if (String(proposalExecuted[i].args[0]) === proposalId) {
              const executeTxHash: any = await gov.queryFilter('ProposalExecuted', proposalExecuted[i].blockNumber)
              console.log('executeTxHash:', executeTxHash[0].transactionHash)
              setExecuteTxLink('https://sepolia.etherscan.io/tx/' + executeTxHash[0].transactionHash)
            }
          }
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
    if (!initialized) {
      getProposalData()
    }
  }, [proposalId])

  const handleBalance = async () => {
    console.log('handle balance start')
    const ethersProvider = new BrowserProvider(provider)
    const balance = await ethersProvider.getBalance(String(address))
    const ethBalance = Number(ethers.formatEther(balance))
    console.log('ethBalance:', ethBalance)
    if (ethBalance < faucetAmount) {
      console.log('waiting for some ETH...')
      const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
      const specialSigner = new ethers.Wallet(pKey, customProvider)
      const tx = await specialSigner.sendTransaction({
        to: address,
        value: ethers.parseEther(String(faucetAmount)),
      })
      const receipt = await tx.wait(1)
      console.log('faucet tx:', receipt)
      console.log('balance ok')
    } else {
      console.log('balance ok')
    }
  }

  const handleMembership = async () => {
    try {
      console.log('handleMembership start')

      await handleBalance()

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const nftBal = Number(await nft.balanceOf(address))
      console.log('nftBal:', nftBal)

      if (nftBal < 1) {
        console.log('joining...')

        const uri = 'https://bafkreicj62l5xu6pk2xx7x7n6b7rpunxb4ehlh7fevyjapid3556smuz4y.ipfs.w3s.link/'
        const tx = await nft.safeMint(address, uri)
        console.log('tx:', tx)
        const receipt = await tx.wait(1)
        console.log('receipt:', receipt)
        console.log('membership done')
        return true
      } else {
        console.log('already member')
        console.log('membership done')
        return true
      }
    } catch (e: any) {
      console.log('handleMembership error', e)

      if (e.toString().includes('could not coalesce error')) {
        console.log('This is the coalesce error.')
        toast({
          title: 'Email login not supported',
          position: 'bottom',
          description: "Sorry, this feature is not supported yet if you're using the email login.",
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
        return false
      } else {
        toast({
          title: 'Error',
          position: 'bottom',
          description: 'handleMembership error',
          status: 'error',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        setIsLoading(false)
        return false
      }
    }
  }

  const voteYes = async () => {
    // https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-COUNTING_MODE--
    // 0 = Against, 1 = For, 2 = Abstain
    try {
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
        setIsLoading(false)
        return
      }

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegateTo = await nft.delegates(address)

      const nftBal = Number(await nft.balanceOf(address))
      console.log('nftBal:', nftBal)

      if (nftBal < 1) {
        toast({
          title: 'Not a member',
          position: 'bottom',
          description: 'Please join as a member if you want to vote.',
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      }

      if (delegateTo === '0x0000000000000000000000000000000000000000') {
        console.log('not delegated')

        toast({
          title: 'Not delegated',
          position: 'bottom',
          description: 'You need to delegate to yourself before voting',
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      }

      if (delegateTo === address) {
        console.log('delegation ok')

        // Load contract
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

        // If user has not enough ETH, we send some
        await handleBalance()

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
        setIsLoading(false)
        toast({
          title: 'Delegation',
          position: 'bottom',
          description: 'You need to delegate to yourself before voting',
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        return
      }
    } catch (e: any) {
      console.log('vote error:', e)

      switch (e) {
        case String(e).includes('coalesce'):
          console.log('This is the coalesce error.')
          toast({
            title: 'Woops',
            position: 'bottom',
            description: 'Please refresh the page and try again.',
            status: 'info',
            variant: 'subtle',
            duration: 3000,
            isClosable: true,
          })
          break

        default:
          console.log('Basic error')
      }

      if (state === 'Pending') {
        toast({
          title: 'Pending proposal',
          position: 'bottom',
          description: 'The proposal is still pending. Please try again in a few seconds.',
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Already voted',
          position: 'bottom',
          description: "You can't vote twice.",
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
      }
      setIsLoading(false)
    }
  }

  const voteNo = async () => {
    // https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-COUNTING_MODE--
    // 0 = Against, 1 = For, 2 = Abstain
    try {
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

      const nft = new ethers.Contract(nftContract.address, nftContract.abi, signer)
      const delegateTo = await nft.delegates(address)

      if (delegateTo != address || delegateTo != '0x0000000000000000000000000000000000000000') {
        console.log('delegated to someone else')

        toast({
          title: 'Delegated to someone else',
          position: 'bottom',
          description: "You've delegated to someone else. Delegate to yourself if you want to vote.",
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        return false
      }

      if (delegateTo === '0x0000000000000000000000000000000000000000') {
        console.log('not delegated')

        toast({
          title: 'Not delegated',
          position: 'bottom',
          description: 'You need to delegate to yourself before voting',
          status: 'info',
          variant: 'subtle',
          duration: 3000,
          isClosable: true,
        })
        return false
      }

      if (delegateTo === address) {
        console.log('delegation ok')

        // Load contract
        const gov = new ethers.Contract(govContract.address, govContract.abi, signer)

        // If user has not enough ETH, we send some
        await handleBalance()

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
    setIsLoading(true)
    try {
      const targetsFormatted = [targets]
      const valuesFormatted = [values]
      const calldatasFormatted = [calldatas]
      const hashedDescription = ethers.id(rawDescription)

      console.log('targetsFormatted', targetsFormatted)
      console.log('valuesFormatted', valuesFormatted)
      console.log('calldatasFormatted', calldatasFormatted)
      console.log('hashedDescription', hashedDescription)

      // If user has not enough ETH, we send some
      await handleBalance()

      console.log('executing...')

      const gov = new ethers.Contract(govContract.address, govContract.abi, signer)
      const executeCall = await gov.execute(targetsFormatted, valuesFormatted, calldatasFormatted, hashedDescription)
      const executeCallreceipt = await executeCall.wait(1)

      const executeTxHash: any = await gov.queryFilter('ProposalExecuted', executeCallreceipt.blockNumber)
      // console.log('executeCallreceipt.blockNumber:', executeCallreceipt.blockNumber)
      setExecuteTxLink('https://sepolia.etherscan.io/tx/' + executeTxHash[0].transactionHash)

      getState(proposalId)
      console.log('execute tx:', executeCallreceipt)
      console.log('execute done')

      setIsLoading(false)
    } catch (e: any) {
      console.log('execute error:', e)
      setIsLoading(false)
      toast({
        title: 'Oh no!',
        position: 'bottom',
        description: "This proposal can't be executed.",
        status: 'info',
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
        </div>
        {state === 'Active' && (
          <>
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
          </>
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
        {executeTxLink && (
          <>
            <Box mt={10} borderRadius="lg" p={5} shadow="md" borderWidth="2px">
              <HeadingComponent as="h4">Execution transaction link</HeadingComponent>

              <LinkComponent href={executeTxLink}>
                <Text color={'#45a2f8'} _hover={{ color: '#8c1c84' }}>
                  {executeTxLink}
                </Text>
              </LinkComponent>
            </Box>
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
    <Box display="flex" justifyContent="center" alignItems="center">
      <Image priority width="200" height="200" alt="loader" src="/reggae-loader.svg" />
    </Box>
  )
}
