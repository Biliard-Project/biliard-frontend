"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const SearchModal = ({ isOpen, onClose, redirectToPage }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [noData, setNoData] = useState(false);
  const router = useRouter(); // Initialize router

  // Dummy data pasien
  const patients = [
    { id: 1, name: "Adi Budi Cahyana" },
    { id: 2, name: "Sarah Jelita" },
    { id: 3, name: "Dewi Rahmawati" },
    { id: 4, name: "Pramudya Aditya" }
  ];

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
  }, [inputValue]);
  
  const handlePatientClick = (patient) => {
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
            className="mt-4 p-2 border w-full rounded-xl focus:outline-none"
          />

          {/* Display filtered patients or no data message */}
          <div className="mt-2 px-2">
            {filteredPatients.length > 0 ? (
              <ul>
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id} 
                    className="py-3 border-b cursor-pointer hover:bg-gray-200"
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
            ) : null}
          </div>
        </div>
      </div>
    )
  );
};

export default SearchModal;
