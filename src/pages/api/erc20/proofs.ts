import { getTxBlockNum, getTxsInBlockInterval } from './quicknode'

export const proofOfOG = async (address: string, contract_address: string, contract_creation_tx: string) => {
  const blocks_lookup = 10000
  const creation_block = await getTxBlockNum(contract_creation_tx)
  const txs = await getTxsInBlockInterval(creation_block, creation_block + blocks_lookup, contract_address, address)
  return txs
}
