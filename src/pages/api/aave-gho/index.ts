import type { NextApiRequest, NextApiResponse } from 'next'
import { herodotusProof, proofOfOG, starknetVerify } from '../erc20/proofs'
import { getCurrentBlockNum } from '../erc20/quicknode'

type ReturnData = {
  coupons: any
}

let contract_data = {
  address: '0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211',
  creation_tx: '0x8442c2fc106579421e74494a84230faa3d017df8e03d0a4665ebe7a05179392f',
  genesisBlock: -1,
  storage_slot_balance: 3
}

const post = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const address = req.body.addr as string
  if (contract_data.genesisBlock == -1) {
    contract_data.genesisBlock = await getCurrentBlockNum()
  }
  const proofOG = await proofOfOG(address, contract_data.address, contract_data.genesisBlock, contract_data.storage_slot_balance)
  if (!proofOG) return res.status(500).json([])

  await herodotusProof(contract_data.address, proofOG?.blockNum)
  const calldata = await starknetVerify(contract_data.address, proofOG?.slot, proofOG?.blockNum)

  return res.status(200).json(calldata)
}


const get = async (req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  const address = req.query.addr as string
  const blockNum = contract_data.genesisBlock == -1 ? await getCurrentBlockNum() : contract_data.genesisBlock
  const proofOG = await proofOfOG(address, contract_data.address, blockNum, contract_data.storage_slot_balance)
  res.status(200).json({
    coupons: {
      "proofOfOG": proofOG ? true : false,
    }
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnData>
) {
  if (req.method === 'GET') {
    get(req, res)
  } else if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).end()
  }
}
