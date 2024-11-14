"use client"
import { useState, useEffect } from "react";
import Navbar2 from "../components/navbar2";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataPasien = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    gender: "",
    birthdate: "",
    description: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("https://biliard-backend.dundorma.dev/patients", requestOptions)
      .then(response => response.json())
      .then(result => {
        const formattedPatients = result.map(patient => {
          const [date, time] = patient.birth_date.split(" ");
          return {
            id: patient.id,
            name: patient.name,
            gender: patient.gender,
            birthdate: date,
            birthtime: time ? time.substring(0,5) : "", 
            description: patient.keterangan
          };
        });
        setPatients(formattedPatients);
      })
      .catch(error => console.log('Error fetching patients:', error));
  }, []);

  const handleAddOrEditPatient = () => {
    const formattedBirthDateTime = `${newPatient.birthdate} ${newPatient.birthtime}:00`; // Format: YYYY-MM-DD HH:MM:SS

    const requestOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: isEditing ? patients[editIndex].id : undefined,
        name: newPatient.name,
        gender: newPatient.gender,
        birth_date: formattedBirthDateTime,
        keterangan: newPatient.description
      })
    };
  
    if (isEditing) {
      requestOptions.method = 'PUT';
      fetch(`https://biliard-backend.dundorma.dev/patients`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update patient');
          }
          return response.json();
        })
        .then(() => {
          // Update patient data in the state after successful edit
          const updatedPatients = [...patients];
          updatedPatients[editIndex] = { 
            ...newPatient, 
            id: patients[editIndex].id,
            birthdate: newPatient.birthdate,
            birthtime: newPatient.birthtime,
            description: newPatient.description
          };
          setPatients(updatedPatients);
          resetForm();
          setShowModal(false);
        })
        .catch(error => console.error('Error updating patient:', error));
    } else {
      requestOptions.method = 'POST';
      fetch("https://biliard-backend.dundorma.dev/patients", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add patient');
          }
          return response.json();
        })
        .then(newPatientData => {
          const [date, time] = newPatientData.birth_date.split(" ");
          const formattedPatient = {
            id: newPatientData.id,
            name: newPatientData.name,
            gender: newPatientData.gender,
            birthdate: date,
            birthtime: time ? time.substring(0,5) : "",
            description: newPatientData.keterangan
          };
          setPatients([...patients, formattedPatient]);
          resetForm();
          setShowModal(false);
        })
        .catch(error => console.error('Error adding patient:', error));
    }
  };
  
  //reset form after submitting form
  const resetForm = () => {
    setNewPatient({
      name: "",
      gender: "",
      birthdate: "",
      birthtime: "",
      description: ""
    });
    setEditIndex(null);
    setIsEditing(false);
  };  
  
  const handleDelete = () => {
    const patientToDelete = patients[deleteIndex];
    const patientId = patientToDelete.id;
  
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
  
    fetch(`https://biliard-backend.dundorma.dev/patients/${patientId}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete patient');
        }
        return response.json();
      })
      .then(result => {
        if (result.message === "success") {
          // Remove the deleted patient from the state
          const updatedPatients = patients.filter((_, i) => i !== deleteIndex);
          setPatients(updatedPatients);
          setShowDeleteModal(false);
          setDeleteIndex(null);
        } else {
          throw new Error('Deletion was not successful');
        }
      })
      .catch(error => {
        console.log('Error deleting patient:', error);
      });
  };  

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewPatient({
      ...patients[index],
      birthtime: patients[index].birthtime || ""
    });
    setIsEditing(true);
    setShowModal(true);
  };

   // Function to generate PDF patient records
   const handleDownloadPdf = async (patientId) => {
    try {
      // Find the patient's name and birthdate from the patients state
      const patient = patients.find((p) => p.id === patientId);
      const patientName = patient ? patient.name : "Unknown";
      const patientBirthdate = patient ? patient.birthdate : "Unknown";
      const patientBirthtime = patient ? patient.birthtime : "Unknown";
  
      const response = await fetch(`https://biliard-backend.dundorma.dev/records/patient/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient records');
      
      const records = await response.json();
      const doc = new jsPDF();
      
      // Patient identitiy
      doc.setFontSize(14);
      doc.text("Patient Records", 14, 15);
      doc.setFontSize(11);
      doc.text(`Nama: ${patientName}`, 14, 25);
      doc.text(`Tanggal Lahir: ${patientBirthdate}`, 14, 32);
      doc.text(`Waktu Lahir: ${patientBirthtime}`, 14, 39);
  
      // Table headers and rows
      const tableColumn = ["Date", "Bilirubin", "Oxygen Saturation", "Heart Rate"];
      const tableRows = records.map(record => [
        record.test_date,
        record.bilirubin,
        record.oxygen,
        record.heart_rate,
      ]);
  
      // Add table to PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        headStyles: { fillColor: [60, 91, 111] },
      });
  
      // Save the PDF
      doc.save(`Patient_${patientId}_Records.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-6 md:px-8 lg:px-16 mt-6 lg:mt-8 mb-1 lg:mb-3 items-start justify-start">
        <div className="text-darkgreen text-xl md:text-2xl lg:text-3xl font-bold">Data Pasien</div>
      </div>
      <div className="line"></div>

      <div className="flex flex-col items-center container mt-3 md:mt-8 mx-auto p-5 lg:p-4">
        <div className="w-full overflow-x-auto lg:w-12/12 md:overflow-hidden rounded-lg">
          <table className="table-auto w-full text-sm md:text-base lg:text-xl">
            <thead className="bg-lightyellow">
              <tr className="text-black">
                <th className="border px-4 py-2 md:px-4 md:py-2 rounded-tl-lg">Nama</th>
                <th className="border px-4 py-2 md:px-4 md:py-2 ">Jenis Kelamin</th>
                <th className="border px-4 py-2 md:px-4 md:py-2 ">Tanggal Lahir</th>
                <th className="border px-4 py-2 md:px-4 md:py-2 ">Waktu Lahir</th>
                <th className="border px-4 py-2 md:px-4 md:py-2 ">Keterangan</th>
                <th className="border px-4 py-2 md:px-4 md:py-2 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-lightgray text-black text-base lg:text-xl">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No Data</td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 md:px-4 md:py-2 lg:py-3">{patient.name}</td>
                    <td className="border px-4 py-2 md:px-4 md:py-2 lg:py-3">{patient.gender}</td>
                    <td className="border px-4 py-2 md:px-4 md:py-2 lg:py-3">{patient.birthdate}</td>
                    <td className="border px-4 py-2 md:px-4 md:py-2 lg:py-3">{patient.birthtime}</td>
                    <td className="border px-4 py-2 md:px-4 md:py-2 lg:py-3">
                      <div className="truncate max-w-xs" title={patient.description}>
                        {patient.description}
                      </div>
                    </td>
                    <td className="border px-4 py-2 md:px-4 md:py-2 text-center align-middle">
                      <div className="flex justify-center items-center gap-3 md:gap-5">
                        <button onClick={() => handleEdit(index)} className="h-5 w-5 md:h-6 md:w-6">
                          <img src="/assets/edit.png" alt="Edit" />
                        </button>
                        <button onClick={() => confirmDelete(index)} className="h-5 w-5 md:h-6 md:w-6">
                          <img src="/assets/delete.png" alt="Delete" />
                        </button>
                        <button onClick={() => handleDownloadPdf(patient.id)} className="h-5 w-5 md:h-7 md:w-7">
                          <img src="/assets/download3.png" alt="Download" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          className="mt-7 text-xl md:mx-6 lg:mx-12 px-5 py-2 bg-darkgreen text-white font-semibold rounded-xl self-start"
          onClick={() => setShowModal(true)}
        >
          Add new data
        </button>

        {showModal && (
          <div className="fixed z-10 inset-0 bg-white bg-opacity-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white px-8 md:px-16 py-8 border border-gray-400 rounded-xl shadow-lg w-11/12 md:w-9/12 lg:w-1/2">
                <h2 className="text-lg font-bold mb-4 text-black">
                  {isEditing ? "Edit Patient" : "Add New Patient"}
                </h2>
                <label className="block mb-2 text-black">Nama</label>
                <input
                  type="text"
                  placeholder="Nama"
                  className="border p-2 mb-4 w-full text-black"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                />

                <label className="block mb-2 text-black">Jenis Kelamin</label>
                <select
                  className={`border p-2 mb-4 w-full ${newPatient.gender === "" ? "text-gray-500" : "text-black"}`}
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, gender: e.target.value })
                  }
                >
                  <option value="" className="text-gray-500">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <label className="block mb-2 text-black">Tanggal Lahir</label>
                <div className="flex mb-4">
                  <input
                    type="date"
                    className={`border p-2 mr-2 w-1/2 ${newPatient.birthdate === "" ? "text-gray-500" : "text-black"}`}
                    value={newPatient.birthdate}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, birthdate: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    className={`border p-2 w-1/2 ${newPatient.birthtime === "" ? "text-gray-500" : "text-black"}`}
                    value={newPatient.birthtime}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, birthtime: e.target.value })
                    }
                  />
                </div>

                <label className="block mb-2 text-black">Keterangan</label>
                <input
                  type="text"
                  placeholder="Keterangan"
                  className="border p-2 mb-4 w-full text-black"
                  value={newPatient.description}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, description: e.target.value })
                  }
                />

                <div className="flex justify-end">
                  <button
                    className="bg-red text-white px-3 py-1.5 rounded-xl mr-2 font-semibold"
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setNewPatient({
                        name: "",
                        gender: "",
                        birthdate: "",
                        birthtime: "",
                        description: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-darkgreen text-white px-5 py-1.5 rounded-xl mr-2 font-semibold"
                    onClick={handleAddOrEditPatient}
                  >
                    {isEditing ? "Save" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white mx-6 p-6 rounded-xl shadow-lg">
              <h3 className="text-lg mb-5">
                Are you sure you want to delete this item?
              </h3>
              <div className="flex justify-end gap-1">
                <button
                  className="bg-gray-300 text-black px-3 py-1.5 rounded-xl mr-2 font-semibold"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red text-white px-4 py-1.5 rounded-xl font-semibold"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DataPasien;