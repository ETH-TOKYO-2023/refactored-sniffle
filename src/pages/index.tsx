import Image from "next/image";
import { Inter } from "next/font/google";
import Anime1 from "../../public/1.svg";
import Sponor1 from "../../public/1_.svg";
import Anime2 from "../../public/2.svg";
import Sponor2 from "../../public/2_.svg";
import Sponor3 from "../../public/3_.svg";
import Anime3 from "../../public/3.svg";
import Anime4 from "../../public/4.svg";
import Anime5 from "../../public/5.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useContractRead } from "@starknet-react/core";
import Link from "next/link";
import { factoryABI } from "@/shared/factoryabi";
import { Provider, Contract, json } from "starknet";

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

const SponsorToName = new Map();
SponsorToName.set(0, "APE TOKEN");
SponsorToName.set(1, "GHO TOKEN");
SponsorToName.set(2, "SISMO BADGE");

const provider = new Provider({
  sequencer: { network: "goerli-alpha" },
});
export default function Home() {
  // initialize provider

  // initialize deployed contract
  const testAddress =
    "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec";

  // read abi of Test contract
  const myTestContract = new Contract(factoryABI, testAddress, provider);
  // const [tabStatus, setTabStatus] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(4);
  // const { data, isLoading, error, refetch } = useContractRead({
  //   address:
  //     "0x03b2ee4cbdf2ce378bf7aef77106b0d88d411d863846ec7c00631ccdcc3205ec",
  //   abi: factoryABI,
  //   functionName: "symbol",
  //   args: [],
  //   watch: false,
  // });
  const SFTs = ["APE COIN", "X XOIN", "TCCC"];

  // if (isLoading) return <span>Loading...</span>;
  // if (error) return <span>Error: {error}</span>;

  const claimCoupon = async () => {
    // Interaction with the contract with call
    const bal1 = await myTestContract.call("name");
    console.log(bal1);
  };

  const VerifyCondition = () => {
    return (
      <div>
        {selectedCoupon === 0 ? (
          <div>
            <div>PROOF OF APE COIN OG</div>
            <button>Verify</button>
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
      <div className="description">
        Reward SFT base on Proof, like proof of OG{" "}
      </div>
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
      </div>
    </div>
  );
}
