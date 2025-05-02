"use client"
import { Logo } from "@/components/logos";
import Link from "next/link";
import ParticlesBackground from "@/components/background";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image */}
      {/* <div 
        className="absolute inset-0 w-full h-full z-0 bg-[url('/bg.png')] md:bg-cover bg-contain bg-center bg-no-repeat"
      /> */}
      
      {/* Commented out video background
      <video 
        className="absolute inset-0 w-full h-full object-contain z-0"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      */}
      
      {/* Content with relative z-index to appear above background */}
      <div className="">
        <div className="fixed top-0 relative z-10 flex justify-center items-center p-6">
          <Logo className="w-24 text-white" />

          
        </div>
        <main className="relative z-[20] flex flex-col items-center">
          <div className="fixed bottom-8 right-8 sm:bottom-16 sm:right-16 flex flex-col text-right gap-4 text-gray-300">
            <Link href="/order" className="uppercase text-md sm:text-2xl">
              [ Place an Order ]
            </Link>
            <Link href="/order" className="uppercase text-md sm:text-2xl">
              [ Contact Us ]
            </Link>
            <div className="flex justify-end gap-6 mt-2">
              <a href="https://wa.me/61448635272?text=Hello,%20I%20have%20an%20inquiry%20for%20PSST%20Vodka%20" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 129 125" className="size-6 sm:size-7 text-gray-300"><path d="M83.8297 91.1904C58.5519 91.1904 37.9865 70.612 37.9796 45.3268C37.9865 38.9173 43.204 33.7051 49.5978 33.7051C50.2552 33.7051 50.9056 33.7605 51.5284 33.8713C52.8985 34.0997 54.1994 34.5634 55.3965 35.2625C55.5695 35.3664 55.6871 35.5326 55.7148 35.7264L58.3858 52.5669C58.4204 52.7677 58.3582 52.9615 58.2267 53.1069C56.7528 54.7404 54.8706 55.9172 52.7739 56.5056L51.7637 56.7893L52.1442 57.7652C55.5902 66.542 62.6069 73.5538 71.388 77.0146L72.3637 77.4023L72.6474 76.3918C73.2355 74.2945 74.4119 72.4117 76.045 70.9373C76.1626 70.8266 76.3218 70.7712 76.4809 70.7712C76.5155 70.7712 76.5501 70.7712 76.5917 70.7781L93.4273 73.45C93.628 73.4846 93.7941 73.5953 93.8979 73.7684C94.5899 74.9658 95.0535 76.274 95.2888 77.6445C95.3995 78.2536 95.4479 78.8973 95.4479 79.5687C95.4479 85.9714 90.2373 91.1835 83.8297 91.1904Z" fill="currentColor"></path><path d="M128.656 56.7476C127.292 41.3398 120.234 27.0464 108.782 16.5046C97.2609 5.90045 82.3142 0.0584717 66.6826 0.0584717C32.3746 0.0584717 4.46048 27.9808 4.46048 62.2989C4.46048 73.8167 7.63657 85.0369 13.6498 94.8104L0.23938 124.505L43.1763 119.93C50.6427 122.989 58.545 124.539 66.6757 124.539C68.8139 124.539 71.0074 124.429 73.2079 124.2C75.1454 123.993 77.1037 123.688 79.0274 123.3C107.758 117.493 128.732 91.9863 128.898 62.6311V62.2989C128.898 60.43 128.815 58.5611 128.649 56.7546L128.656 56.7476ZM44.8301 106.896L21.0747 109.429L28.1675 93.7099L26.7489 91.8065C26.6451 91.668 26.5413 91.5295 26.4237 91.3703C20.2651 82.8635 17.0128 72.8131 17.0128 62.3058C17.0128 34.9095 39.2943 12.6214 66.6826 12.6214C92.3409 12.6214 114.09 32.6461 116.186 58.2082C116.297 59.5787 116.359 60.9561 116.359 62.3128C116.359 62.7004 116.352 63.081 116.345 63.4894C115.82 86.4074 99.8142 105.871 77.422 110.827C75.7128 111.208 73.9621 111.499 72.2184 111.686C70.4054 111.893 68.544 111.997 66.6964 111.997C60.1158 111.997 53.722 110.724 47.681 108.204C47.0098 107.934 46.3524 107.643 45.7366 107.346L44.8371 106.91L44.8301 106.896Z" fill="currentColor"></path></svg>
              </a>
              <a href="https://www.instagram.com/psstvodka/" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 124 118" fill="none" className="size-6 sm:size-7 text-gray-300"><path d="M92.6175 0.706299H31.5025C14.6184 0.706299 0.882751 14.446 0.882751 31.3351V87.2628C0.882751 104.152 14.6184 117.892 31.5025 117.892H92.6175C109.502 117.892 123.237 104.152 123.237 87.2628V31.3351C123.237 14.446 109.502 0.706299 92.6175 0.706299ZM11.6845 31.3351C11.6845 20.4056 20.5763 11.5111 31.5025 11.5111H92.6175C103.544 11.5111 112.436 20.4056 112.436 31.3351V87.2628C112.436 98.1923 103.544 107.087 92.6175 107.087H31.5025C20.5763 107.087 11.6845 98.1923 11.6845 87.2628V31.3351Z" fill="currentColor"></path><path d="M62.0602 87.7819C77.761 87.7819 90.5417 75.0044 90.5417 59.292C90.5417 43.5796 77.7679 30.8021 62.0602 30.8021C46.3524 30.8021 33.5786 43.5796 33.5786 59.292C33.5786 75.0044 46.3524 87.7819 62.0602 87.7819ZM62.0602 41.6138C71.8101 41.6138 79.74 49.5462 79.74 59.299C79.74 69.0517 71.8101 76.9841 62.0602 76.9841C52.3103 76.9841 44.3803 69.0517 44.3803 59.299C44.3803 49.5462 52.3103 41.6138 62.0602 41.6138Z" fill="currentColor"></path><path d="M93.1782 35.405C97.4061 35.405 100.852 31.965 100.852 27.7289C100.852 23.4928 97.413 20.0526 93.1782 20.0526C88.9433 20.0526 85.5042 23.4928 85.5042 27.7289C85.5042 31.965 88.9433 35.405 93.1782 35.405Z" fill="currentColor"></path></svg>
              </a>
            </div>
          </div>
          <input
                type="text"
                value=""
                onChange={() => {}}
                placeholder="Enter your business name"
                className="bg-transparent border-b-2 border-white/30 focus:border-white px-4 py-3 text-center text-md focus:outline-none transition-colors"
              />
          {/* <Image src="/bg-img-2.png" alt="Logo" width={325} height={75} className="rotate-90 sm:rotate-90 -bottom-20 sm:bottom-0 m-0 left-10 sm:left-20 opacity-80" /> */}
        </main>
        
        <ParticlesBackground className="absolute inset-0 w-full h-full z-0" />

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

        </footer>
      </div>
    </div>
  );
}
