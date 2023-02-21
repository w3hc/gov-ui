import React from 'react'
import { Badge, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { useBlockNumber, useNetwork } from 'wagmi'
import { GetNetworkColor } from '../../utils/network'
import { LinkComponent } from './LinkComponent'
import { THEME_COLOR_SCHEME } from '../../utils/config'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { SITE_DESCRIPTION, SOCIAL_GITHUB, SOCIAL_TWITTER } from '../../utils/config'

export function NetworkStatus() {
  const block = useBlockNumber({ watch: false }) // pretty unuseful when false...
  const network = useNetwork()
  const explorerUrl = network.chain?.blockExplorers?.default.url
  const bgColor = useColorModeValue(`${THEME_COLOR_SCHEME}.50`, `${THEME_COLOR_SCHEME}.800`)

  return (
    <Flex alignItems="center" gap={2} zIndex={2} bgColor={bgColor} p={1}>
      <LinkComponent href={`https://github.com/ATO-nft/continua-contracts`}>
        <FaGithub />
      </LinkComponent>
      <Badge colorScheme={GetNetworkColor(network.chain?.network)} fontSize="2xs">
        {network.chain?.name ?? 'Ethereum'}
      </Badge>
      {explorerUrl && (
        <LinkComponent href={explorerUrl}>
          <Text fontSize="2xs"># {block.data}</Text>
        </LinkComponent>
      )}
      {!explorerUrl && <Text fontSize="2xs"># {block.data}</Text>}
    </Flex>
  )
}
