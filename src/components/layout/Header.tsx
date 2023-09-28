import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { SITE_NAME, APP_VERSION } from '../../utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={5} mb={8} alignItems="center">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          #DontBeLate
        </Heading>
      </LinkComponent>

      <Spacer />

      <Flex alignItems="center" gap={3}>
        <Menu>
          <MenuButton
            ml={3}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            px={4}
            py={2}
            transition="all 0.5s"
            borderRadius="lg"
            borderWidth="0px"
            _hover={{ bg: 'purple.700' }}
            _expanded={{ bg: 'blue.400' }}
            _focus={{ boxShadow: 'outline' }}>
            Explore
          </MenuButton>
          <MenuList>
            <LinkComponent href="/join">
              <MenuItem>Join</MenuItem>
            </LinkComponent>

            <LinkComponent href="/push">
              <MenuItem>Propose</MenuItem>
            </LinkComponent>

            <LinkComponent href="/delegate">
              <MenuItem>Delegate</MenuItem>
            </LinkComponent>
          </MenuList>
        </Menu>
        <ConnectKitButton />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
