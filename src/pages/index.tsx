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

//starknet
import {
  useAccount as useStarknetAccount,
  useConnectors,
  useContract as useStarknetContract,
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
import { Contract, Provider } from "starknet";

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

const CouponIdToContract = new Map();
CouponIdToContract.set(
  0,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
CouponIdToContract.set(
  1,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
CouponIdToContract.set(
  2,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);
CouponIdToContract.set(
  3,
  "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec"
);

export default function Home() {
  const [starkaddress, setstarkAddress] = useState<String>();
  const [starknetClient, setStarknetClient] = useState();
  const [apeStatus, setAPEStatus] = useState(false);
  const [ghoStatus, setGHOStatus] = useState(false);
  const [bobStatus, setBOBStatus] = useState(false);
  const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
  const { address, isConnected } = useAccount();

  const { account: starknetAccount } = useStarknetAccount();
  // const [chain, setChain] = useState(chainId());
  const [calldata, setCallData] = useState([]);
  const [verifyList, setVerifyList] = useState({
    ape: false,
    gho: false,
    zkbob: false,
  });
  const [starkaccount, setstarkAccount] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(4);

  const { connect, connectors } = useConnectors();
  // console.log(connectors, "index");
  const connector = useMemo(
    () => connectors.find((c) => c.options.id === "argentX") ?? connectors[0],
    [connectors]
  );
  // console.log(connector, "index");

  // ------------------ contract write ------------------
  const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
  const FACTORY_CONTRACT = new Contract(
    factoryABI,
    "0x005e7ccdc3677133173038d8cca7ed66236f25ff28b47c36549705337c931291",
    provider
  );

  FACTORY_CONTRACT.connect(starknetAccount);
  // console.log(starknetAccount, FACTORY_CONTRACT);

  // const tx = useMemo(
  //   () => ({
  //     contractAddress: contract?.address,
  //     entrypoint: "mint_coupon",
  //     calldata: [CouponIdToContract.get(selectedCoupon), calldata],
  //   }),
  //   [CouponIdToContract.get(selectedCoupon), calldata]
  // );
  // const { writeAsync } = useContractWrite({ calls: tx });

  // const [txHash, setTxHash] = useState<undefined | string>(undefined);
  // const { data, isLoading, error } = useTransaction({ hash: txHash });
  //? data is the result of the transaction, isLoading is true when the transaction is pending, error is the error if the transaction failed

  // ------------------ end contract write ------------------

  // ------------------ start api call  ------------------

  //APE Proof of OG
  const APEProofofOG = async () => {
    const res = await axios.post("/api/apecoin", {
      addr: address,
    });
    console.log(address);
    console.log(res.data);
    setCallData(res.data);
    const res1 = await getAPEstatus();
    if (res1.coupons.proofOfOG) {
      setAPEStatus(true);
    }

    console.log(apeStatus);
  };

  //GHO Proof of OG
  const GHOProofofOG = async () => {
    const res = await axios.post("/api/aave-gho", {
      addr: address,
    });
    console.log(address);
    console.log(res.data);
    setCallData(res.data);
  };

  //BOB Proof of OG
  const BOBProofofOG = async () => {
    const res = await axios.post("/api/zkbob", {
      addr: address,
    });
    console.log(address);
    console.log(res.data);
    setCallData(res.data);
  };

  // ------------------ end api call  ------------------

  const claimCoupon = async () => {
    // console.log(
    //   selectedCoupon,
    //   CouponIdToContract.get(selectedCoupon),
    //   calldata,
    //   "dagewgewwggwe"
    // );

    const res = await FACTORY_CONTRACT.invoke("mint_coupon", [
      CouponIdToContract.get(selectedCoupon),
      calldata,
    ]);

    // Interaction with the cairo contract

    // ------------------ contract write ------------------

    // const response = await writeAsync();
    // //? See above, saving the txHash in a state and then using useTransaction to get the result
    // setTxHash(response.transaction_hash);

    // ------------------ end contract write ------------------

    // const res = await myTestContract.invoke("mint_coupon", [
    //   "0x052cff61dcf94606146f7876127f31fe9c9c20b6369af5f92937f423eecc6b89",
    //   calldata,
    // ]);
    // await provider.waitForTransaction(res.transaction_hash);
    // const bal2 = await myTestContract.call("get_balance");
    // console.log(
    //   res,
    //   CouponIdToContract.get(selectedCoupon),
    //   calldata,
    //   "dagewgewwggwe"
    // );

    //? I'll write the interaction code here
  };

  // APE API
  const getAPE = async () => {
    const res = await axios.get("/api/apecoin?addr=" + address);
    return res;
  };
  const getAPEstatus = async () => {
    const res = await getAPE();
    return res.data;
  };

  // GHO API
  const getGHO = async () => {
    const res = await axios.get("/api/aave-gho?addr=" + address);
    return res;
  };
  const getGHOstatus = async () => {
    const res = await getGHO();
    return res.data;
  };

  // BOB API
  const getBOB = async () => {
    const res = await axios.get("/api/zkbob?addr=" + address);
    return res;
  };
  const getBOBstatus = async () => {
    const res = await getBOB();
    return res.data;
  };
  //TODO : call get api so to check when user logined with metamask, make claimed checkmark
  useEffect(() => {
    getAPEstatus().then((data) => {
      if (data.coupons.proofOfOG) {
        setAPEStatus(true);
      }
      console.log(data);
    });

    getGHOstatus().then((data) => {
      if (data.coupons.proofOfOG) {
        setGHOStatus(true);
      }
      console.log(data);
    });

    getBOBstatus().then((data) => {
      if (data.coupons.proofOfOG) {
        setBOBStatus(true);
      }
      console.log(data);
    });
  }, []);

  // useEffect(() => {
  //   console.log(verifyList);
  // }, [verifyList]);

  const VerifyCondition = () => {
    return (
      <div>
        {selectedCoupon === 0 ? (
          <div className="conditionboxStyle">
            <div>PROOF OF APE COIN OG</div>
            {apeStatus ? (
              <div className="verified">Verified</div>
            ) : (
              <button className="v_btn" onClick={() => APEProofofOG()}>
                Verify
              </button>
            )}
          </div>
        ) : selectedCoupon === 1 ? (
          <div className="conditionboxStyle">
            <div>PROOF OF GHO COIN OG</div>
            {ghoStatus ? (
              <div className="verified">Verified</div>
            ) : (
              <button className="v_btn" onClick={() => GHOProofofOG()}>
                Verify
              </button>
            )}
          </div>
        ) : selectedCoupon === 2 ? (
          <div>
            <div className="conditionboxStyle">
              {" "}
              <div>PROOF OF SISMO BADGE 1 HOLDER</div>
              <button className="v_btn">Verify</button>
            </div>
            <div className="conditionboxStyle">
              {" "}
              <div>PROOF OF SISMO BADGE 2 HOLDER</div>
              <button className="v_btn">Verify</button>
            </div>
          </div>
        ) : selectedCoupon === 3 ? (
          <div className="conditionboxStyle">
            {" "}
            <div>PROOF OF ZKBOB TOKEN OG</div>
            {bobStatus ? (
              <div className="verified">Verified</div>
            ) : (
              <button className="v_btn" onClick={() => BOBProofofOG()}>
                Verify
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const ClaimCondition = () => {
    return (
      <button
        onClick={() => {
          //? Error no connector connected is gone, another error is here but I'll leave you with that hahah ahhh okay
          //? sry have to go, have fun thank you !!
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
        <div className="connectbtn">
          <ConnectButton />
        </div>
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
            <div className="wrapperCondition">
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
            onClick={async () => {
              await getAPEstatus();
              setSelectedCoupon(0);
            }}>
            <div className="sponsor_logo">
              <Image src={Sponor1} alt="sponsor" />
            </div>
            <Image src={Anime1} alt="anime" />
            <div className="explanation">
              <div>APE COIN REWARD SFT</div>
              <div>PROOF OF OG x1</div>
              <div>{apeStatus && <div className="verified">Verified</div>}</div>
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
              <div>
                {" "}
                {ghoStatus && <div className="verified">Verified</div>}
              </div>
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
              <div>
                {" "}
                {bobStatus && <div className="verified">Verified</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
