import Navbar2 from "../components/navbar2";
import DataCard from "../components/dataCard";
import SummaryCard from "../components/summaryCard";

export default function Monitoring() {
    // temporary data dummy
    const patientData = {
        name: "Sarah Jelita",
        birthDate: "27 Juni 2000",
        gender: "Laki-laki"
      };
    
      const summaryText = (
        <>
          <p>Kadar bilirubin Anda selama seminggu ini menunjukkan fluktuasi yang berada dalam rentang normal. Rata-rata kadar bilirubin anda 0.80 mg/dL, dengan kadar tertinggi sebesar 0.90 mg/dL dan kadar terendah sebesar 0.70 mg/dL.</p>
        </>
      );

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-16 mt-6 items-start justify-start">
        <div className="text-darkgreen text-2xl font-bold">Weekly Report</div>
      </div>
      <div className="line"></div>

      <div className="flex w-full px-16 my-4 items-start justify-start text-gray-400">
        Periode: 13 Mei 2024 - 20 Mei 2024
      </div>
      
      {/* grafik weekly report */}
      <div className="grid grid-cols-2 px-16 gap-3.5 w-full">
        {/* Grafik 1 */}
        <div className="w-full p-2 h-96 bg-black">
            {/* Grafik 1: nanti diisi grafik disini*/}
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


      {/* data & summary */}
      <div className="flex justify-between px-16 mt-6 mb-10 gap-3.5">
        <DataCard name={patientData.name} birthDate={patientData.birthDate} gender={patientData.gender} />
        <SummaryCard>{summaryText}</SummaryCard>
      </div>
    </main>
  );
}
