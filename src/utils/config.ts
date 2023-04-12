import { ThemingProps } from '@chakra-ui/react'
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  avalanche,
  avalancheFuji,
  gnosis,
} from '@wagmi/chains'

export const SITE_NAME = 'Gov'
export const APP_VERSION = 'v0.9.0-beta'
export const SITE_DESCRIPTION = 'Deploy your DAO in a few seconds'
export const SITE_URL = 'https://w3hc.org'
export const THEME_INITIAL_COLOR = 'dark'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
  // activeLinkColor: '#8c1c84',
}

export const SOCIAL_TWITTER = 'W3HC'
export const SOCIAL_GITHUB = 'w3hc/nexth'

export const ETH_CHAINS = [
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  avalanche,
  avalancheFuji,
  gnosis,
]
export const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
export const GOV_CONTRACT_ADDRESS = '0x17BccCC8E7c0DC62453a508988b61850744612F3'
export const GOV_CONTRACT_ABI = <const>[
  {
    inputs: [
      {
        internalType: 'contract IVotes',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_manifesto',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_votingDelay',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_votingPeriod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_votingThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quorum',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'Empty',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'cid',
        type: 'string',
      },
    ],
    name: 'ManifestoUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'ProposalCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'signatures',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endBlock',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'ProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'ProposalExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldProposalThreshold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256',
      },
    ],
    name: 'ProposalThresholdSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldQuorumNumerator',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256',
      },
    ],
    name: 'QuorumNumeratorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'VoteCast',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'VoteCastWithParams',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingDelay',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingDelay',
        type: 'uint256',
      },
    ],
    name: 'VotingDelaySet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingPeriod',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingPeriod',
        type: 'uint256',
      },
    ],
    name: 'VotingPeriodSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
    ],
    name: 'castVote',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'castVoteBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'castVoteWithReason',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32',
      },
    ],
    name: 'execute',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'getVotesWithParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasVoted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32',
      },
    ],
    name: 'hashProposal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manifesto',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalDeadline',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalSnapshot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposalThreshold',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'againstVotes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'forVotes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'abstainVotes',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'propose',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'quorum',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quorumDenominator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'cid',
        type: 'string',
      },
    ],
    name: 'setManifesto',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256',
      },
    ],
    name: 'setProposalThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newVotingDelay',
        type: 'uint256',
      },
    ],
    name: 'setVotingDelay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newVotingPeriod',
        type: 'uint256',
      },
    ],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'state',
    outputs: [
      {
        internalType: 'enum IGovernor.ProposalState',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract IVotes',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256',
      },
    ],
    name: 'updateQuorumNumerator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingDelay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingPeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]
export const nftAbi = <const>[
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_firstMembers',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fromDelegate',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toDelegate',
        type: 'address',
      },
    ],
    name: 'DelegateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBalance',
        type: 'uint256',
      },
    ],
    name: 'DelegateVotesChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'delegates',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'govBurn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const meduasaClientAbi = <const>[
  {
    inputs: [
      {
        internalType: 'contract BN254EncryptionOracle',
        name: '_oracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_nft',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CallbackNotAuthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ListingDoesNotExist',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'cipher',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random2',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'f',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'e',
                type: 'uint256',
              },
            ],
            internalType: 'struct DleqProof',
            name: 'dleq',
            type: 'tuple',
          },
        ],
        indexed: false,
        internalType: 'struct Ciphertext',
        name: 'ciphertext',
        type: 'tuple',
      },
    ],
    name: 'ListingDecryption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'cipherId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'NewListing',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cipherId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'NewSale',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
          },
        ],
        internalType: 'struct G1Point',
        name: 'buyerPublicKey',
        type: 'tuple',
      },
    ],
    name: 'buyListing',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'ciphers',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
          },
        ],
        internalType: 'struct G1Point',
        name: 'random',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'cipher',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
          },
        ],
        internalType: 'struct G1Point',
        name: 'random2',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'f',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'e',
            type: 'uint256',
          },
        ],
        internalType: 'struct DleqProof',
        name: 'dleq',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'cipher',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random2',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'f',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'e',
                type: 'uint256',
              },
            ],
            internalType: 'struct DleqProof',
            name: 'dleq',
            type: 'tuple',
          },
        ],
        internalType: 'struct Ciphertext',
        name: 'cipher',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'createListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'listings',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nft',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [
      {
        internalType: 'contract BN254EncryptionOracle',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'cipher',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
              },
            ],
            internalType: 'struct G1Point',
            name: 'random2',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'f',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'e',
                type: 'uint256',
              },
            ],
            internalType: 'struct DleqProof',
            name: 'dleq',
            type: 'tuple',
          },
        ],
        internalType: 'struct Ciphertext',
        name: 'cipher',
        type: 'tuple',
      },
    ],
    name: 'oracleResult',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dest',
        type: 'address',
      },
    ],
    name: 'payments',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'publicKey',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
          },
        ],
        internalType: 'struct G1Point',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'requests',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'payee',
        type: 'address',
      },
    ],
    name: 'withdrawPayments',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const TALLY_DAO_NAME = 'abyss-gov'
export const MEDUSA_CLIENT_APP_CONTRACT_ADDRESS = '0x0eEE41a9efC4aaCfAF68B647b7d0c61F45047010'
export const MEDUSA_ORACLE_CONTRACT_ADDRESS = '0xf1d5A4481F44fe0818b6E7Ef4A60c0c9b29E3118'

export const NFT_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_firstMembers',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fromDelegate',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toDelegate',
        type: 'address',
      },
    ],
    name: 'DelegateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBalance',
        type: 'uint256',
      },
    ],
    name: 'DelegateVotesChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'delegates',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'govBurn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const NFT_BYTECODE =
  '0x6101406040523480156200001257600080fd5b506040516200450138038062004501833981016040819052620000359162001182565b604080518082018252600e8082526d13595b58995c9cda1a5c0813919560921b60208084018290528451808601865260018152603160f81b8183015285518087018752938452838201929092528451808601909552600685526526a2a6a122a960d11b9085015291926000620000ac838262001302565b506001620000bb828262001302565b505050620000d8620000d2620001c060201b60201c565b620001c4565b815160209283012081519183019190912060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818301969096526060810194909452608080850193909352308483018190528151808603909301835260c0948501909152815191909501209052919091526101205260005b8251811015620001b757620001a28382815181106200018d576200018d620013ce565b6020026020010151836200021660201b60201c565b80620001ae81620013fa565b9150506200016a565b505050620014da565b3390565b600b80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b620002206200026f565b6000620002396010620002d160201b62000c4d1760201c565b9050620002526010620002d560201b62000c511760201c565b6200025e8382620002de565b6200026a818362000304565b505050565b600b546001600160a01b03163314620002cf5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b565b5490565b80546001019055565b620003008282604051806020016040528060008152506200039b60201b60201c565b5050565b6000828152600260205260409020546001600160a01b0316620003815760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401620002c6565b6000828152600a602052604090206200026a828262001302565b620003a783836200040e565b620003b66000848484620005bb565b6200026a5760405162461bcd60e51b81526020600482015260326024820152600080516020620044c183398151915260448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401620002c6565b6001600160a01b038216620004665760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401620002c6565b6000818152600260205260409020546001600160a01b031615620004cd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401620002c6565b620004dd60008383600162000717565b6000818152600260205260409020546001600160a01b031615620005445760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401620002c6565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a46200030060008383600162000736565b6000620005dc846001600160a01b03166200074f60201b62000c5a1760201c565b156200070b57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906200061690339089908890889060040162001416565b6020604051808303816000875af192505050801562000654575060408051601f3d908101601f1916820190925262000651918101906200146c565b60015b620006f0573d80801562000685576040519150601f19603f3d011682016040523d82523d6000602084013e6200068a565b606091505b508051600003620006e85760405162461bcd60e51b81526020600482015260326024820152600080516020620044c183398151915260448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401620002c6565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506200070f565b5060015b949350505050565b62000730848484846200075e60201b62000c691760201c565b50505050565b6200073084848484620008c260201b62000d9d1760201c565b6001600160a01b03163b151590565b62000777848484846200073060201b62000a621760201c565b6001811115620007f05760405162461bcd60e51b815260206004820152603560248201527f455243373231456e756d657261626c653a20636f6e736563757469766520747260448201527f616e7366657273206e6f7420737570706f7274656400000000000000000000006064820152608401620002c6565b816001600160a01b0385166200084f576200084981600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b62000875565b836001600160a01b0316856001600160a01b0316146200087557620008758582620008e8565b6001600160a01b03841662000895576200088f8162000995565b620008bb565b846001600160a01b0316846001600160a01b031614620008bb57620008bb848262000a4f565b5050505050565b620008cf84848362000aa0565b62000730848484846200073060201b62000a621760201c565b60006001620009028462000b4860201b620008d21760201c565b6200090e919062001498565b60008381526007602052604090205490915080821462000962576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b600854600090620009a99060019062001498565b60008381526009602052604081205460088054939450909284908110620009d457620009d4620013ce565b906000526020600020015490508060088381548110620009f857620009f8620013ce565b600091825260208083209091019290925582815260099091526040808220849055858252812055600880548062000a335762000a33620014ae565b6001900381819060005260206000200160009055905550505050565b600062000a678362000b4860201b620008d21760201c565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b6001600160a01b03831662000ada5762000ad762000bd060201b62000dad1782600e62000be760201b62000db9179092919060201c565b50505b6001600160a01b03821662000b145762000b1162000c2160201b62000df11782600e62000be760201b62000db9179092919060201c565b50505b6001600160a01b038381166000908152600c60205260408082205485841683529120546200026a9291821691168362000c2f565b60006001600160a01b03821662000bb45760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401620002c6565b506001600160a01b031660009081526003602052604090205490565b600062000bde8284620014c4565b90505b92915050565b60008062000c148562000c0e62000bfe8262000d80565b6001600160e01b0316868860201c565b62000dce565b915091505b935093915050565b600062000bde828462001498565b816001600160a01b0316836001600160a01b03161415801562000c525750600081115b156200026a576001600160a01b0383161562000cea576001600160a01b0383166000908152600d602090815260408220829162000ca7919062000df162000c21821b1790869062000db962000be7821b17901c565b91509150846001600160a01b0316600080516020620044e1833981519152838360405162000cdf929190918252602082015260400190565b60405180910390a250505b6001600160a01b038216156200026a576001600160a01b0382166000908152600d602090815260408220829162000d39919062000dad62000bd0821b1790869062000db962000be7821b17901c565b91509150836001600160a01b0316600080516020620044e1833981519152838360405162000d71929190918252602082015260400190565b60405180910390a25050505050565b8054600090801562000dc45762000dac8362000d9e60018462001498565b600091825260209091200190565b5464010000000090046001600160e01b031662000dc7565b60005b9392505050565b60008062000e0b8460000162000def4362000e2160201b62000dfd1760201c565b62000e058662000e8c60201b62000e661760201c565b62000ef7565b6001600160e01b03918216969116945092505050565b600063ffffffff82111562000e885760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b6064820152608401620002c6565b5090565b60006001600160e01b0382111562000e885760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b6064820152608401620002c6565b8254600090819080156200104c57600062000f198762000d9e60018562001498565b60408051808201909152905463ffffffff8082168084526401000000009092046001600160e01b03166020840152919250908716101562000f9d5760405162461bcd60e51b815260206004820152601760248201527f436865636b706f696e743a20696e76616c6964206b65790000000000000000006044820152606401620002c6565b805163ffffffff80881691160362000feb578462000fc28862000d9e60018662001498565b80546001600160e01b03929092166401000000000263ffffffff9092169190911790556200103b565b6040805180820190915263ffffffff80881682526001600160e01b0380881660208085019182528b54600181018d5560008d81529190912094519151909216640100000000029216919091179101555b60200151925083915062000c199050565b50506040805180820190915263ffffffff80851682526001600160e01b0380851660208085019182528854600181018a5560008a81529182209551925190931664010000000002919093161792019190915590508162000c19565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715620010e857620010e8620010a7565b604052919050565b60005b838110156200110d578181015183820152602001620010f3565b50506000910152565b600082601f8301126200112857600080fd5b81516001600160401b03811115620011445762001144620010a7565b62001159601f8201601f1916602001620010bd565b8181528460208386010111156200116f57600080fd5b6200070f826020830160208701620010f0565b600080604083850312156200119657600080fd5b82516001600160401b0380821115620011ae57600080fd5b818501915085601f830112620011c357600080fd5b8151602082821115620011da57620011da620010a7565b8160051b620011eb828201620010bd565b928352848101820192828101908a8511156200120657600080fd5b958301955b848710156200124057865192506001600160a01b03831683146200122f5760008081fd5b82825295830195908301906200120b565b92890151929750919450505050808211156200125b57600080fd5b506200126a8582860162001116565b9150509250929050565b600181811c908216806200128957607f821691505b602082108103620012aa57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200026a57600081815260208120601f850160051c81016020861015620012d95750805b601f850160051c820191505b81811015620012fa57828155600101620012e5565b505050505050565b81516001600160401b038111156200131e576200131e620010a7565b62001336816200132f845462001274565b84620012b0565b602080601f8311600181146200136e5760008415620013555750858301515b600019600386901b1c1916600185901b178555620012fa565b600085815260208120601f198616915b828110156200139f578886015182559484019460019091019084016200137e565b5085821015620013be5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016200140f576200140f620013e4565b5060010190565b600060018060a01b038087168352808616602084015250836040830152608060608301528251806080840152620014558160a0850160208701620010f0565b601f01601f19169190910160a00195945050505050565b6000602082840312156200147f57600080fd5b81516001600160e01b03198116811462000dc757600080fd5b8181038181111562000be15762000be1620013e4565b634e487b7160e01b600052603160045260246000fd5b8082018082111562000be15762000be1620013e4565b60805160a05160c05160e0516101005161012051612f976200152a60003960006112a6015260006112f5015260006112d001526000611229015260006112530152600061127d0152612f976000f3fe608060405234801561001057600080fd5b50600436106101e55760003560e01c80635c19a95c1161010f5780639ab24eb0116100a2578063c87b56dd11610071578063c87b56dd14610411578063d204c45e14610424578063e985e9c514610437578063f2fde38b1461047357600080fd5b80639ab24eb0146103c5578063a22cb465146103d8578063b88d4fde146103eb578063c3cda520146103fe57600080fd5b80637ecebe00116100de5780637ecebe00146103865780638da5cb5b146103995780638e539e8c146103aa57806395d89b41146103bd57600080fd5b80635c19a95c146103455780636352211e1461035857806370a082311461036b578063715018a61461037e57600080fd5b80632f745c591161018757806342966c681161015657806342966c68146102e05780634f6ccce7146102f3578063587cde1e14610306578063593aa2831461033257600080fd5b80632f745c591461029f5780633644e515146102b25780633a46b1a8146102ba57806342842e0e146102cd57600080fd5b8063095ea7b3116101c3578063095ea7b31461025257806318160ddd1461026757806323b872dd1461027957806326926d461461028c57600080fd5b806301ffc9a7146101ea57806306fdde0314610212578063081812fc14610227575b600080fd5b6101fd6101f8366004612850565b610486565b60405190151581526020015b60405180910390f35b61021a610497565b60405161020991906128bd565b61023a6102353660046128d0565b610529565b6040516001600160a01b039091168152602001610209565b610265610260366004612905565b610550565b005b6008545b604051908152602001610209565b61026561028736600461292f565b61066a565b61026561029a3660046128d0565b61069c565b61026b6102ad366004612905565b6106b0565b61026b610746565b61026b6102c8366004612905565b610755565b6102656102db36600461292f565b61077e565b6102656102ee3660046128d0565b610799565b61026b6103013660046128d0565b6107be565b61023a61031436600461296b565b6001600160a01b039081166000908152600c60205260409020541690565b610265610340366004612a32565b610851565b61026561035336600461296b565b610867565b61023a6103663660046128d0565b610872565b61026b61037936600461296b565b6108d2565b610265610958565b61026b61039436600461296b565b61096c565b600b546001600160a01b031661023a565b61026b6103b83660046128d0565b61098a565b61021a6109e6565b61026b6103d336600461296b565b6109f5565b6102656103e6366004612a79565b610a25565b6102656103f9366004612ab5565b610a30565b61026561040c366004612b31565b610a68565b61021a61041f3660046128d0565b610b95565b610265610432366004612b91565b610ba0565b6101fd610445366004612bc9565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61026561048136600461296b565b610bd7565b600061049182610ecf565b92915050565b6060600080546104a690612bfc565b80601f01602080910402602001604051908101604052809291908181526020018280546104d290612bfc565b801561051f5780601f106104f45761010080835404028352916020019161051f565b820191906000526020600020905b81548152906001019060200180831161050257829003601f168201915b5050505050905090565b600061053482610ef4565b506000908152600460205260409020546001600160a01b031690565b600061055b82610872565b9050806001600160a01b0316836001600160a01b0316036105cd5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806105e957506105e98133610445565b61065b5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016105c4565b6106658383610f53565b505050565b610675335b82610fc1565b6106915760405162461bcd60e51b81526004016105c490612c30565b610665838383611040565b6106a46111b9565b6106ad81611213565b50565b60006106bb836108d2565b821061071d5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b60648201526084016105c4565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b600061075061121c565b905090565b6001600160a01b0382166000908152600d602052604081206107779083611343565b9392505050565b61066583838360405180602001604052806000815250610a30565b6107a23361066f565b6106a45760405162461bcd60e51b81526004016105c490612c30565b60006107c960085490565b821061082c5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b60648201526084016105c4565b6008828154811061083f5761083f612c7d565b90600052602060002001549050919050565b6108596111b9565b610863828261145f565b5050565b3361086381836114f2565b6000818152600260205260408120546001600160a01b0316806104915760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016105c4565b60006001600160a01b03821661093c5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016105c4565b506001600160a01b031660009081526003602052604090205490565b6109606111b9565b61096a6000611564565b565b6001600160a01b0381166000908152600f6020526040812054610491565b60004382106109db5760405162461bcd60e51b815260206004820152601a60248201527f566f7465733a20626c6f636b206e6f7420796574206d696e656400000000000060448201526064016105c4565b610491600e83611343565b6060600180546104a690612bfc565b6001600160a01b0381166000908152600d60205260408120610a16906115b6565b6001600160e01b031692915050565b6108633383836115f0565b610a3a3383610fc1565b610a565760405162461bcd60e51b81526004016105c490612c30565b610a62848484846116be565b50505050565b83421115610ab85760405162461bcd60e51b815260206004820152601860248201527f566f7465733a207369676e61747572652065787069726564000000000000000060448201526064016105c4565b604080517fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60208201526001600160a01b038816918101919091526060810186905260808101859052600090610b3290610b2a9060a001604051602081830303815290604052805190602001206116f1565b85858561173f565b9050610b3d81611767565b8614610b825760405162461bcd60e51b8152602060048201526014602482015273566f7465733a20696e76616c6964206e6f6e636560601b60448201526064016105c4565b610b8c81886114f2565b50505050505050565b60606104918261178f565b610ba86111b9565b6000610bb360105490565b9050610bc3601080546001019055565b610bcd8382611897565b610665818361145f565b610bdf6111b9565b6001600160a01b038116610c445760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105c4565b6106ad81611564565b5490565b80546001019055565b6001600160a01b03163b151590565b6001811115610cd85760405162461bcd60e51b815260206004820152603560248201527f455243373231456e756d657261626c653a20636f6e7365637574697665207472604482015274185b9cd9995c9cc81b9bdd081cdd5c1c1bdc9d1959605a1b60648201526084016105c4565b816001600160a01b038516610d3457610d2f81600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b610d57565b836001600160a01b0316856001600160a01b031614610d5757610d5785826118b1565b6001600160a01b038416610d7357610d6e8161194e565b610d96565b846001600160a01b0316846001600160a01b031614610d9657610d9684826119fd565b5050505050565b610da8848483611a41565b610a62565b60006107778284612ca9565b600080610de485610ddf610dcc886115b6565b6001600160e01b0316868863ffffffff16565b611ab1565b915091505b935093915050565b60006107778284612cbc565b600063ffffffff821115610e625760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b60648201526084016105c4565b5090565b60006001600160e01b03821115610e625760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b60648201526084016105c4565b60006001600160e01b0319821663780e9d6360e01b1480610491575061049182611ae5565b6000818152600260205260409020546001600160a01b03166106ad5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016105c4565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610f8882610872565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610fcd83610872565b9050806001600160a01b0316846001600160a01b0316148061101457506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b806110385750836001600160a01b031661102d84610529565b6001600160a01b0316145b949350505050565b826001600160a01b031661105382610872565b6001600160a01b0316146110795760405162461bcd60e51b81526004016105c490612ccf565b6001600160a01b0382166110db5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016105c4565b6110e88383836001611b35565b826001600160a01b03166110fb82610872565b6001600160a01b0316146111215760405162461bcd60e51b81526004016105c490612ccf565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a46106658383836001611b41565b600b546001600160a01b0316331461096a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105c4565b6106ad81611b4d565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561127557507f000000000000000000000000000000000000000000000000000000000000000046145b1561129f57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b60004382106113945760405162461bcd60e51b815260206004820181905260248201527f436865636b706f696e74733a20626c6f636b206e6f7420796574206d696e656460448201526064016105c4565b600061139f83610dfd565b845490915060008160058111156113fd5760006113bb84611b8d565b6113c59085612cbc565b60008981526020902090915081015463ffffffff90811690861610156113ed578091506113fb565b6113f8816001612ca9565b92505b505b600061140b88868585611c75565b905080156114475761143088611422600184612cbc565b600091825260209091200190565b5464010000000090046001600160e01b031661144a565b60005b6001600160e01b031698975050505050505050565b6000828152600260205260409020546001600160a01b03166114da5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b60648201526084016105c4565b6000828152600a602052604090206106658282612d62565b6001600160a01b038281166000818152600c602052604080822080548686166001600160a01b0319821681179092559151919094169392849290917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a4610665818361155f86611cd3565b611cde565b600b80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b805460009080156115e7576115d083611422600184612cbc565b5464010000000090046001600160e01b0316610777565b60009392505050565b816001600160a01b0316836001600160a01b0316036116515760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016105c4565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6116c9848484611040565b6116d584848484611e1b565b610a625760405162461bcd60e51b81526004016105c490612e22565b60006104916116fe61121c565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b600080600061175087878787611f19565b9150915061175d81611fdd565b5095945050505050565b6001600160a01b0381166000908152600f602052604090208054600181018255905b50919050565b606061179a82610ef4565b6000828152600a6020526040812080546117b390612bfc565b80601f01602080910402602001604051908101604052809291908181526020018280546117df90612bfc565b801561182c5780601f106118015761010080835404028352916020019161182c565b820191906000526020600020905b81548152906001019060200180831161180f57829003601f168201915b50505050509050600061184a60408051602081019091526000815290565b9050805160000361185c575092915050565b81511561188e578082604051602001611876929190612e74565b60405160208183030381529060405292505050919050565b61103884612127565b61086382826040518060200160405280600081525061219a565b600060016118be846108d2565b6118c89190612cbc565b60008381526007602052604090205490915080821461191b576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b60085460009061196090600190612cbc565b6000838152600960205260408120546008805493945090928490811061198857611988612c7d565b9060005260206000200154905080600883815481106119a9576119a9612c7d565b60009182526020808320909101929092558281526009909152604080822084905585825281205560088054806119e1576119e1612ea3565b6001900381819060005260206000200160009055905550505050565b6000611a08836108d2565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b6001600160a01b038316611a6057611a5d600e610dad83610db9565b50505b6001600160a01b038216611a7f57611a7c600e610df183610db9565b50505b6001600160a01b038381166000908152600c602052604080822054858416835291205461066592918216911683611cde565b600080611acf84611ac143610dfd565b611aca86610e66565b6121cd565b6001600160e01b03918216969116945092505050565b60006001600160e01b031982166380ac58cd60e01b1480611b1657506001600160e01b03198216635b5e139f60e01b145b8061049157506301ffc9a760e01b6001600160e01b0319831614610491565b610a6284848484610c69565b610a6284848484610d9d565b611b5681612370565b6000818152600a602052604090208054611b6f90612bfc565b1590506106ad576000818152600a602052604081206106ad916127f0565b600081600003611b9f57506000919050565b60006001611bac8461241d565b901c6001901b90506001818481611bc557611bc5612eb9565b048201901c90506001818481611bdd57611bdd612eb9565b048201901c90506001818481611bf557611bf5612eb9565b048201901c90506001818481611c0d57611c0d612eb9565b048201901c90506001818481611c2557611c25612eb9565b048201901c90506001818481611c3d57611c3d612eb9565b048201901c90506001818481611c5557611c55612eb9565b048201901c905061077781828581611c6f57611c6f612eb9565b046124b1565b60005b81831015611ccb576000611c8c84846124c7565b60008781526020902090915063ffffffff86169082015463ffffffff161115611cb757809250611cc5565b611cc2816001612ca9565b93505b50611c78565b509392505050565b6000610491826108d2565b816001600160a01b0316836001600160a01b031614158015611d005750600081115b15610665576001600160a01b03831615611d8e576001600160a01b0383166000908152600d602052604081208190611d3b90610df185610db9565b91509150846001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051611d83929190918252602082015260400190565b60405180910390a250505b6001600160a01b03821615610665576001600160a01b0382166000908152600d602052604081208190611dc490610dad85610db9565b91509150836001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051611e0c929190918252602082015260400190565b60405180910390a25050505050565b60006001600160a01b0384163b15611f1157604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611e5f903390899088908890600401612ecf565b6020604051808303816000875af1925050508015611e9a575060408051601f3d908101601f19168201909252611e9791810190612f0c565b60015b611ef7573d808015611ec8576040519150601f19603f3d011682016040523d82523d6000602084013e611ecd565b606091505b508051600003611eef5760405162461bcd60e51b81526004016105c490612e22565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611038565b506001611038565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115611f505750600090506003611fd4565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611fa4573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611fcd57600060019250925050611fd4565b9150600090505b94509492505050565b6000816004811115611ff157611ff1612f29565b03611ff95750565b600181600481111561200d5761200d612f29565b0361205a5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016105c4565b600281600481111561206e5761206e612f29565b036120bb5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016105c4565b60038160048111156120cf576120cf612f29565b036106ad5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016105c4565b606061213282610ef4565b600061214960408051602081019091526000815290565b905060008151116121695760405180602001604052806000815250610777565b80612173846124e2565b604051602001612184929190612e74565b6040516020818303038152906040529392505050565b6121a48383612575565b6121b16000848484611e1b565b6106655760405162461bcd60e51b81526004016105c490612e22565b8254600090819080156123165760006121eb87611422600185612cbc565b60408051808201909152905463ffffffff8082168084526401000000009092046001600160e01b03166020840152919250908716101561226d5760405162461bcd60e51b815260206004820152601760248201527f436865636b706f696e743a20696e76616c6964206b657900000000000000000060448201526064016105c4565b805163ffffffff8088169116036122b6578461228e88611422600186612cbc565b80546001600160e01b03929092166401000000000263ffffffff909216919091179055612306565b6040805180820190915263ffffffff80881682526001600160e01b0380881660208085019182528b54600181018d5560008d81529190912094519151909216640100000000029216919091179101555b602001519250839150610de99050565b50506040805180820190915263ffffffff80851682526001600160e01b0380851660208085019182528854600181018a5560008a815291822095519251909316640100000000029190931617920191909155905081610de9565b600061237b82610872565b905061238b816000846001611b35565b61239482610872565b600083815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0385168085526003845282852080546000190190558785526002909352818420805490911690555192935084927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a4610863816000846001611b41565b600080608083901c1561243257608092831c92015b604083901c1561244457604092831c92015b602083901c1561245657602092831c92015b601083901c1561246857601092831c92015b600883901c1561247a57600892831c92015b600483901c1561248c57600492831c92015b600283901c1561249e57600292831c92015b600183901c156104915760010192915050565b60008183106124c05781610777565b5090919050565b60006124d66002848418612f3f565b61077790848416612ca9565b606060006124ef83612718565b600101905060008167ffffffffffffffff81111561250f5761250f612986565b6040519080825280601f01601f191660200182016040528015612539576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461254357509392505050565b6001600160a01b0382166125cb5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016105c4565b6000818152600260205260409020546001600160a01b0316156126305760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016105c4565b61263e600083836001611b35565b6000818152600260205260409020546001600160a01b0316156126a35760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016105c4565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4610863600083836001611b41565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106127575772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310612783576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106127a157662386f26fc10000830492506010015b6305f5e10083106127b9576305f5e100830492506008015b61271083106127cd57612710830492506004015b606483106127df576064830492506002015b600a83106104915760010192915050565b5080546127fc90612bfc565b6000825580601f1061280c575050565b601f0160209004906000526020600020908101906106ad91905b80821115610e625760008155600101612826565b6001600160e01b0319811681146106ad57600080fd5b60006020828403121561286257600080fd5b81356107778161283a565b60005b83811015612888578181015183820152602001612870565b50506000910152565b600081518084526128a981602086016020860161286d565b601f01601f19169290920160200192915050565b6020815260006107776020830184612891565b6000602082840312156128e257600080fd5b5035919050565b80356001600160a01b038116811461290057600080fd5b919050565b6000806040838503121561291857600080fd5b612921836128e9565b946020939093013593505050565b60008060006060848603121561294457600080fd5b61294d846128e9565b925061295b602085016128e9565b9150604084013590509250925092565b60006020828403121561297d57600080fd5b610777826128e9565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156129b7576129b7612986565b604051601f8501601f19908116603f011681019082821181831017156129df576129df612986565b816040528093508581528686860111156129f857600080fd5b858560208301376000602087830101525050509392505050565b600082601f830112612a2357600080fd5b6107778383356020850161299c565b60008060408385031215612a4557600080fd5b82359150602083013567ffffffffffffffff811115612a6357600080fd5b612a6f85828601612a12565b9150509250929050565b60008060408385031215612a8c57600080fd5b612a95836128e9565b915060208301358015158114612aaa57600080fd5b809150509250929050565b60008060008060808587031215612acb57600080fd5b612ad4856128e9565b9350612ae2602086016128e9565b925060408501359150606085013567ffffffffffffffff811115612b0557600080fd5b8501601f81018713612b1657600080fd5b612b258782356020840161299c565b91505092959194509250565b60008060008060008060c08789031215612b4a57600080fd5b612b53876128e9565b95506020870135945060408701359350606087013560ff81168114612b7757600080fd5b9598949750929560808101359460a0909101359350915050565b60008060408385031215612ba457600080fd5b612bad836128e9565b9150602083013567ffffffffffffffff811115612a6357600080fd5b60008060408385031215612bdc57600080fd5b612be5836128e9565b9150612bf3602084016128e9565b90509250929050565b600181811c90821680612c1057607f821691505b60208210810361178957634e487b7160e01b600052602260045260246000fd5b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561049157610491612c93565b8181038181111561049157610491612c93565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b601f82111561066557600081815260208120601f850160051c81016020861015612d3b5750805b601f850160051c820191505b81811015612d5a57828155600101612d47565b505050505050565b815167ffffffffffffffff811115612d7c57612d7c612986565b612d9081612d8a8454612bfc565b84612d14565b602080601f831160018114612dc55760008415612dad5750858301515b600019600386901b1c1916600185901b178555612d5a565b600085815260208120601f198616915b82811015612df457888601518255948401946001909101908401612dd5565b5085821015612e125787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60008351612e8681846020880161286d565b835190830190612e9a81836020880161286d565b01949350505050565b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612f0290830184612891565b9695505050505050565b600060208284031215612f1e57600080fd5b81516107778161283a565b634e487b7160e01b600052602160045260246000fd5b600082612f5c57634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220cdb852c06137187fc4e027d9bd1ce634e4df5f0e540ed0aa957aac2417535c1764736f6c634300081100334552433732313a207472616e7366657220746f206e6f6e204552433732315265dec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724'

export const GOV_ABI = [
  {
    inputs: [
      {
        internalType: 'contract IVotes',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_manifesto',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_votingDelay',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_votingPeriod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_votingThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quorum',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'Empty',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'cid',
        type: 'string',
      },
    ],
    name: 'ManifestoUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'ProposalCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'signatures',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endBlock',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'ProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'ProposalExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldProposalThreshold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256',
      },
    ],
    name: 'ProposalThresholdSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldQuorumNumerator',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256',
      },
    ],
    name: 'QuorumNumeratorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'VoteCast',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'VoteCastWithParams',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingDelay',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingDelay',
        type: 'uint256',
      },
    ],
    name: 'VotingDelaySet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingPeriod',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingPeriod',
        type: 'uint256',
      },
    ],
    name: 'VotingPeriodSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
    ],
    name: 'castVote',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'castVoteBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'castVoteWithReason',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32',
      },
    ],
    name: 'execute',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'getVotesWithParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasVoted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32',
      },
    ],
    name: 'hashProposal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manifesto',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalDeadline',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalSnapshot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposalThreshold',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'proposalVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'againstVotes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'forVotes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'abstainVotes',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'propose',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'quorum',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quorumDenominator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'cid',
        type: 'string',
      },
    ],
    name: 'setManifesto',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256',
      },
    ],
    name: 'setProposalThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newVotingDelay',
        type: 'uint256',
      },
    ],
    name: 'setVotingDelay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newVotingPeriod',
        type: 'uint256',
      },
    ],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    name: 'state',
    outputs: [
      {
        internalType: 'enum IGovernor.ProposalState',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract IVotes',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256',
      },
    ],
    name: 'updateQuorumNumerator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingDelay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingPeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]
export const GOV_BYTECODE =
  '0x6101606040523480156200001257600080fd5b506040516200400b3803806200400b83398101604081905262000035916200081c565b808785858589806200005b6040805180820190915260018152603160f81b602082015290565b815160209283012081519183019190912060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818301969096526060810194909452608080850193909352308483018190528151808603909301835260c094850190915281519190950120905291909152610120526000620000f882826200095c565b506200010690508362000154565b620001118262000195565b6200011c816200023c565b5050506001600160a01b03166101405262000137816200027d565b50600a6200014687826200095c565b505050505050505062000a50565b60045460408051918252602082018390527fc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93910160405180910390a1600455565b60008111620001fb5760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f7253657474696e67733a20766f74696e6720706572696f6420604482015266746f6f206c6f7760c81b60648201526084015b60405180910390fd5b60055460408051918252602082018390527f7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e8828910160405180910390a1600555565b60065460408051918252602082018390527fccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461910160405180910390a1600655565b6064811115620003025760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a401620001f2565b60006200030e620003f5565b90508015801590620003205750600954155b156200039b5760096000016040518060400160405280600063ffffffff16815260200162000359846200042d60201b620014e51760201c565b6001600160e01b0390811690915282546001810184556000938452602093849020835194909301519091166401000000000263ffffffff909316929092179101555b620003b68260096200049c60201b620015521790919060201c565b505060408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b600954600090156200042657620004186009620004ef60201b620015881760201c565b6001600160e01b0316905090565b5060085490565b60006001600160e01b03821115620004985760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b6064820152608401620001f2565b5090565b600080620004d984600001620004bd436200053d60201b620015cf1760201c565b620004d3866200042d60201b620014e51760201c565b620005a4565b6001600160e01b03918216969116945092505050565b8054600090801562000533576200051b836200050d60018462000a28565b600091825260209091200190565b5464010000000090046001600160e01b031662000536565b60005b9392505050565b600063ffffffff821115620004985760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b6064820152608401620001f2565b825460009081908015620006f9576000620005c6876200050d60018562000a28565b60408051808201909152905463ffffffff8082168084526401000000009092046001600160e01b0316602084015291925090871610156200064a5760405162461bcd60e51b815260206004820152601760248201527f436865636b706f696e743a20696e76616c6964206b65790000000000000000006044820152606401620001f2565b805163ffffffff8088169116036200069857846200066f886200050d60018662000a28565b80546001600160e01b03929092166401000000000263ffffffff909216919091179055620006e8565b6040805180820190915263ffffffff80881682526001600160e01b0380881660208085019182528b54600181018d5560008d81529190912094519151909216640100000000029216919091179101555b6020015192508391506200074f9050565b50506040805180820190915263ffffffff80851682526001600160e01b0380851660208085019182528854600181018a5560008a8152918220955192519093166401000000000291909316179201919091559050815b935093915050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200077f57600080fd5b81516001600160401b03808211156200079c576200079c62000757565b604051601f8301601f19908116603f01168101908282118183101715620007c757620007c762000757565b81604052838152602092508683858801011115620007e457600080fd5b600091505b83821015620008085785820183015181830184015290820190620007e9565b600093810190920192909252949350505050565b600080600080600080600060e0888a0312156200083857600080fd5b87516001600160a01b03811681146200085057600080fd5b60208901519097506001600160401b03808211156200086e57600080fd5b6200087c8b838c016200076d565b975060408a01519150808211156200089357600080fd5b50620008a28a828b016200076d565b955050606088015193506080880151925060a0880151915060c0880151905092959891949750929550565b600181811c90821680620008e257607f821691505b6020821081036200090357634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200095757600081815260208120601f850160051c81016020861015620009325750805b601f850160051c820191505b8181101562000953578281556001016200093e565b5050505b505050565b81516001600160401b0381111562000978576200097862000757565b6200099081620009898454620008cd565b8462000909565b602080601f831160018114620009c85760008415620009af5750858301515b600019600386901b1c1916600185901b17855562000953565b600085815260208120601f198616915b82811015620009f957888601518255948401946001909101908401620009d8565b508582101562000a185787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b8181038181111562000a4a57634e487b7160e01b600052601160045260246000fd5b92915050565b60805160a05160c05160e05161010051610120516101405161355262000ab9600039600081816107dc01528181611d3a0152611ec501526000612179015260006121c8015260006121a3015260006120fc015260006121260152600061215001526135526000f3fe6080604052600436106102345760003560e01c806370b0f6601161012e578063c59057e4116100ab578063eb9019d41161006f578063eb9019d41461073e578063ece40cc11461075e578063f23a6e611461077e578063f8ce560a146107aa578063fc0c546a146107ca57600080fd5b8063c59057e41461066f578063dd4e2ba51461068f578063deaaa7cc146106d5578063e2f3dce014610709578063ea0217cf1461071e57600080fd5b8063a7713a70116100f2578063a7713a70146105e6578063b58131b0146105fb578063bc197c8114610610578063c01f9e371461063c578063c28bc2fa1461065c57600080fd5b806370b0f660146105525780637b3c71d3146105725780637d5e81e21461059257806397c3d334146105b25780639a802a6d146105c657600080fd5b80632fe3e261116101bc578063544ffc9c11610180578063544ffc9c1461047357806354fd4d50146104c857806356781388146104f25780635f398a141461051257806360c4247f1461053257600080fd5b80632fe3e261146103935780633932abb1146103c75780633bccf4fd146103dc5780633e4f49e6146103fc578063438596321461042957600080fd5b806306fdde031161020357806306fdde03146102da578063150b7a02146102fc5780631985ba76146103405780632656227d146103605780632d63f6931461037357600080fd5b806301ffc9a71461024257806302a251a314610277578063034201811461029a57806306f3f9e6146102ba57600080fd5b3661023d57005b005b600080fd5b34801561024e57600080fd5b5061026261025d36600461267d565b610816565b60405190151581526020015b60405180910390f35b34801561028357600080fd5b5061028c610883565b60405190815260200161026e565b3480156102a657600080fd5b5061028c6102b53660046127b3565b610893565b3480156102c657600080fd5b5061023b6102d5366004612859565b61098b565b3480156102e657600080fd5b506102ef6109d6565b60405161026e91906128c2565b34801561030857600080fd5b506103276103173660046128ec565b630a85bd0160e11b949350505050565b6040516001600160e01b0319909116815260200161026e565b34801561034c57600080fd5b5061023b61035b366004612953565b610a68565b61028c61036e366004612af6565b610ae5565b34801561037f57600080fd5b5061028c61038e366004612859565b610c0c565b34801561039f57600080fd5b5061028c7fb3b3f3b703cd84ce352197dcff232b1b5d3cfb2025ce47cf04742d0651f1af8881565b3480156103d357600080fd5b5061028c610c43565b3480156103e857600080fd5b5061028c6103f7366004612b85565b610c4e565b34801561040857600080fd5b5061041c610417366004612859565b610cc4565b60405161026e9190612be9565b34801561043557600080fd5b50610262610444366004612c11565b60008281526007602090815260408083206001600160a01b038516845260030190915290205460ff1692915050565b34801561047f57600080fd5b506104ad61048e366004612859565b6000908152600760205260409020805460018201546002909201549092565b6040805193845260208401929092529082015260600161026e565b3480156104d457600080fd5b506040805180820190915260018152603160f81b60208201526102ef565b3480156104fe57600080fd5b5061028c61050d366004612c3d565b610dd3565b34801561051e57600080fd5b5061028c61052d366004612c60565b610dfc565b34801561053e57600080fd5b5061028c61054d366004612859565b610e46565b34801561055e57600080fd5b5061023b61056d366004612859565b610edd565b34801561057e57600080fd5b5061028c61058d366004612ce3565b610f1c565b34801561059e57600080fd5b5061028c6105ad366004612d3c565b610f6e565b3480156105be57600080fd5b50606461028c565b3480156105d257600080fd5b5061028c6105e1366004612ddc565b611231565b3480156105f257600080fd5b5061028c611248565b34801561060757600080fd5b5061028c611272565b34801561061c57600080fd5b5061032761062b366004612e32565b63bc197c8160e01b95945050505050565b34801561064857600080fd5b5061028c610657366004612859565b61127d565b61023b61066a366004612ec1565b6112ac565b34801561067b57600080fd5b5061028c61068a366004612af6565b611373565b34801561069b57600080fd5b506040805180820190915260208082527f737570706f72743d627261766f2671756f72756d3d666f722c6162737461696e908201526102ef565b3480156106e157600080fd5b5061028c7f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b34801561071557600080fd5b506102ef6113ad565b34801561072a57600080fd5b5061023b610739366004612859565b61143b565b34801561074a57600080fd5b5061028c610759366004612f02565b61147a565b34801561076a57600080fd5b5061023b610779366004612859565b61149b565b34801561078a57600080fd5b50610327610799366004612f2c565b63f23a6e6160e01b95945050505050565b3480156107b657600080fd5b5061028c6107c5366004612859565b6114da565b3480156107d657600080fd5b506107fe7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161026e565b60006001600160e01b0319821663bf26d89760e01b148061084757506001600160e01b031982166379dd796f60e01b145b8061086257506001600160e01b03198216630271189760e51b145b8061087d57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061088e60055490565b905090565b60008061093761092f7fb3b3f3b703cd84ce352197dcff232b1b5d3cfb2025ce47cf04742d0651f1af888c8c8c8c6040516108cf929190612f90565b60405180910390208b80519060200120604051602001610914959493929190948552602085019390935260ff9190911660408401526060830152608082015260a00190565b60405160208183030381529060405280519060200120611634565b868686611682565b905061097d8a828b8b8b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508d92506116a0915050565b9a9950505050505050505050565b3330146109b35760405162461bcd60e51b81526004016109aa90612fa0565b60405180910390fd5b6109ca565b806109c36002611805565b036109b857505b6109d381611884565b50565b6060600080546109e590612fd7565b80601f0160208091040260200160405190810160405280929190818152602001828054610a1190612fd7565b8015610a5e5780601f10610a3357610100808354040283529160200191610a5e565b820191906000526020600020905b815481529060010190602001808311610a4157829003601f168201915b5050505050905090565b333014610a875760405162461bcd60e51b81526004016109aa90612fa0565b610a9e565b80610a976002611805565b03610a8c57505b600a610aaa828261305c565b507f224d2c7fdc536a5b2a879a07352ceed6752e43069abb2a8444725679666c372e81604051610ada91906128c2565b60405180910390a150565b600080610af486868686611373565b90506000610b0182610cc4565b90506004816007811115610b1757610b17612bd3565b1480610b3457506005816007811115610b3257610b32612bd3565b145b610b8a5760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756044820152601b60fa1b60648201526084016109aa565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610be882888888886119d0565b610bf58288888888611a5d565b610c0282888888886119d0565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b600061088e60045490565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff851660608201526000908190610c9c9061092f90608001610914565b9050610cb987828860405180602001604052806000815250611b53565b979650505050505050565b6000818152600160205260408120600281015460ff1615610ce85750600792915050565b6002810154610100900460ff1615610d035750600292915050565b6000610d0e84610c0c565b905080600003610d605760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c20696400000060448201526064016109aa565b438110610d71575060009392505050565b6000610d7c8561127d565b9050438110610d9057506001949350505050565b610d9985611b7f565b8015610db8575060008581526007602052604090208054600190910154115b15610dc857506004949350505050565b506003949350505050565b600080339050610df484828560405180602001604052806000815250611b53565b949350505050565b600080339050610cb987828888888080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508a92506116a0915050565b600954600090808203610e5d575050600854919050565b60006009610e6c600184613131565b81548110610e7c57610e7c613144565b60009182526020918290206040805180820190915291015463ffffffff8116808352600160201b9091046001600160e01b03169282019290925291508410610ed257602001516001600160e01b03169392505050565b610df4600985611bb6565b333014610efc5760405162461bcd60e51b81526004016109aa90612fa0565b610f13565b80610f0c6002611805565b03610f0157505b6109d381611c68565b600080339050610f6486828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611b5392505050565b9695505050505050565b6000610f78611272565b610f8733610759600143613131565b1015610fef5760405162461bcd60e51b815260206004820152603160248201527f476f7665726e6f723a2070726f706f73657220766f7465732062656c6f7720706044820152701c9bdc1bdcd85b081d1a1c995cda1bdb19607a1b60648201526084016109aa565b60006110048686868680519060200120611373565b905084518651146110275760405162461bcd60e51b81526004016109aa9061315a565b83518651146110485760405162461bcd60e51b81526004016109aa9061315a565b60008651116110995760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c000000000000000060448201526064016109aa565b600081815260016020908152604091829020825191820190925281546001600160401b031690819052156111195760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b60648201526084016109aa565b600061112b611126610c43565b611ca9565b61113443611ca9565b61113e919061319b565b9050600061114d611126610883565b611157908361319b565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b038111156111cf576111cf6126fe565b60405190808252806020026020018201604052801561120257816020015b60608152602001906001900390816111ed5790505b508c88888e60405161121c9998979695949392919061328b565b60405180910390a15091979650505050505050565b600061123e848484611d11565b90505b9392505050565b6009546000901561126b5761125d6009611588565b6001600160e01b0316905090565b5060085490565b600061088e60065490565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610c34565b3330146112cb5760405162461bcd60e51b81526004016109aa90612fa0565b6112e2565b806112db6002611805565b036112d057505b600080856001600160a01b0316858585604051611300929190612f90565b60006040518083038185875af1925050503d806000811461133d576040519150601f19603f3d011682016040523d82523d6000602084013e611342565b606091505b509150915061136a82826040518060600160405280602881526020016134ce60289139611da7565b50505050505050565b60008484848460405160200161138c949392919061337a565b60408051601f19818403018152919052805160209091012095945050505050565b600a80546113ba90612fd7565b80601f01602080910402602001604051908101604052809291908181526020018280546113e690612fd7565b80156114335780601f1061140857610100808354040283529160200191611433565b820191906000526020600020905b81548152906001019060200180831161141657829003601f168201915b505050505081565b33301461145a5760405162461bcd60e51b81526004016109aa90612fa0565b611471565b8061146a6002611805565b0361145f57505b6109d381611dc0565b6000611241838361149660408051602081019091526000815290565b611d11565b3330146114ba5760405162461bcd60e51b81526004016109aa90612fa0565b6114d1565b806114ca6002611805565b036114bf57505b6109d381611e61565b600061087d82611ea2565b60006001600160e01b0382111561154e5760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b60648201526084016109aa565b5090565b60008061157084611562436115cf565b61156b866114e5565b611f4c565b6001600160e01b0391821693501690505b9250929050565b805460009080156115c6576115b0836115a2600184613131565b600091825260209091200190565b54600160201b90046001600160e01b0316611241565b60009392505050565b600063ffffffff82111561154e5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b60648201526084016109aa565b600061087d6116416120ef565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b600080600061169387878787612216565b91509150610c02816122da565b60008581526001602081905260408220906116ba88610cc4565b60078111156116cb576116cb612bd3565b146117245760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b60648201526084016109aa565b604080516020810190915281546001600160401b03169081905260009061174d90889086611d11565b905061175c8888888488612424565b83516000036117b157866001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4898884896040516117a494939291906133c5565b60405180910390a2610cb9565b866001600160a01b03167fe2babfbac5889a709b63bb7f598b324e08bc5a4fb9ec647fb3cbc9ec07eb871289888489896040516117f29594939291906133ed565b60405180910390a2979650505050505050565b60006118208254600f81810b600160801b909204900b131590565b1561183e57604051631ed9509560e11b815260040160405180910390fd5b508054600f0b6000818152600180840160205260408220805492905583546fffffffffffffffffffffffffffffffff191692016001600160801b03169190911790915590565b60648111156119075760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a4016109aa565b6000611911611248565b905080158015906119225750600954155b1561198657604080518082019091526000815260099060208101611945846114e5565b6001600160e01b039081169091528254600181018455600093845260209384902083519490930151909116600160201b0263ffffffff909316929092179101555b611991600983611552565b505060408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611a56565b8451811015611a5457306001600160a01b03168582815181106119fa576119fa613144565b60200260200101516001600160a01b031603611a4457611a44838281518110611a2557611a25613144565b602002602001015180519060200120600261259e90919063ffffffff16565b611a4d81613433565b90506119d5565b505b5050505050565b60006040518060600160405280602781526020016134f660279139905060005b855181101561136a57600080878381518110611a9b57611a9b613144565b60200260200101516001600160a01b0316878481518110611abe57611abe613144565b6020026020010151878581518110611ad857611ad8613144565b6020026020010151604051611aed919061344c565b60006040518083038185875af1925050503d8060008114611b2a576040519150601f19603f3d011682016040523d82523d6000602084013e611b2f565b606091505b5091509150611b3f828286611da7565b50505080611b4c90613433565b9050611a7d565b6000611b7685858585611b7160408051602081019091526000815290565b6116a0565b95945050505050565b600081815260076020526040812060028101546001820154611ba19190613468565b611bad6107c585610c0c565b11159392505050565b6000438210611c075760405162461bcd60e51b815260206004820181905260248201527f436865636b706f696e74733a20626c6f636b206e6f7420796574206d696e656460448201526064016109aa565b6000611c12836115cf565b84549091506000611c25868483856125da565b90508015611c5257611c3c866115a2600184613131565b54600160201b90046001600160e01b0316611c55565b60005b6001600160e01b03169695505050505050565b60045460408051918252602082018390527fc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93910160405180910390a1600455565b60006001600160401b0382111561154e5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b60648201526084016109aa565b604051630748d63560e31b81526001600160a01b038481166004830152602482018490526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a890604401602060405180830381865afa158015611d83573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061123e919061347b565b60608315611db6575081611241565b6112418383612638565b60008111611e205760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f7253657474696e67733a20766f74696e6720706572696f6420604482015266746f6f206c6f7760c81b60648201526084016109aa565b60055460408051918252602082018390527f7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e8828910160405180910390a1600555565b60065460408051918252602082018390527fccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461910160405180910390a1600655565b60006064611eaf83610e46565b604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c90602401602060405180830381865afa158015611f14573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f38919061347b565b611f429190613494565b61087d91906134ab565b825460009081908015612092576000611f6a876115a2600185613131565b60408051808201909152905463ffffffff808216808452600160201b9092046001600160e01b031660208401529192509087161015611feb5760405162461bcd60e51b815260206004820152601760248201527f436865636b706f696e743a20696e76616c6964206b657900000000000000000060448201526064016109aa565b805163ffffffff808816911603612033578461200c886115a2600186613131565b80546001600160e01b0392909216600160201b0263ffffffff909216919091179055612082565b6040805180820190915263ffffffff80881682526001600160e01b0380881660208085019182528b54600181018d5560008d81529190912094519151909216600160201b029216919091179101555b6020015192508391506120e79050565b50506040805180820190915263ffffffff80851682526001600160e01b0380851660208085019182528854600181018a5560008a815291822095519251909316600160201b0291909316179201919091559050815b935093915050565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561214857507f000000000000000000000000000000000000000000000000000000000000000046145b1561217257507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561224d57506000905060036122d1565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156122a1573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166122ca576000600192509250506122d1565b9150600090505b94509492505050565b60008160048111156122ee576122ee612bd3565b036122f65750565b600181600481111561230a5761230a612bd3565b036123575760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016109aa565b600281600481111561236b5761236b612bd3565b036123b85760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016109aa565b60038160048111156123cc576123cc612bd3565b036109d35760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016109aa565b60008581526007602090815260408083206001600160a01b0388168452600381019092529091205460ff16156124ac5760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72566f74696e6753696d706c653a20766f746520616c726561604482015266191e4818d85cdd60ca1b60648201526084016109aa565b6001600160a01b03851660009081526003820160205260409020805460ff1916600117905560ff84166124f857828160000160008282546124ed9190613468565b90915550611a549050565b60001960ff85160161251857828160010160008282546124ed9190613468565b60011960ff85160161253857828160020160008282546124ed9190613468565b60405162461bcd60e51b815260206004820152603560248201527f476f7665726e6f72566f74696e6753696d706c653a20696e76616c69642076616044820152746c756520666f7220656e756d20566f74655479706560581b60648201526084016109aa565b8154600160801b90819004600f0b6000818152600180860160205260409091209390935583546001600160801b03908116939091011602179055565b60005b818310156126305760006125f18484612662565b60008781526020902090915063ffffffff86169082015463ffffffff16111561261c5780925061262a565b612627816001613468565b93505b506125dd565b509392505050565b8151156126485781518083602001fd5b8060405162461bcd60e51b81526004016109aa91906128c2565b600061267160028484186134ab565b61124190848416613468565b60006020828403121561268f57600080fd5b81356001600160e01b03198116811461124157600080fd5b803560ff811681146126b857600080fd5b919050565b60008083601f8401126126cf57600080fd5b5081356001600160401b038111156126e657600080fd5b60208301915083602082850101111561158157600080fd5b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171561273c5761273c6126fe565b604052919050565b600082601f83011261275557600080fd5b81356001600160401b0381111561276e5761276e6126fe565b612781601f8201601f1916602001612714565b81815284602083860101111561279657600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060008060e0898b0312156127cf57600080fd5b883597506127df60208a016126a7565b965060408901356001600160401b03808211156127fb57600080fd5b6128078c838d016126bd565b909850965060608b013591508082111561282057600080fd5b5061282d8b828c01612744565b94505061283c60808a016126a7565b925060a0890135915060c089013590509295985092959890939650565b60006020828403121561286b57600080fd5b5035919050565b60005b8381101561288d578181015183820152602001612875565b50506000910152565b600081518084526128ae816020860160208601612872565b601f01601f19169290920160200192915050565b6020815260006112416020830184612896565b80356001600160a01b03811681146126b857600080fd5b6000806000806080858703121561290257600080fd5b61290b856128d5565b9350612919602086016128d5565b92506040850135915060608501356001600160401b0381111561293b57600080fd5b61294787828801612744565b91505092959194509250565b60006020828403121561296557600080fd5b81356001600160401b0381111561297b57600080fd5b610df484828501612744565b60006001600160401b038211156129a0576129a06126fe565b5060051b60200190565b600082601f8301126129bb57600080fd5b813560206129d06129cb83612987565b612714565b82815260059290921b840181019181810190868411156129ef57600080fd5b8286015b84811015612a1157612a04816128d5565b83529183019183016129f3565b509695505050505050565b600082601f830112612a2d57600080fd5b81356020612a3d6129cb83612987565b82815260059290921b84018101918181019086841115612a5c57600080fd5b8286015b84811015612a115780358352918301918301612a60565b600082601f830112612a8857600080fd5b81356020612a986129cb83612987565b82815260059290921b84018101918181019086841115612ab757600080fd5b8286015b84811015612a115780356001600160401b03811115612ada5760008081fd5b612ae88986838b0101612744565b845250918301918301612abb565b60008060008060808587031215612b0c57600080fd5b84356001600160401b0380821115612b2357600080fd5b612b2f888389016129aa565b95506020870135915080821115612b4557600080fd5b612b5188838901612a1c565b94506040870135915080821115612b6757600080fd5b50612b7487828801612a77565b949793965093946060013593505050565b600080600080600060a08688031215612b9d57600080fd5b85359450612bad602087016126a7565b9350612bbb604087016126a7565b94979396509394606081013594506080013592915050565b634e487b7160e01b600052602160045260246000fd5b6020810160088310612c0b57634e487b7160e01b600052602160045260246000fd5b91905290565b60008060408385031215612c2457600080fd5b82359150612c34602084016128d5565b90509250929050565b60008060408385031215612c5057600080fd5b82359150612c34602084016126a7565b600080600080600060808688031215612c7857600080fd5b85359450612c88602087016126a7565b935060408601356001600160401b0380821115612ca457600080fd5b612cb089838a016126bd565b90955093506060880135915080821115612cc957600080fd5b50612cd688828901612744565b9150509295509295909350565b60008060008060608587031215612cf957600080fd5b84359350612d09602086016126a7565b925060408501356001600160401b03811115612d2457600080fd5b612d30878288016126bd565b95989497509550505050565b60008060008060808587031215612d5257600080fd5b84356001600160401b0380821115612d6957600080fd5b612d75888389016129aa565b95506020870135915080821115612d8b57600080fd5b612d9788838901612a1c565b94506040870135915080821115612dad57600080fd5b612db988838901612a77565b93506060870135915080821115612dcf57600080fd5b5061294787828801612744565b600080600060608486031215612df157600080fd5b612dfa846128d5565b92506020840135915060408401356001600160401b03811115612e1c57600080fd5b612e2886828701612744565b9150509250925092565b600080600080600060a08688031215612e4a57600080fd5b612e53866128d5565b9450612e61602087016128d5565b935060408601356001600160401b0380821115612e7d57600080fd5b612e8989838a01612a1c565b94506060880135915080821115612e9f57600080fd5b612eab89838a01612a1c565b93506080880135915080821115612cc957600080fd5b60008060008060608587031215612ed757600080fd5b612ee0856128d5565b93506020850135925060408501356001600160401b03811115612d2457600080fd5b60008060408385031215612f1557600080fd5b612f1e836128d5565b946020939093013593505050565b600080600080600060a08688031215612f4457600080fd5b612f4d866128d5565b9450612f5b602087016128d5565b9350604086013592506060860135915060808601356001600160401b03811115612f8457600080fd5b612cd688828901612744565b8183823760009101908152919050565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b600181811c90821680612feb57607f821691505b60208210810361300b57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561305757600081815260208120601f850160051c810160208610156130385750805b601f850160051c820191505b81811015611a5457828155600101613044565b505050565b81516001600160401b03811115613075576130756126fe565b613089816130838454612fd7565b84613011565b602080601f8311600181146130be57600084156130a65750858301515b600019600386901b1c1916600185901b178555611a54565b600085815260208120601f198616915b828110156130ed578886015182559484019460019091019084016130ce565b508582101561310b5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8181038181111561087d5761087d61311b565b634e487b7160e01b600052603260045260246000fd5b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b6001600160401b038181168382160190808211156131bb576131bb61311b565b5092915050565b600081518084526020808501945080840160005b838110156131fb5781516001600160a01b0316875295820195908201906001016131d6565b509495945050505050565b600081518084526020808501945080840160005b838110156131fb5781518752958201959082019060010161321a565b600081518084526020808501808196508360051b8101915082860160005b8581101561327e57828403895261326c848351612896565b98850198935090840190600101613254565b5091979650505050505050565b60006101208b8352602060018060a01b038c16818501528160408501526132b48285018c6131c2565b915083820360608501526132c8828b613206565b915083820360808501528189518084528284019150828160051b850101838c0160005b8381101561331957601f19878403018552613307838351612896565b948601949250908501906001016132eb565b505086810360a088015261332d818c613236565b94505050505061334860c08401876001600160401b03169052565b6001600160401b03851660e084015282810361010084015261336a8185612896565b9c9b505050505050505050505050565b60808152600061338d60808301876131c2565b828103602084015261339f8187613206565b905082810360408401526133b38186613236565b91505082606083015295945050505050565b84815260ff84166020820152826040820152608060608201526000610f646080830184612896565b85815260ff8516602082015283604082015260a06060820152600061341560a0830185612896565b82810360808401526134278185612896565b98975050505050505050565b6000600182016134455761344561311b565b5060010190565b6000825161345e818460208701612872565b9190910192915050565b8082018082111561087d5761087d61311b565b60006020828403121561348d57600080fd5b5051919050565b808202811582820484141761087d5761087d61311b565b6000826134c857634e487b7160e01b600052601260045260246000fd5b50049056fe476f7665726e6f723a2072656c617920726576657274656420776974686f7574206d657373616765476f7665726e6f723a2063616c6c20726576657274656420776974686f7574206d657373616765a26469706673582212207ad9ebc97401fc88ced46c957c31ae9e1c4cd7e7c427d87c54830117109c949464736f6c63430008110033'

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
