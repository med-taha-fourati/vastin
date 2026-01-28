import Link from 'next/link'; // Use 'react-router-dom' for Vite
import Threads from "@/components/ThreadsBackground/Threads";

export default function Hero() {
    return (
        <div className="relative w-screen h-screen bg-[#060010] overflow-hidden flex items-center justify-center">

            {/* these colors work like opengl colors (cuz its webgl duhh....) */}
            <div className="absolute inset-0 z-0">
                <Threads color={[0.137, 0.71, 0.827]} />
            </div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tighter mb-6">
                    Vastin
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-md mb-8">
                    Stay Mewing. Stay Sigma. Stay 67. 🤫🧏‍♂️
                </p>

                <Link href="/explore">
                    <button className="px-8 py-3 bg-[#23b5d3] hover:bg-[#23b5d3] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(35, 181, 211,0.4)]">
                        Get Started
                    </button>
                </Link>
            </div>

        </div>
    );
}