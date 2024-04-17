import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, MenuList, MenuItem, Menu, MenuButton, IconButton } from '@chakra-ui/react'
import { AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon, HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons'

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
            <MenuItem icon={<ArrowBackIcon />}>Home</MenuItem>
          </LinkComponent>
          <LinkComponent href="/transfer-eth">
            <MenuItem icon={<AddIcon />}>Submit a proposal</MenuItem>
          </LinkComponent>

          {/* <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
            New Window
          </MenuItem>
          <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
            Open Closed Tab
          </MenuItem>
          <MenuItem icon={<EditIcon />} command="⌘O">
            Open File...
          </MenuItem> */}
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
