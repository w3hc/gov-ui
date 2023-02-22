export function GetNetworkColor(chain?: string) {
  if (chain === 'goerli') return 'green'
  if (chain === 'homestead') return 'blue'
  if (chain === 'arbitrum-goerli') return 'blue'
  return 'gray'
}
