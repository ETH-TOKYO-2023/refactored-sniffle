// ! We should get this as a environment variable 
const quicknode_endpoint = "blablaquicknode.com/12039812";

// Getting the block number by transaction hash thanks to  Quicknode API ❤️ 🇯🇵
export const getTxBlockNum = (txHash: string) => {
  const req = fetch(quicknode_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "method": "eth_getTransactionByHash",
      "params": [
        txHash
      ],
      "id": 1,
      "jsonrpc": "2.0"
    }),
    redirect: 'follow'
  }).then(res => res.json)

  return req;

}


// Getting the current block number to compare with the blocknumber that a ERC20 contract has deployed thanks to  Quicknode API ❤️ 🇯🇵
export const getCurrentBlockNum = () => {
  const req = fetch(quicknode_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "method": "eth_blockNumber",
      "params": [],
      "id": 1,
      "jsonrpc": "2.0"
    }),
    redirect: 'follow'
  }).then(res => res.json)

  return req;

}