import { ThemingProps } from '@chakra-ui/react'
export const SITE_DESCRIPTION = 'W3HC Next.js app template'
export const SITE_NAME = 'Gov'
export const SITE_URL = 'https://gov-ui.netlify.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'blue'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'w3hc8'
export const SOCIAL_GITHUB = 'w3hc/gov-ui'

export const ERC20_CONTRACT_ADRESS = '0xe6BCD785b90dc16d667B022cc871c046587d9Ac5'
export const firstIteration = 48
export const faucetAmount = 0.0005

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
