"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const SearchModal = ({ isOpen, onClose, redirectToPage }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [noData, setNoData] = useState(false);
  const [patients, setPatients] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const router = useRouter(); // Initialize router

  // Dummy data pasien
  // const patients = [
  //   { id: 1, name: "Adi Budi Cahyana" },
  //   { id: 2, name: "Sarah Jelita" },
  //   { id: 3, name: "Dewi Rahmawati" },
  //   { id: 4, name: "Pramudya Aditya" }
  // ];

  useEffect(() => {
    
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://biliard-backend.dundorma.dev/patients", {
          method: 'GET',
          redirect: 'follow'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); 
        setPatients(data); // Set data pasien
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Gagal mengambil data pasien.');
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch data pertama kali saat modal dibuka
    fetchPatients();
  
    // Set interval untuk fetch data setiap 3 detik
    // const intervalId = setInterval(() => {
    //   fetchPatients();
    // }, 3000);
  
    // // Cleanup interval saat modal ditutup atau komponen di-unmount
    // return () => clearInterval(intervalId);
  }, []);  


  useEffect(() => {
    if (inputValue === "") {
      setFilteredPatients([]);
      setNoData(false);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(inputValue.toLowerCase())
      );

      if (filtered.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }

      setFilteredPatients(filtered);
    }
  }, [inputValue, patients]);

  const handlePatientScan = async (patientId) => {
    try {
      const response = await fetch(`https://biliard-backend.dundorma.dev/patient_scan/${patientId}`, {
        method: 'POST',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log("Patient set to scan:", result);
    } catch (error) {
      console.error("Error setting patient to scan:", error);
    }
  };

  
  const handlePatientClick = async (patient) => {
    await handlePatientScan(patient.id);
    // Redirect to the appropriate page with patient info
    if (redirectToPage === "monitoring") {
      router.push(`/monitoring?patient=${patient.id}`);
    } else if (redirectToPage === "weekly-report") {
      router.push(`/weekly-report?patient=${patient.id}`);
    }
    onClose(); // Close the modal after selecting a patient
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white h-96 p-6 rounded-3xl shadow-lg w-10/12 md:w-9/12 lg:w-1/2 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-darkgreen font-bold">Cari Pasien</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search patient"
            className="mt-4 p-2 border w-full rounded-xl focus:outline-none text-black"
          />

          {/* Display filtered patients or no data message */}
          <div className="mt-2 px-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {loading ?(
              <div className="text-center text-gray-800">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : filteredPatients.length > 0 ? (
              <ul>
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id} 
                    className="py-3 border-b cursor-pointer hover:bg-gray-200 text-black"
                    onClick={() => handlePatientClick(patient)} // Handle click event
                  >
                    {patient.name}
                  </li>
                ))}
              </ul>
            ) : noData ? (
              <div className="mt-4 text-center text-gray-800">
                No data found.
                <a href="/data-pasien" className="text-blue-500 ml-2 hover:underline">
                  Add new data
                </a>
              </div>
            ) : null }
            
          </div>
        </div>
      </div>
    )
  );
};

export default SearchModal;