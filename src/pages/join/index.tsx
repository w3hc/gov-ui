import { Heading, Button, Text, Flex, useColorModeValue, useToast } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { nftAbi, imnotlateContractAddress, wpContractAddress, GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI } from '../../utils/config'

export default function Join() {
  const [initialized, setInitialized] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isHolderOfImnotlate, setIsHolderOfImnotlate] = useState(0)
  const [isHolderOfWP, setIsHolderOfWP] = useState(0)
  const [isHolderOfDontbelate, setIsHolderOfDontbelate] = useState(0)

  const provider = useProvider()
  const { data: signer, isLoading } = useSigner()
  const toast = useToast()

  const scanWallet = async () => {
    try {
      const userAddress = await signer.getAddress()
      console.log('userAddress:', userAddress)

      const imnotlate = new ethers.Contract(imnotlateContractAddress, nftAbi, provider)
      const call = await imnotlate.balanceOf(userAddress)
      console.log('imnotlate:', Number(call))
      setIsHolderOfImnotlate(Number(call))

      const wp = new ethers.Contract(wpContractAddress, nftAbi, provider)
      const call2 = await wp.balanceOf(userAddress)
      console.log('wp:', Number(call2))
      setIsHolderOfWP(Number(call2))

      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, provider)
      const dontbelate = new ethers.Contract(await gov.token(), nftAbi, provider)
      const call3 = await dontbelate.balanceOf(userAddress)
      console.log('dontbelate:', Number(call3))
      setIsHolderOfDontbelate(Number(0))
    } catch (e) {
      console.log('error:', e)
    }
  }

  const mint = async () => {
    try {
      setLoading(true)
      const userAddress = await signer.getAddress()
      const gov = new ethers.Contract(GOV_CONTRACT_ADDRESS, GOV_CONTRACT_ABI, signer)
      const dontbelate = new ethers.Contract(await gov.token(), nftAbi, signer)
      const call3 = await dontbelate.mint(userAddress)
      console.log('dontbelate:', call3)
      setLoading(false)
      toast({
        title: 'Mint successful',
        position: 'bottom',
        description: 'Welcome home!',
        status: 'success',
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
      })
    } catch (e) {
      console.log('error:', e)
      setLoading(false)
      toast({
        title: 'Error',
        position: 'bottom',
        description: e.data.message,
        status: 'info',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      scanWallet()
      setInitialized(true)
    }
    init()
  }, [signer])

  return initialized ? (
    <>
      <Head />
      <main>
        <Heading as="h2">Welcome!</Heading>
        <div>
          <Heading mt={5} fontSize={24}>
            Your NFTs
          </Heading>
          <br />
          {!isHolderOfDontbelate ? (
            <Text>To become a voting member, you must have 2 NFTs on your wallet: the Imnotlate NFT and the White Paper NFT.</Text>
          ) : (
            <Text></Text>
          )}
          <Flex as="header" py={5} mb={8} alignItems="center">
            {isHolderOfImnotlate === 1 && (
              <Image
                priority
                width="100"
                height="100"
                alt="loader"
                src="https://bafybeihaafblie2zrbb2y4dsagmyaw5txkqdznzv3ivzrtxliyhqqzhdka.ipfs.w3s.link/imnotlate"
              />
            )}
            {isHolderOfWP === 1 && (
              <Image
                priority
                width="100"
                height="100"
                alt="loader"
                src="https://bafybeidpfl2bdtt3xnedxdnxp7zmqb75gan2d45qiqlbbm5erdiiqyw5uq.ipfs.w3s.link/Arthera-White-Paper-NFT.png"
              />
            )}
            {isHolderOfDontbelate === 1 && (
              <Image
                priority
                width="100"
                height="100"
                alt="loader"
                src="https://bafybeiaswv3numcgmtcby6mgdlurmzisi5fzzujozyistx6ozqvutrdony.ipfs.w3s.link/arthera-logo.png"
              />
            )}
          </Flex>
        </div>
        {!isHolderOfDontbelate && (
          <div>
            {!loading ? (
              <Button colorScheme="blue" variant="outline" type="submit" onClick={mint}>
                Mint
              </Button>
            ) : (
              <Button isLoading loadingText="Minting..." colorScheme="blue" variant="outline" type="submit" onClick={mint}>
                Mint
              </Button>
            )}
          </div>
        )}
      </main>
    </>
  ) : (
    <Image priority width="400" height="400" alt="loader" src="/reggae-loader.svg" />
  )
}
