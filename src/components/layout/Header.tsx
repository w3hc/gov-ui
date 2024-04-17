import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, MenuList, MenuItem, Menu, MenuButton, IconButton } from '@chakra-ui/react'
import { AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon, HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { FaEthereum, FaEuroSign, FaHome } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'

import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={5} mb={8} alignItems="center">
      <Menu>
        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />
        <MenuList>
          <LinkComponent href="/">
            <MenuItem fontSize="xl" icon={<FaHome />}>
              Home
            </MenuItem>
          </LinkComponent>
          <LinkComponent href="/request-eth">
            <MenuItem fontSize="xl" icon={<FaEthereum />}>
              Request ETH
            </MenuItem>
          </LinkComponent>
          <LinkComponent href="/request-eur">
            <MenuItem fontSize="xl" icon={<FaEuroSign />}>
              Request EUR
            </MenuItem>
          </LinkComponent>
        </MenuList>
      </Menu>

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <w3m-button />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
