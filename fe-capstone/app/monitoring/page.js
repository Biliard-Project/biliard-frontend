import Navbar2 from "../components/navbar2";

// Card Component
const Card = ({ title, children }) => {
    return (
      <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full text-center">
        <h3 className="text-lg font-bold text-darkgreen mb-2">{title}</h3>
        <div className="text-5xl font-bold text-darkgreen">{children}</div>
      </div>
    );
  };
  
  // Component Data Pasien
  const DataCard = ({ name, birthDate }) => {
    return (
      <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full">
        <h3 className="text-lg font-bold text-darkgreen mb-2">Data Pasien</h3>
        <p className="mb-1"><span>Nama Lengkap :</span> {name}</p>
        <p><span>Tanggal Lahir :</span> {birthDate}</p>
      </div>
    );
  };

export default function Monitoring() {
    // temporary data dummy
    const patientData = {
        name: "Sarah Jelita",
        birthDate: "27 Juni 2000",
      };
    
  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-16 mt-6 items-start justify-start">
        <div className="text-darkgreen text-2xl font-bold">Monitoring</div>
      </div>
      <div className="line"></div>

      <div className="flex w-full px-16 my-4 items-start justify-start text-gray-400">
        Tanggal Pengecekan: 21 Mei 2025
      </div>

      <div className="grid grid-cols-2 px-16 gap-3.5 w-full">
        {/* Grafik 1 */}
        <div className="w-full p-2 h-96 bg-black">
            {/* Grafik 1: nanti diisi grafik disini */}
        </div>

        {/* Grafik 2 dan 3 */}
        <div className="flex flex-col gap-2">
            <div className="w-full h-1/2 bg-red">
                {/* Grafik 2: nanti diisi grafik disini */}
            </div>
            <div className="w-full h-1/2 bg-darkgreen">
                {/* Grafik 3: nanti diisi grafik disini */}
            </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-4 px-16 my-6 w-full">
        {/* Data Pasien */}
        <DataCard name={patientData.name} birthDate={patientData.birthDate} />

        {/* Bilirubin */}
        <Card title="Bilirubin (mg/dl)">
          0.8
        </Card>

        {/* Heart Rate */}
        <Card title="Heart Rate (bpm)">
          125
        </Card>

        {/* Saturasi O2 */}
        <Card title="Saturasi O₂ (%)">
          98
        </Card>
      </div>

    </main>
  );
}
