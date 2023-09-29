import { Heading, Button, Badge, Text, FormControl, FormLabel, Textarea, Input, FormHelperText, useToast, Flex } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { nftAbi, imnotlateContractAddress, wpContractAddress, GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI } from '../../utils/config'

export default function Delegate() {
  const [initialized, setInitialized] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingDelegateToSelf, setLoadingDelegateToSelf] = useState(false)
  const [currentDelegate, setCurrentDelegate] = useState(false)
  const [isDelegatedToSelf, setIsDelegatedToSelf] = useState(true)
  const [targetAddress, setTargetAddress] = useState('')

  const provider = useProvider()
  const { data: signer } = useSigner()
  const toast = useToast()

  const checkCurrentDelegate = async () => {
    const userAddress = await signer.getAddress()
    console.log('userAddress:', userAddress)
    const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
    const dontbelate = new ethers.Contract(await gov.token(), nftAbi, provider)
    const call3 = await dontbelate.delegates(userAddress)
    setCurrentDelegate(call3)
    console.log('call3:', call3)
    if (call3 === userAddress) {
      setIsDelegatedToSelf(true)
    } else {
      setIsDelegatedToSelf(false)
    }
  }

  const delegate = async () => {
    setLoading(true)
    try {
      if (!targetAddress) {
        toast({
          title: 'Missing target address',
          position: 'bottom',
          description: 'Please select the wallet address of the member you want to delegate your vote to.',
          status: 'info',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
        })
        return
      }
      const userAddress = await signer.getAddress()
      console.log('userAddress:', userAddress)
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const dontbelate = new ethers.Contract(await gov.token(), nftAbi, signer)
      const call3 = await dontbelate.delegate(targetAddress)
      console.log('call3:', call3)
      const receipt = await call3.wait(1)
      console.log('receipt:', receipt)
      checkCurrentDelegate()
      toast({
        title: 'Done!',
        position: 'bottom',
        description: 'Thank you for delegating your vote.',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)

      toast({
        title: 'Error',
        position: 'bottom',
        description: e,
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const delegateToSelf = async () => {
    setLoadingDelegateToSelf(true)
    try {
      const userAddress = await signer.getAddress()
      console.log('userAddress:', userAddress)
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const dontbelate = new ethers.Contract(await gov.token(), nftAbi, signer)
      const call3 = await dontbelate.delegate(userAddress)
      console.log('call3:', call3)
      setLoadingDelegateToSelf(false)
      toast({
        title: 'Done!',
        position: 'bottom',
        description: 'Thank you for delegating your vote to yourself.',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    } catch (e) {
      console.log(e)
      setLoadingDelegateToSelf(false)

      toast({
        title: 'Error',
        position: 'bottom',
        description: e,
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      if (!signer) {
        return
      }
      checkCurrentDelegate()
      setInitialized(true)
    }
    init()
  }, [signer])

  return initialized ? (
    <>
      <Head />
      <main>
        <Heading as="h2">Delegation management</Heading>
        <br />
        {isDelegatedToSelf === true ? (
          <Text>
            You&apos;ve delegated your vote to <strong>yourself</strong>. If you feel like you may not be willing to vote on a regular basis, you can
            delegate to someone who will vote on your behalf. You can take it back anytime you want.
          </Text>
        ) : (
          <Text>
            You&apos;ve delegated to <strong>{currentDelegate}</strong>
          </Text>
        )}
        <br />
        <FormControl>
          <FormLabel>Target address</FormLabel>
          <Input value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} placeholder="0x..." />
          <FormHelperText>
            You can either delegate to yourself or delegate to another member. You always can delegate back to yourself at any time.
          </FormHelperText>
          <Flex as="header" py={5} mb={8} alignItems="center">
            {!loading ? (
              <Button mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegate}>
                Delegate
              </Button>
            ) : (
              <Button isLoading loadingText="Delegating..." mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegate}>
                Delegate
              </Button>
            )}
            {!loadingDelegateToSelf ? (
              <Button ml={5} mt={4} colorScheme="blue" variant="outline" type="submit" onClick={delegateToSelf}>
                Delegate to myself
              </Button>
            ) : (
              <Button
                ml={5}
                isLoading
                loadingText="Delegating to myself..."
                mt={4}
                colorScheme="blue"
                variant="outline"
                type="submit"
                onClick={delegateToSelf}>
                Delegate to myself
              </Button>
            )}
          </Flex>
        </FormControl>
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
