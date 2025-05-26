import Image from "next/image";
import Link from "next/link";
import PickerWheel from "./picker-wheel/page";

export default function Home() {
  return (
    <div className="
      grid grid-rows-[20px_1fr_20px] justify-items-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20
    ">
      <header>header</header>
      <main>
        <div>
          <PickerWheel/>
        </div>
      </main>
      <footer>footer</footer>
    </div>
  );
}
