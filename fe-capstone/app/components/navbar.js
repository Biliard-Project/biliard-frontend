"use client";

export default function Navbar() {
    return (
        <div className="flex bg-darkgreen text-white w-full justify-between items-center px-6 py-3">
            <a href="/" className="flex flex-row gap-4">
                <img
                    src="/assets/logo.png"
                    className="img-logo2">
                </img>
                <div className="flex justify-center items-center font-semibold text-2xl tracking-wide">
                    BiliarD
                </div>
            </a>
            <div className="flex gap-14 font-semibold text-lg">
                <a href="/" className="text-white hover:bg-white hover:text-black rounded-lg py-1 px-2">
                    Home
                </a>
                <a href="/monitoring" className="text-white hover:bg-white hover:text-black rounded-lg py-1 px-2">
                    Monitoring
                </a>
                <a href="/weekly-report" className="text-white hover:bg-white hover:text-black rounded-lg py-1 px-2">
                    Weekly Report
                </a>
                <a href="/data-pasien" className="text-white hover:bg-white hover:text-black rounded-lg py-1 px-2">
                    Data Pasien
                </a>
            </div>
        </div>
    )
}
