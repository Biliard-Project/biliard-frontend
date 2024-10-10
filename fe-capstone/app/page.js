import Navbar2 from "./components/navbar2";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex flex-col gap-14 w-10/12 mx-14 my-12 lg:mx-24 lg:w-9/12">
        {/* light green area */}
        <div className="bg-lightgreen rounded-3xl shadow-xl">
          <div className="flex justify-between">
            <div className="flex flex-col px-7 py-7 md:px-10 lg:py-8 lg:px-14 tracking-wider">
              <p className="mb-1.5 text-md md:text-xl">Welcome back,</p>
              <p className="font-bold text-2xl md:text-3xl mb-4">Aditya Pramudya!</p>
              <p className="text-md md:text-xl">Monitor selalu kadar bilirubin harian pasien!</p>
              <button className="button bg-darkgreen w-44 md:w-52 rounded-3xl font-semibold text-lg md:text-xl p-2.5 mt-8 text-white cursor-pointer hover:shadow-lg hover:shadow-gray-400 hover:scale-100">
                <a href="/monitoring">cek sekarang</a>
              </button>
            </div>
            <div className="flex items-end">
              {/* Hide this image on mobile screens */}
              <img src="/assets/statistics.png" className="statis mr-32 lg:mr-24 hidden md:block" />
            </div>
          </div>
        </div>

        {/* platform features */}
        <div className="w-full px-6 md:px-10">
          <p className="text-darkgreen font-bold text-3xl">Platform Features</p>
        </div>

        {/* Feature button */}
        <div className="flex flex-col justify-center gap-10 lg:flex-row">
          <a
            href="/monitoring"
            className="flex justify-center items-center gap-6 bg-lightyellow rounded-2xl shadow-lg py-6 px-10 hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <img src="/assets/stat.png" className="stat" />
            </div>
            <div className="text-darkgreen text-3xl font-bold justify-start">Monitoring</div>
          </a>
          <a
            href="/weekly-report"
            className="flex justify-center items-center gap-6 bg-lightyellow rounded-2xl shadow-lg py-6 px-10 hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <img src="/assets/report.png" className="stat" />
            </div>
            <div className="text-darkgreen text-3xl font-bold">Weekly Report</div>
          </a>
          <a
            href="/data-pasien"
            className="flex justify-center items-center gap-6 bg-lightyellow rounded-2xl shadow-lg py-6 px-10 hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <img src="/assets/db.png" className="stat" />
            </div>
            <div className="text-darkgreen text-3xl font-bold">Data Pasien</div>
          </a>
        </div>
      </div>
    </main>
  );
}
