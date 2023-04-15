import type { NextApiRequest, NextApiResponse } from 'next'
import { proofOfOG } from '../erc20/proofs'
import { ethGetProof } from '../erc20/quicknode'
import { Contract, Provider, number } from "starknet";
import { Data } from "../utils/data";
import { BigNumber, utils } from "ethers";

type Data = {
  coupons: any
}

const contract_data = {
  address: '0x328507DC29C95c170B56a1b3A758eB7a9E73455c',
  creation_tx: '0xc2349c284ec8ec5cd8d735bb971583ef49d6d04d5048cd34adf994ce326642fd',
  storage_slot_balance: 0
}

const post = async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  //const address = req.query.addr as string
  const address = '0x466dd6e6f3f5dd8b1da504a893261fa61d16a0ed'
  const proofOG = await proofOfOG(address, contract_data.address, contract_data.creation_tx, contract_data.storage_slot_balance)
  const ethProof = await ethGetProof(contract_data.address, [proofOG?.slot], proofOG?.blockNum)
  console.log(ethProof)

  const rawProof = ethProof[0].proof;
  const proof = rawProof.map((leaf: any) => Data.fromHex(leaf).toInts());
  console.log(proof);

  const flatProofByteLengths: number[] = [];
  const flatProofWordLengths: number[] = [];
  let flatProofValues: BigNumber[] = [];

  for (const element of proof) {
    flatProofByteLengths.push(element.sizeBytes);
    flatProofWordLengths.push(element.values.length);
    flatProofValues = flatProofValues.concat(element.values);
    console.log(element.values);
  }

  const starknetProvider = new Provider({
    sequencer: { network: "goerli-alpha" },
  });

  /*

  const factsRegistry = new Contract(
    abi,
    process.env.HERODOTUS_FACTS_REGISTRY_ADDR!,
    starknetProvider
  );

  const calldata = [
    BigNumber.from(proofOG?.blockNum).toHexString(),
    contract_data.address,
    Data.fromHex(proofOG?.slot)
      .toInts()
      .values.map((value: any) => value.toHexString()),
    flatProofByteLengths.map((length) => "0x" + length.toString(16)),
    flatProofWordLengths.map((length) => "0x" + length.toString(16)),
    flatProofValues.map((value) => value.toHexString()),
  ];

  await factsRegistry.call("get_storage_uint", calldata);
  */


  // Generate Proof from herodotus api
  // Get contract creation block number
  /*const WALLET_ADDRESS = _req.body.account
  const APE_DEPLOYED_BLOCKNUM = getTxBlockNum(contract_data.creation_tx)
  const body = {
    originChain: "GOERLI",
    destinationChain: "STARKNET_GOERLI",
    blockNumber: APE_DEPLOYED_BLOCKNUM,
    type: "ACCOUNT_ACCESS",
    requestedProperties: {
      ACCOUNT_ACCESS: {
        account: address,
        properties: [
          "storageHash"
        ]
      }
    },
    webhookUrl: "https://webhook.site/71be6640-5bdc-4d49-909f-fed3c53b19e5"
  }
  const response = await fetch('https://api.herodotus.cloud?apiKey=' + env.herodotus, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  res.status(200).json(data);
  */
}


const get = async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  //const address = req.query.addr as string
  const address = '0x466dd6e6f3f5dd8b1da504a893261fa61d16a0ed'
  const proofOG = await proofOfOG(address, contract_data.address, contract_data.creation_tx, contract_data.storage_slot_balance)
  res.status(200).json({
    coupons: {
      "proofOfOG": proofOG ? true : false,
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
