import { ethers } from 'ethers'
import { ethGetProof, ethGetStorageAt, getTxsInBlockInterval } from './quicknode'
import { Abi, Contract, Provider, number } from "starknet"
import { Data } from "../utils/data"
import { BigNumber } from "ethers"

export const proofOfOG = async (address: string, contract_address: string, block_number: number, storage_slot_balance: number) => {
  /*
  const blocks_lookup = 1000
  const creation_block = await getTxBlockNum(contract_creation_tx)
  const creation_block = block_number
  const txs = await getTxsInBlockInterval(creation_block, creation_block + blocks_lookup, contract_address, address)
  */

  //for (const tx of txs) {
  const balance_slot_keccak = ethers.utils.keccak256(
    ethers.utils.concat([
      ethers.utils.zeroPad(address, 32),
      ethers.utils.defaultAbiCoder.encode(
        ['uint256'],
        [storage_slot_balance]
      )
    ])
  )

  const balance = parseInt(await ethGetStorageAt(contract_address, balance_slot_keccak, block_number), 16)
  if (balance > 0) {
    //return { blockNum: tx.blockNumber, slot: balance_slot_keccak }
    return { blockNum: block_number, slot: balance_slot_keccak }
  }
  //}

  return null
}

export const herodotusProof = async (address: string, blockNum: number) => {
  const herodotus_endpoint = process.env.HERODOTUS_API as string
  const herodotus_api_key = process.env.HERODOTUS_API_KEY as string
  const body = {
    originChain: "GOERLI",
    destinationChain: "STARKNET_GOERLI",
    blockNumber: blockNum,
    type: "ACCOUNT_ACCESS",
    requestedProperties: {
      ACCOUNT_ACCESS: {
        account: address,
        properties: [
          "storageHash"
        ]
      }
    },
  }

  const response = await fetch(herodotus_endpoint + '?apiKey=' + herodotus_api_key, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  console.log(data)
  return data;
}

export const starknetVerify = async (address: string, slot: string, blockNum: number) => {
  const ethProof = await ethGetProof(address, [slot], blockNum)
  const rawProof = ethProof.storageProof[0].proof;
  const proof = rawProof.map((leaf: any) => Data.fromHex(leaf).toInts());

  const flatProofByteLengths: number[] = [];
  const flatProofWordLengths: number[] = [];
  let flatProofValues: BigNumber[] = [];

  for (const element of proof) {
    flatProofByteLengths.push(element.sizeBytes);
    flatProofWordLengths.push(element.values.length);
    flatProofValues = flatProofValues.concat(element.values);
  }

  const starknetProvider = new Provider({
    sequencer: { network: "goerli-alpha" },
  });

  /*
  let abi: Abi = {
  };

  const factsRegistry = new Contract(
    abi,
    process.env.HERODOTUS_FACTS_REGISTRY_ADDR!,
    starknetProvider
  );*/

  const slot_from_hex = Data.fromHex(slot)
    .toInts()
    .values.map((value: any) => value.toHexString())

  const calldata = [
    BigNumber.from(blockNum).toHexString(),
    address,
    BigNumber.from(slot_from_hex.length).toHexString(),
    ...slot_from_hex,
    BigNumber.from(flatProofByteLengths.length).toHexString(),
    ...flatProofByteLengths.map((length) => "0x" + length.toString(16)),
    BigNumber.from(flatProofWordLengths.length).toHexString(),
    ...flatProofWordLengths.map((length) => "0x" + length.toString(16)),
    BigNumber.from(flatProofValues.length).toHexString(),
    ...flatProofValues.map((value) => value.toHexString()),
  ];

  //await factsRegistry.call("get_storage_uint", calldata);
}
