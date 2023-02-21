export function GetNetworkColor(chain?: string) {
  if (chain === 'goerli') return 'green'
  if (chain === 'homestead') return 'blue'
  return 'gray'
}
