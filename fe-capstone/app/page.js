"use client"
import Navbar1 from "./components/navbar1";
import Footer1 from './components/footer1';
import FeatureSection from "./components/featureSection";

export default function landingPage() {  
  return (

    <main className="flex min-h-screen flex-col bg-white items-center">
        <Navbar1></Navbar1>
        <div className="flex flex-row items-center justify-between bg-lightgreen w-full py-8 md:py-14 px-8 md:px-20">
          {/* light green */}
          <div className="flex flex-col w-full lg:w-8/12">
            <div className="text-2xl md:text-3xl text-black font-semibold mb-5">
              Monitor kesehatan  mu!
            </div>
            <div className="text-black text-sm md:text-lg leading-6 md:leading-loose text-justify">
              BiliarD merupakan platform inovatif yang dirancang khusus untuk mendeteksi kadar bilirubin secara non-invasif pada bayi yang mengalami kondisi neonatal jaundice (bayi kuning). Aplikasi ini memberikan solusi digital yang efisien dan terjangkau bagi tenaga medis serta fasilitas kesehatan dalam memantau serta mengelola kesehatan bayi dengan hiperbilirubinemia.
            </div>
            <div>
              <button className="bg-darkgreen w-48 text-xl py-2 rounded-3xl text-white font-semibold mt-8 hover:shadow-lg active:shadow-md active:scale-95 transform hover:scale-105 transition duration-300">
                <a href="/login">
                  Get Started
                </a>
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img src="/assets/foot.png" className="img-foot mr-20"/>
          </div>
        </div>
        <div className="flex w-full px-8 md:px-16 py-10 md:mb-10 lg:mb-14 lg:mt-10 text-darkgreen text-2xl md:text-4xl font-bold">
          Platform Features
        </div>
        <div className="flex flex-col md:flex-row gap-5 mb-20 lg:mb-32 px-6 md:px-0">
          <div className="flex flex-row md:flex-col justify-center items-center font-semibold w-11/12 md:w-5/12 gap-4 md:gap-6">
            <img src="/assets/lp1.png" className="img-lp"/>
            <p className="text-sm md:text-lg lg:text-xl text-left md:text-center w-10/12">Memungkinkan deteksi kadar bilirubin secara non invasif</p>
          </div>
          <div className="flex flex-row md:flex-col justify-center items-center font-semibold w-11/12 md:w-5/12 gap-4 md:gap-6">
            <img src="/assets/lp2.png" className="img-lp"/>
            <p className="text-sm md:text-lg lg:text-xl text-left md:text-center w-10/12">Menyediakan grafik statistik hasil tes setiap minggunya</p>
          </div>
          <div className="flex flex-row md:flex-col items-center justify-center font-semibold w-11/12 md:w-5/12 gap-4 md:gap-6">
            <img src="/assets/lp3.png" className="img-lp"/>
            <p className="text-sm md:text-lg lg:text-xl text-left md:text-center w-10/12">Menyediakan data riwayat hasil pengecekan pasien</p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-darkgreen w-full py-10 lg:py-14 text-5xl font-bold text-white">
            Why us?
        </div>
        <div className="flex flex-col w-full lg:w-10/12 bg-white px-10 md:px-20 lg:px-40 py md:py-20 lg:py-28 gap-10 md:gap-16 lg:gap-20">
          <FeatureSection
            number={1}
            title="Monitoring yang Lebih Mudah dan Nyaman"
            description="BiliarD menggunakan teknologi sensor optik untuk mendeteksi kadar bilirubin secara non-invasif tanpa pengambilan darah. Hal ini membuat pemantauan lebih nyaman dan aman bagi bayi, serta mengurangi risiko infeksi."
          />
          <FeatureSection
            number={2}
            title="Pemantauan Heart Rate dan Saturasi Oksigen"
            description="Selain bilirubin, BiliarD juga mampu memantau heart rate dan saturasi oksigen, memberikan gambaran kesehatan bayi yang lebih lengkap bagi tenaga medis."
          />
          <FeatureSection
            number={3}
            title="Report Komprehensif dan Riwayat Data Terorganisir"
            description="BiliarD menyediakan report lengkap dengan dashboard data statistik bilirubin, heart rate, dan saturasi oksigen. Riwayat data pasien terdokumentasi dengan baik dan dapat diunduh dalam format PDF untuk kemudahan evaluasi dan dokumentasi."
          />
          <FeatureSection
            number={4}
            title="Solusi Low-Cost untuk Tenaga Medis"
            description="BiliarD menawarkan pemantauan kesehatan yang efisien dan low-cost, memungkinkan fasilitas kesehatan untuk menjaga kualitas layanan tanpa membebani anggaran."
          />
        </div>
      
        <Footer1></Footer1>
    </main>
  );
}
