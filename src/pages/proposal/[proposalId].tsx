import { Button, Badge, useToast, Text, Box, chakra } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useEthersSigner, useEthersProvider } from '../../hooks/ethersAdapter'
import { ethers } from 'ethers'
import { GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, nftAbi, ERC20_CONTRACT_ABI, ERC20_CONTRACT_ADRESS } from '../../utils/config'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { HeadingComponent } from '../../components/layout/HeadingComponent'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

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
  const toast = useToast()

  const proposalId = router.query.proposalId

  const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [stateBadge, setStateBadge] = useState<any>()
  const [state, setState] = useState<any>()
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState(null)
  const stateText = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
  const stateColor = ['orange', 'green', 'blue', 'red', 'purple', 'blue', 'blue', 'blue']
  const [targets, setTargets] = useState<any>()
  const [values, setValues] = useState<any>()
  const [calldatas, setCalldatas] = useState<any>()
  const [rawDescription, setRawDescription] = useState<any>()
  const [forVotes, setForVotes] = useState<number>(0)
  const [againstVotes, setAgainstVotes] = useState<number>(0)

  const provider = useEthersProvider()
  const signer = useEthersSigner()

  const getState = async (proposalId: any) => {
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const state = await gov.state(proposalId)
    setStateBadge(
      <Badge fontSize="0.5em" colorScheme={stateColor[state]} variant="solid">
        {stateText[state]}
      </Badge>
    )
    setState(stateText[state])
  }

  const getCurrentVotes = async (proposalId: any) => {
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const votes = await gov.proposalVotes(proposalId)
    setForVotes(Number(votes.forVotes))
    setAgainstVotes(Number(votes.againstVotes))
  }

  const getProposalData = async () => {
    const block = await provider.getBlockNumber()

    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const proposals: any = await gov.queryFilter('ProposalCreated' as any, 5065858, block) // TODO: fix type casting

    try {
      let i: number = 0

      if (proposals[0].args != undefined) {
        for (i; i < Number(proposals.length); i++) {
          const id = String(proposals[i].args?.proposalId)

          if (id == proposalId) {
            setTitle(proposals[i].args[8].substring(proposals[i].args[8][0] == '#' ? 2 : 0, proposals[i].args[8].indexOf('\n')))
            setDescription(proposals[i].args[8].substring(proposals[i].args[8].indexOf('\n')))
            setUri(proposals[i].args[8].substring(proposals[i].args[8].indexOf('(') + 1, proposals[i].args[8].indexOf(')')))
            setCalldatas(proposals[0].args[5])

            await getState(proposalId)
            await getCurrentVotes(proposalId)

            setTargets(proposals[i].args[2][0])
            setValues(proposals[i].args[3][0])

            setCalldatas(proposals[i].args[5][0])
            setRawDescription(proposals[i].args[8])
            setInitialized(true)
          }
        }
      }
    } catch (error) {
      console.error('error:', error)
      setInitialized(true)
    }
  }

  useEffect(() => {
    console.log('DAO Contract address:', GOV_CONTRACT_ADDRESS)
    const init = async () => {
      if (chain?.id !== 11155111) {
        switchNetwork?.(11155111)
      }
      getProposalData()
      if (description) {
        console.error('desc:', description)
      }
    }
    init()
  }, [signer, proposalId])

  const hasDelegated = async () => {
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
    const delegateTo = await signer?.getAddress()
    const nftAddress = await gov.token()
    const nft = new ethers.Contract(nftAddress, nftAbi, signer)
    const delegate = await nft.delegates(await signer?.getAddress())
    if (delegate === delegateTo) {
      return true
    }
  }

  const delegateToMyself = async () => {
    if ((await hasDelegated()) === true) {
      return true
    } else {
      const delegateTo = await signer?.getAddress()
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const nftAddress = await gov.token()
      const nft = new ethers.Contract(nftAddress, nftAbi, signer)
      const delegate = await nft.delegate(delegateTo)
      const receippt = await delegate.wait(1)
      return true
    }
  }

  const voteYes = async () => {
    // https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-COUNTING_MODE--
    // 0 = Against, 1 = For, 2 = Abstain

    if (signer === undefined) {
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
      const delegate = await delegateToMyself()
    } catch (e) {
      console.log('delegate error:', e)
    }

    try {
      console.log('voting...')
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)

      await gov.castVote(router.query.proposalId, 1)
      await getCurrentVotes(router.query.proposalId)
      setForVotes(forVotes + 1)
      await getState(proposalId)
      toast({
        title: 'Voted!',
        position: 'bottom',
        description: 'Thank you for voting this proposal.',
        status: 'success',
        variant: 'subtle',
        duration: 5000,
        isClosable: true,
      })
    } catch (e: any) {
      console.log('vote error:', e)
      toast({
        title: 'Error',
        position: 'bottom',
        description: "You can't vote twice",
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const voteNo = async () => {
    console.log('voting...')

    if (signer === undefined) {
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
      const delegate = await delegateToMyself()
    } catch (e) {
      console.log('delegate error:', e)
    }
    try {
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      await gov.castVote(router.query.proposalId, 0)
      await getCurrentVotes(router.query.proposalId)
      setAgainstVotes(againstVotes + 1)
      await getState(proposalId)
      toast({
        title: 'Voted!',
        position: 'bottom',
        description: 'Thank you for voting this proposal.',
        status: 'success',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
    } catch (e: any) {
      console.log('vote error:', e)

      toast({
        title: 'Error',
        position: 'bottom',
        description: "You can't vote twice",
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const execute = async () => {
    console.log('executing...')
    setLoading(true)
    try {
      const targetsFormatted = [targets]
      const valuesFormatted = [values]
      const calldatasFormatted = [calldatas]
      const hashedDescription = ethers.id(rawDescription)

      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const executeCall = await gov.execute(targetsFormatted, valuesFormatted, calldatasFormatted, hashedDescription)
      await executeCall.wait(1)
      getState(proposalId)
      setLoading(false)
    } catch (e: any) {
      console.log('execute error:', e)
      setLoading(false)

      toast({
        title: 'Error',
        position: 'bottom',
        description: e?.data.message,
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

          <br />
        </div>

        {/* const proposalState = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'] */}
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

        {state === 'Succeeded' && (
          <>
            <br />

            {!loading ? (
              <Button size="xs" mt={5} colorScheme="red" variant="solid" onClick={execute}>
                Execute
              </Button>
            ) : (
              <Button isLoading loadingText="Executing..." size="xs" mt={5} colorScheme="red" variant="solid" onClick={execute}>
                Execute
              </Button>
            )}
          </>
        )}
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
