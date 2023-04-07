import { Web3Storage } from 'web3.storage'

export const UploadFile = async (selectedFile: any, fileName: any) => {
  console.log('uploding your file...')
  console.log('selectedFile:', selectedFile)
  console.log('fileName:', fileName)

  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() || '' })
  }

  // async function getFiles(file: any) {
  //   const File = await getFilesFromPath(file)
  //   return File
  // }

  async function storeFile(files: any) {
    try {
      const client = makeStorageClient()
      const put = await client.put(files)
      return put
    } catch (error) {
      console.error('error (storeFile):', error)
      return null
    }
  }

  const cid = await storeFile(fileName)

  // let cid = null
  // try {
  //   cid = await storeFile(selectedFile)
  // } catch (error) {
  //   console.error('upload error:', error)
  // }

  // console.log('✅ cid:', cid)
  // console.log('✅ uri:', 'https://' + cid + '.ipfs.w3s.link' + '/' + fileName)
  return 'https://' + cid + '.ipfs.w3s.link' + '/' + fileName
}
