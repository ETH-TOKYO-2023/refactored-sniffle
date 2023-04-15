import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { Inter } from "next/font/google";

//IMAGE
import Anime1 from "../../public/1.svg";
import Sponor1 from "../../public/1_.svg";
import Anime2 from "../../public/2.svg";
import Sponor2 from "../../public/2_.svg";
import Sponor3 from "../../public/3_.svg";
import Sponor4 from "../../public/4_.svg";
import Anime3 from "../../public/3.svg";
import Anime4 from "../../public/4.svg";
import Anime5 from "../../public/5.svg";
import LOGO from "../../public/logo.svg";

// EVM
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { factoryABI } from "@/shared/factoryabi";

//! I don't think using starknetjs on the browser is a good idea, it's better to use starknet-react
//? All documentation for starknet-react is here: https://apibara.github.io/starknet-react/hooks
import {
  useAccount as useStarknetAccount,
  useContractWrite,
  useTransaction,
} from "@starknet-react/core";

//argent x
// import {
//   addWalletChangeListener,
//   chainId,
//   connectWallet,
//   removeWalletChangeListener,
//   silentConnectWallet,
// } from "@/services/wallet.service";
// import { truncateAddress } from "@/services/address.service";
import { ConnectWallet } from "@/components/ConnectWallet";

const inter = Inter({ subsets: ["latin"] });

const selectedStyle = {
  borderRadius: "20px",
  border: "5px solid hsl(164.23deg 100% 70.65%)",
};
const unSelectedStyle = {
  borderRadius: "20px",
  border: "0",
};

const AnimeToColor = new Map();
AnimeToColor.set(1, "#fce5ad");
AnimeToColor.set(2, "#e4daeb");
AnimeToColor.set(3, "#c6d5e9");
AnimeToColor.set(4, "rgb(248 204 181)");

const SponsorToName = new Map();
SponsorToName.set(0, "APE TOKEN");
SponsorToName.set(1, "GHO TOKEN");
SponsorToName.set(2, "SISMO BADGE");
SponsorToName.set(3, "BOB TOKEN");

const VerifyList = new Map();
VerifyList.set(0, 0);
VerifyList.set(1, 0);
VerifyList.set(2, 0);
VerifyList.set(3, 0);

const CouponIdToContract = new Map();
VerifyList.set(
  0,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
VerifyList.set(
  1,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
VerifyList.set(
  2,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
VerifyList.set(
  3,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);

declare enum BaseUrl {
  SN_MAIN = "https://alpha-mainnet.starknet.io",
  SN_GOERLI = "https://alpha4.starknet.io",
  SN_GOERLI2 = "https://alpha4-2.starknet.io",
}

export default function Home() {
  const [starkaddress, setstarkAddress] = useState<String>();
  const [starknetClient, setStarknetClient] = useState();
  const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
  const [isConnected, setConnected] = useState(false);
  // const [chain, setChain] = useState(chainId());
  const [calldata, setCallData] = useState([]);
  const [starkaccount, setstarkAccount] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(4);
  const { address } = useAccount();

  // const testAddress =
  //   "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec";

  // ------------------ contract write ------------------

  const tx = useMemo(
    () => ({
      contractAddress: CouponIdToContract.get(selectedCoupon),
      entrypoint: "mint_coupon",
      calldata: [address, calldata],
    }),
    [address, calldata]
  );
  const { writeAsync } = useContractWrite({ calls: tx });

  //? use writeAsync to execute the call, just:
  // await writeAsync()

  const [txHash, setTxHash] = useState<undefined | string>(undefined);
  const { data, isLoading, error } = useTransaction({ hash: txHash });
  //? data is the result of the transaction, isLoading is true when the transaction is pending, error is the error if the transaction failed

  // ------------------ end contract write ------------------

  //useEffect argent x
  // useEffect(() => {
  //   const handler = async () => {
  //     const wallet = await silentConnectWallet();
  //     console.log(wallet);
  //     setstarkAddress(wallet?.selectedAddress);
  //     setChain(chainId());
  //     setConnected(!!wallet?.isConnected);
  //     if (wallet?.account) {
  //       setstarkAccount(wallet.account);
  //     }
  //     setSupportsSessions(null);
  //     if (wallet?.selectedAddress) {
  //       try {
  //         const sessionSupport = await supportsSessions(
  //           wallet.selectedAddress,
  //           wallet.provider
  //         );
  //         setSupportsSessions(sessionSupport);
  //       } catch {
  //         setSupportsSessions(false);
  //       }
  //     }
  //   };

  //   (async () => {
  //     await handler();
  //     addWalletChangeListener(handler);
  //   })();

  //   return () => {
  //     removeWalletChangeListener(handler);
  //   };
  // }, []);

  // // read abi of Test contract
  // const myTestContract = new Contract(factoryABI, testAddress, provider);

  // const [verifyList, setVerifyList] =
  const SFTs = ["APE COIN", "X XOIN", "TCCC"];

  // const handleConnectClick = async () => {
  //   const wallet = await connectWallet();
  //   console.log(wallet);
  //   setstarkAddress(wallet?.selectedAddress);
  //   setChain(chainId());
  //   setConnected(!!wallet?.isConnected);
  //   if (wallet?.account) {
  //     setstarkAccount(wallet.account);
  //   }
  //   setSupportsSessions(null);
  //   if (wallet?.selectedAddress) {
  //     const sessionSupport = await supportsSessions(
  //       wallet.selectedAddress,
  //       wallet.provider
  //     );
  //     console.log(wallet);
  //     console.log(
  //       "🚀 ~ file: index.tsx ~ line 72 ~ handleConnectClick ~ sessionSupport",
  //       sessionSupport
  //     );
  //     setSupportsSessions(sessionSupport);
  //   }
  // };

  //APE Proof of OG
  const APEProofofOG = async () => {
    const res = await axios.post("/api/apecoin", {
      addr: address,
    });
    console.log(address);
    console.log(res.data);
    setCallData(res.data);
  };

  const claimCoupon = async () => {
    // Interaction with the cairo contract
    // const res1 = starknetClient.provider.callContract;
    //
    // if(selectedCoupon===0) {
    //   const apecontract =
    // }

    // ------------------ contract write ------------------

    const response = await writeAsync();
    //? See above, saving the txHash in a state and then using useTransaction to get the result
    setTxHash(response.transaction_hash);

    // ------------------ end contract write ------------------

    // const res = await myTestContract.invoke("mint_coupon", [
    //   "0x052cff61dcf94606146f7876127f31fe9c9c20b6369af5f92937f423eecc6b89",
    //   calldata,
    // ]);
    // await provider.waitForTransaction(res.transaction_hash);
    // const bal2 = await myTestContract.call("get_balance");
    console.log(response, data, "dagewgewwggwe");

    //? I'll write the interaction code here
  };

  const VerifyCondition = () => {
    return (
      <div>
        {selectedCoupon === 0 ? (
          <div>
            <div>PROOF OF APE COIN OG</div>
            {}
            <button onClick={() => APEProofofOG()}>Verify</button>
          </div>
        ) : selectedCoupon === 1 ? (
          <div>
            <div>PROOF OF GHO COIN OG</div>
            <button>Verify</button>
          </div>
        ) : selectedCoupon === 2 ? (
          <div>
            <div>
              {" "}
              <div>PROOF OF SISMO BADGE 1 HOLDER</div>
              <button>Verify</button>
            </div>
            <div>
              {" "}
              <div>PROOF OF SISMO BADGE 2 HOLDER</div>
              <button>Verify</button>
            </div>
          </div>
        ) : selectedCoupon === 3 ? (
          <div>
            {" "}
            <div>PROOF OF ZKBOB TOKEN OG</div>
            <button>Verify</button>
          </div>
        ) : null}
      </div>
    );
  };

  const ClaimCondition = () => {
    return (
      <button
        onClick={() => {
          claimCoupon();
        }}>
        Claim
      </button>
    );
  };

  return (
    <div>
      <Image
        style={{ margin: "auto", width: "60%", height: "60%" }}
        src={LOGO}
        alt="logo"
      />
      <div className="description">
        Reward SFT base on Proof, like proof of OG{" "}
      </div>
      <div>
        <ConnectWallet />
        <ConnectButton />
      </div>

      {/* {tabStatus === 0 ? : <div>using SISMO</div>} */}
      {selectedCoupon !== 4 && (
        <div className="dashboard">
          <div className="tabWrapper">
            <p> {SponsorToName.get(selectedCoupon)} SFT reward on Starknet</p>
            <div>
              <div></div>
              <div>
                <Link target="_" href="https://www.herodotus.dev/">
                  using HERODOTUS API
                </Link>{" "}
              </div>
              {/* <div onClick={() => setTabStatus(1)}>EVM</div> */}
            </div>
            <div>
              <VerifyCondition />
              <ClaimCondition />
            </div>
          </div>
        </div>
      )}

      <div className="reward_wrap">
        {/* APECOIN SPONSOR */}
        <div style={selectedCoupon == 0 ? selectedStyle : unSelectedStyle}>
          <div
            className="reward"
            style={{ background: AnimeToColor.get(1) }}
            onClick={() => setSelectedCoupon(0)}>
            <div className="sponsor_logo">
              <Image src={Sponor1} alt="sponsor" />
            </div>
            <Image src={Anime1} alt="anime" />
            <div className="explanation">
              <div>APE COIN REWARD SFT</div>
              <div>PROOF OF OG x1</div>
            </div>
          </div>
        </div>

        {/* AAVE SPONSOR */}
        <div style={selectedCoupon == 1 ? selectedStyle : unSelectedStyle}>
          <div
            className="reward"
            style={{ background: AnimeToColor.get(2) }}
            onClick={() => setSelectedCoupon(1)}>
            <div className="sponsor_logo">
              <Image src={Sponor2} alt="sponsor" />
            </div>
            <Image src={Anime2} alt="anime" />
            <div className="explanation">
              <div>GHO TOKEN REWARD SFT</div>
              <div>PROOF OF OG x1</div>
            </div>
          </div>
        </div>

        {/* SISMO SPONSOR */}
        <div style={selectedCoupon == 2 ? selectedStyle : unSelectedStyle}>
          <div
            className="reward"
            style={{ background: AnimeToColor.get(3) }}
            onClick={() => setSelectedCoupon(2)}>
            <div className="sponsor_logo">
              <Image src={Sponor3} alt="sponsor" />
            </div>
            <Image src={Anime3} alt="anime" />
            <div className="explanation">
              <div>SISMO BADGE REWARD SFT</div>
              <div>PROOF OF BADGE x2</div>
            </div>
          </div>
        </div>

        {/* ZKBOB SPONSOR */}
        <div style={selectedCoupon == 3 ? selectedStyle : unSelectedStyle}>
          <div
            className="reward"
            style={{ background: AnimeToColor.get(3) }}
            onClick={() => setSelectedCoupon(3)}>
            <div className="sponsor_logo">
              <Image src={Sponor4} alt="sponsor" />
            </div>
            <Image src={Anime4} alt="anime" />
            <div className="explanation">
              <div>ZKBOB REWARD SFT</div>
              <div>PROOF OF OG x1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
