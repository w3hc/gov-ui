import { Web3Storage, Blob, File } from 'web3.storage'

export const UploadData = async (selectedFile: any, selectedFileName: any) => {
  console.log('uploding your data...')

  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() || '' })
  }

  function makeFileObjects(selectedFile: any, selectedFileName: any) {
    const blob = new Blob([selectedFile])
    const files = [new File(['contents-of-file-1'], 'plain-utf8.txt'), new File([blob], selectedFileName)]
    return files
  }

  async function storeFile() {
    const client = makeStorageClient()
    const file = makeFileObjects(JSON.stringify(selectedFile), selectedFileName)
    const put = await client.put(file, { wrapWithDirectory: true })
    return put
  }

  const cid = await storeFile()

  console.log('[UploadData] cid:', cid)
  console.log('[UploadData] url:', 'https://' + cid + '.ipfs.w3s.link' + '/' + selectedFileName)

  return 'https://' + cid + '.ipfs.w3s.link' + '/' + selectedFileName
}
