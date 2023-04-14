import { getTxBlockNum } from './quicknode'

export const proofOfOG = (address: string, contract_creation_tx: string) => {
  // 1. Holding within the first 1000 block number (proof of OG)
  // process.env.QUICKNODE_API
  const blocks_per_week = 45500
  const creation_block = getTxBlockNum(contract_creation_tx)

  return
}
