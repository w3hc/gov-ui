import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, MenuList, MenuItem, Menu, MenuButton, IconButton } from '@chakra-ui/react'
import { AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon, HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { FaEthereum, FaEuroSign, FaFeather } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import { IoExitOutline, IoEnterOutline } from 'react-icons/io5'
import { GrValidate } from 'react-icons/gr'
import { LuUserPlus } from 'react-icons/lu'

import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { redirect } from 'next/dist/server/api-utils'

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
            <MenuItem fontSize="xl">Home</MenuItem>
          </LinkComponent>
          <LinkComponent href="/profile">
            <MenuItem fontSize="xl">User profile</MenuItem>
          </LinkComponent>

          <LinkComponent href="/delegate">
            <MenuItem fontSize="xl">Delegate</MenuItem>
          </LinkComponent>
          <LinkComponent href="/request-eth">
            <MenuItem fontSize="xl">Request ETH</MenuItem>
          </LinkComponent>
          <LinkComponent href="/request-eur">
            <MenuItem fontSize="xl">Request EUR</MenuItem>
          </LinkComponent>
          <LinkComponent href="/manifesto">
            <MenuItem fontSize="xl">Edit manifesto</MenuItem>
          </LinkComponent>
          <LinkComponent href="/add-member">
            <MenuItem fontSize="xl">Add a member</MenuItem>
          </LinkComponent>
          <LinkComponent href="/ban-member">
            <MenuItem fontSize="xl">Ban a member</MenuItem>
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
