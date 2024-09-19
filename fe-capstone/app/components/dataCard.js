const DataCard = ({ name, birthDate, gender }) => {
    return (
      <div className="w-1/4 bg-lightgreen p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-darkgreen mb-3">Data Pasien</h3>
        <p className="mb-1.5"><span>Nama Lengkap :</span> {name}</p>
        <p className="mb-1.5"><span>Tanggal Lahir :</span> {birthDate}</p>
        <p><span>Jenis Kelamin :</span> {gender}</p>
      </div>
    );
  };
  
  export default DataCard;