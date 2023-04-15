import { ethers } from 'ethers'
import { ethGetStorageAt, getTxBlockNum, getTxsInBlockInterval } from './quicknode'

export const proofOfOG = async (address: string, contract_address: string, contract_creation_tx: string, storage_slot_balance: number) => {
  const blocks_lookup = 10000
  const creation_block = await getTxBlockNum(contract_creation_tx)
  const txs = await getTxsInBlockInterval(creation_block, creation_block + blocks_lookup, contract_address, address)

  for (const tx of txs) {
    const balance_slot_keccak = ethers.keccak256(
      ethers.concat([
        ethers.zeroPadValue(address, 32),
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['uint256'],
          [storage_slot_balance]
        )
      ])
    )

    const balance = parseInt(await ethGetStorageAt(contract_address, balance_slot_keccak, tx.blockNumber), 16)
    if (balance > 0) {
      return { blockNum: tx.blockNumber, slot: balance_slot_keccak }
    }
  }

  return null
}

