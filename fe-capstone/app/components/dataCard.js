const DataCard = ({ name, birthDate, gender }) => {
    return (
      <div className="w-full lg:w-1/4 bg-lightgreen p-7 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-darkgreen mb-3">Data Pasien</h3>
        <p className="mb-1.5 text-xl text-black"><span>Nama Lengkap :</span> {name}</p>
        <p className="mb-1.5 text-xl text-black"><span>Tanggal Lahir :</span> {birthDate}</p>
        <p className="text-black text-xl"><span>Jenis Kelamin :</span> {gender}</p>
      </div>
    );
  };
  
  export default DataCard;