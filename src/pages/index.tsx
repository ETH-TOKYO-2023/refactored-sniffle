import Image from "next/image";
import { Inter } from "next/font/google";
import Anime1 from "../../public/1.svg";
import Sponor1 from "../../public/1_.svg";
import Anime2 from "../../public/2.svg";
import Sponor2 from "../../public/2_.svg";
import Anime3 from "../../public/3.svg";
import Anime4 from "../../public/4.svg";
import Anime5 from "../../public/5.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const SFTs = ["APE COIN", "X XOIN", "TCCC"];
  const AnimeToColor = new Map();
  AnimeToColor.set(1, "#fce5ad");
  AnimeToColor.set(2, "#e4daeb");
  AnimeToColor.set(3, "#c6d5e9");
  return (
    <div>
      <ConnectButton />
      <div>Reward SFT base on Proof, like proof of OG </div>

      <div>
        <p>Verify on</p>
        <button>Starknet</button>
        <button>EVM</button>
      </div>
      <div>using HERODOTUS</div>
      <div className="reward_wrap">
        {/* APECOIN SPONSOR */}
        <div className="reward" style={{ background: AnimeToColor.get(1) }}>
          <div className="sponsor_logo">
            <Image src={Sponor1} alt="sponsor" />
            <div className="explanation">
              <div>APE COIN</div>
              <div>PROOF OF OG</div>
            </div>
          </div>

          <Image src={Anime1} alt="anime" />
        </div>
        <div className="reward" style={{ background: AnimeToColor.get(2) }}>
          <div>
            <div>APE COIN</div>
            <div>PROOF OF OG</div>
          </div>
          <Image src={Anime2} alt="anime" />
        </div>
        <div className="reward" style={{ background: AnimeToColor.get(3) }}>
          <div>
            <div>APE COIN</div>
            <div>PROOF OF OG</div>
          </div>
          <Image src={Anime3} alt="anime" />
        </div>
      </div>

      <div>
        <div>Verify</div>
        <div>Claim</div>
      </div>

      {/* <div>using SISMO</div> */}
    </div>
  );
}
