import { Web3Storage, Blob, File } from 'web3.storage'
import { filesFromPaths } from 'files-from-path'

export const UploadUserData = async (selectedFile: any, selectedFileName: any) => {
  console.log('uploding your data...')
  console.log('selectedFile:', selectedFile)
  console.log('fileName:', selectedFileName)

  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() || '' })
  }

  function makeFileObjects() {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = selectedFile
    const buffer = Buffer.from(obj)
    const files = [new File([buffer], selectedFileName)]
    return files
  }

  async function storeFile() {
    const client = makeStorageClient()
    const files = makeFileObjects()
    const put = await client.put(files, { wrapWithDirectory: true })
    // const put = await client.put([selectedFile], { wrapWithDirectory: false })
    return put
  }

  const cid = await storeFile()

  console.log('[UploadData] cid:', cid)
  console.log('[UploadData] url:', 'https://' + cid + '.ipfs.w3s.link' + '/' + selectedFileName)

  return 'https://' + cid + '.ipfs.w3s.link' + '/' + selectedFileName
}
