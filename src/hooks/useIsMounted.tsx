import { useState, useEffect } from 'react'
import govContract from '../utils/Gov.json'

export function useIsMounted(): boolean {
  let [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    console.log('DAO contract address:', govContract.address)
  }, [])

  return isMounted
}
