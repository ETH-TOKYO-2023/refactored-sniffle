import type { NextApiRequest, NextApiResponse } from 'next'
import SafeApiKit from '@safe-global/api-kit'
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { Wallet } from '@ethersproject/wallet'

const quicknode_endpoint = process.env.QUICKNODE_API as string

const provider = ethers.providers.getDefaultProvider(quicknode_endpoint)
const signer = Wallet.createRandom().connect(provider)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer,
})

const safeService = new SafeApiKit({
  txServiceUrl: 'https://safe-transaction-goerli.safe.global/',
  ethAdapter
})

type ReturnData = {
  coupons: any
}

const post = async (_req: NextApiRequest, res: NextApiResponse<any>) => {
  return res.status(200).json([])
}


const get = async (req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  //const ownerAddress = "0xB1c1124190208C43c2E322727E84CAFaF596e910"
  //const ownerAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf"
  const address = req.query.addr as string
  const resp = await safeService.getSafesByOwner(address)

  res.status(200).json({
    coupons: {
      "proofOfOwner1": resp.safes.length > 0,
      "proofOfOwner3": resp.safes.length > 2,
      "proofOfOwner5": resp.safes.length > 4
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
