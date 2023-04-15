import type { NextApiRequest, NextApiResponse } from 'next'
import { herodotusProof, proofOfOG, starknetVerify } from '../erc20/proofs'
import { getCurrentBlockNum } from '../erc20/quicknode'

type ReturnData = {
  coupons: any
}

let contract_data = {
  address: '0x60a11fba848D6BA85632f70077d3EdFdA5678087',
  creation_tx: '0x699da192030505fffa147939d2cc938049ad269385c0ba8f3cec053e6174b975',
  genesisBlock: -1,
  storage_slot_balance: 1
}
const address = '0xA6725238a5f4Cf0253Ca0F59d2c3a1D9B6EcC27f'

const post = async (_req: NextApiRequest, res: NextApiResponse<any>) => {
  //const address = req.query.addr as string
  if (contract_data.genesisBlock == -1) {
    contract_data.genesisBlock = await getCurrentBlockNum()
  }
  const proofOG = await proofOfOG(address, contract_data.address, contract_data.genesisBlock, contract_data.storage_slot_balance)
  if (!proofOG) return res.status(500).json([])

  await herodotusProof(contract_data.address, proofOG?.blockNum)
  const calldata = await starknetVerify(contract_data.address, proofOG?.slot, proofOG?.blockNum)

  return res.status(200).json(calldata)
}


const get = async (_req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  //const address = req.query.addr as string
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
