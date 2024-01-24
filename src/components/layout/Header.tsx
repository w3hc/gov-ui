import React, { useState } from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PassportScore } from './PassportScore'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  const [selectedPage, setSelectedPage] = useState('Explore')

  const switchToPropose = async () => {
    setSelectedPage('Propose')
  }

  const switchToDelegate = async () => {
    setSelectedPage('Delegate')
  }

  const switchToManifesto = async () => {
    setSelectedPage('Manifesto')
  }

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={5} mb={8} alignItems="center">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          {SITE_NAME}
        </Heading>
      </LinkComponent>

      <Spacer />

      <Flex alignItems="center" gap={3}>
        <Menu>
          <MenuButton
            ml={3}
            as={Button}
            size={16}
            rightIcon={<ChevronDownIcon />}
            px={2}
            py={1}
            transition="all 0.5s"
            borderRadius="lg"
            borderWidth="0px"
            _hover={{ bg: 'purple.700' }}
            _expanded={{ bg: 'blue.400' }}
            _focus={{ boxShadow: 'outline' }}>
            {selectedPage}
          </MenuButton>
          <MenuList>
            <LinkComponent href="/delegate">
              <MenuItem onClick={switchToDelegate}>Delegate</MenuItem>
            </LinkComponent>
            <LinkComponent href="/push">
              <MenuItem onClick={switchToPropose}>Submit a proposal</MenuItem>
            </LinkComponent>
            <LinkComponent href="/manifesto">
              <MenuItem onClick={switchToManifesto}>Manifesto</MenuItem>
            </LinkComponent>
          </MenuList>
        </Menu>
        <PassportScore />
        <w3m-button />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
