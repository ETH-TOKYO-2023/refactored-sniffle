import type { NextApiRequest, NextApiResponse } from 'next'
import { proofOfOG } from '../erc20/proofs'

type Data = {
  coupons: any
}

const contract_address = '0x328507DC29C95c170B56a1b3A758eB7a9E73455c'
const contract_creation_tx = '0xc2349c284ec8ec5cd8d735bb971583ef49d6d04d5048cd34adf994ce326642fd'

const post = (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Pia do your herodotus magic
  res.status(200)
}

const get = async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  //const address = req.query.addr as string
  const address = '0x466dd6e6f3f5dd8b1da504a893261fa61d16a0ed'
  const proofOG = await proofOfOG(address, contract_address, contract_creation_tx)
  console.log(proofOG)
  res.status(200).json({
    coupons: {
      "proofOfOG": proofOG.length > 0
    }
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    get(req, res)
  } else if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).end()
  }
}
