import type { NextApiRequest, NextApiResponse } from 'next'
import { proofOfOG } from '../erc20/proofs'
import { env } from '@/shared/environment'
import { getTxBlockNum } from '../erc20/quicknode'

type Data = {
  coupons: any
}

const contract_address = '0x328507DC29C95c170B56a1b3A758eB7a9E73455c'
const contract_creation_tx = '0xc2349c284ec8ec5cd8d735bb971583ef49d6d04d5048cd34adf994ce326642fd'

const post = async(_req: NextApiRequest, res: NextApiResponse<Data>) => { 
    // Generate Proof from herodotus api
    // Get contract creation block number
    const WALLET_ADDRESS = _req.body.account
    const APE_DEPLOYED_BLOCKNUM =  getTxBlockNum(contract_creation_tx)
    const body = {
      originChain: "GOERLI",
      destinationChain: "STARKNET_GOERLI",
      blockNumber: APE_DEPLOYED_BLOCKNUM,
      type: "ACCOUNT_ACCESS",
      requestedProperties: {
        ACCOUNT_ACCESS: {
          account:WALLET_ADDRESS,
          properties: [
              "storageHash"
          ]
      }
      },
      webhookUrl: "https://webhook.site/71be6640-5bdc-4d49-909f-fed3c53b19e5"
  }
    const response = await fetch('https://api.herodotus.cloud?apiKey='+ env.herodotus, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.status(200).json(data);
 
  }


const get = async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  //const address = req.query.addr as string
  const address = '0x466dd6e6f3f5dd8b1da504a893261fa61d16a0ed'
  const proofOG = await proofOfOG(address, contract_address, contract_creation_tx)
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
