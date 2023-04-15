import Image from "next/image";
import { supportsSessions } from "@argent/x-sessions";
import { Inter } from "next/font/google";
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
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContractRead } from "@starknet-react/core";
import Link from "next/link";
import { factoryABI } from "@/shared/factoryabi";
import { Provider, Contract, json, AccountInterface, Abi } from "starknet";
import { useAccount } from "wagmi";
import { connect } from "@argent/get-starknet";
import {
  addWalletChangeListener,
  chainId,
  connectWallet,
  removeWalletChangeListener,
  silentConnectWallet,
} from "@/services/wallet.service";
import { truncateAddress } from "@/services/address.service";

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
// // Let the user pick a wallet (on button click)
// const starknet = connect();

// const provider = new Provider({
//   sequencer: { network: "goerli-alpha" },
// });

// if (!starknet) {
//   throw Error("User rejected wallet selection or silent connect found nothing");
// }

export default function Home() {
  const [starkaddress, setstarkAddress] = useState<String>();
  const [starknetClient, setStarknetClient] = useState();
  const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
  const [isConnected, setConnected] = useState(false);
  const [chain, setChain] = useState(chainId());
  const [starkaccount, setstarkAccount] = useState<AccountInterface | null>(
    null
  );
  const { address } = useAccount();
  const testAddress =
    "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec";

  //useEffect argent x
  useEffect(() => {
    const handler = async () => {
      const wallet = await silentConnectWallet();
      console.log(wallet);
      setstarkAddress(wallet?.selectedAddress);
      setChain(chainId());
      setConnected(!!wallet?.isConnected);
      if (wallet?.account) {
        setstarkAccount(wallet.account);
      }
      setSupportsSessions(null);
      if (wallet?.selectedAddress) {
        try {
          const sessionSupport = await supportsSessions(
            wallet.selectedAddress,
            wallet.provider
          );
          setSupportsSessions(sessionSupport);
        } catch {
          setSupportsSessions(false);
        }
      }
    };

    (async () => {
      await handler();
      addWalletChangeListener(handler);
    })();

    return () => {
      removeWalletChangeListener(handler);
    };
  }, []);

  // // read abi of Test contract
  // const myTestContract = new Contract(factoryABI, testAddress, provider);
  const [selectedCoupon, setSelectedCoupon] = useState(4);
  // const [verifyList, setVerifyList] =
  const SFTs = ["APE COIN", "X XOIN", "TCCC"];

  const handleConnectClick = async () => {
    const wallet = await connectWallet();
    console.log(wallet);
    setstarkAddress(wallet?.selectedAddress);
    setChain(chainId());
    setConnected(!!wallet?.isConnected);
    if (wallet?.account) {
      setstarkAccount(wallet.account);
    }
    setSupportsSessions(null);
    if (wallet?.selectedAddress) {
      const sessionSupport = await supportsSessions(
        wallet.selectedAddress,
        wallet.provider
      );
      console.log(wallet);
      console.log(
        "🚀 ~ file: index.tsx ~ line 72 ~ handleConnectClick ~ sessionSupport",
        sessionSupport
      );
      setSupportsSessions(sessionSupport);
    }
  };

  const APEProofofOG = async () => {
    const res = await axios.post("/api/apecoin", {
      addr: address,
    });
    console.log(address);
    console.log(res);
  };

  const claimCoupon = async () => {
    // Interaction with the cairo contract
    // const res1 = starknetClient.provider.callContract;

    const erc20Contract = new Contract(
      factoryABI as Abi,
      getErc20TokenAddress(network),
      sessionAccount
    );
    const bal1 = await myTestContract.call("name");
    const res = await myTestContract.invoke("mint_coupon", [
      "0x052cff61dcf94606146f7876127f31fe9c9c20b6369af5f92937f423eecc6b89",
      [1],
    ]);
    await provider.waitForTransaction(res.transaction_hash);
    const bal2 = await myTestContract.call("get_balance");
    console.log(bal2);
    console.log(bal1);
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
      {isConnected ? (
        <>
          <h3 style={{ margin: 0 }}>
            Wallet address: <code>{address && truncateAddress(address)}</code>
          </h3>
          <h3 style={{ margin: 0 }}>
            supports sessions: <code>{`${supportSessions}`}</code>
          </h3>
          <h3 style={{ margin: 0 }}>
            Url: <code>{chain}</code>
          </h3>
          {/* {starkaccount && (
              <TokenDapp showSession={supportSessions} account={starkaccount} />
            )} */}
        </>
      ) : (
        <>
          <button onClick={handleConnectClick}>Connect Wallet</button>
          <p>First connect wallet to use dapp.</p>
        </>
      )}
      <div className="connectbtn">
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
