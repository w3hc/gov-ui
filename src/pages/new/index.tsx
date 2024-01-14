import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { Button, Heading, Text, ListItem, UnorderedList } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { NextSeo } from 'next-seo'
import { LinkComponent } from 'components/layout/LinkComponent'
import { HeadingComponent } from 'components/layout/HeadingComponent'

export default function New() {
  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">A brand new page! 😋</HeadingComponent>
      </main>
    </>
  )
}
