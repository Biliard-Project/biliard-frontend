"use client"

import { useState } from "react";
import Navbar2 from "../components/navbar2";

const DataPasien = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    gender: "",
    birthdate: "",
    testDate: "",
    description: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

 
  const handleAddOrEditPatient = () => {
    if (isEditing) {
      const updatedPatients = [...patients];
      updatedPatients[editIndex] = newPatient;
      setPatients(updatedPatients);
    } else {
      setPatients([...patients, newPatient]);
    }
    setShowModal(false);
    setIsEditing(false);
    setNewPatient({ name: "", gender: "", birthdate: "", testDate: "", description: "" });
  };


  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const updatedPatients = patients.filter((_, i) => i !== deleteIndex);
    setPatients(updatedPatients);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };


  const handleEdit = (index) => {
    setEditIndex(index);
    setNewPatient(patients[index]);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-6 md:px-8 lg:px-16 mt-6 items-start justify-start">
        <div className="text-darkgreen text-xl md:text-2xl font-bold">Data Pasien</div>
      </div>
      <div className="line"></div>

      <div className="flex flex-col items-center container mt-3 md:mt-8 mx-auto p-5 lg:p-4">
        {/* Tabel */}
        <div className="w-full overflow-x-auto lg:w-10/12 md:overflow-hidden rounded-lg">
          <table className="table-auto w-full">
            <thead className="bg-lightyellow">
              <tr>
                <th className="border px-4 py-2 rounded-tl-lg">Nama</th>
                <th className="border px-4 py-2">Jenis Kelamin</th>
                <th className="border px-4 py-2">Tanggal Lahir</th>
                <th className="border px-4 py-2">Tanggal Test</th>
                <th className="border px-4 py-2">Keterangan</th>
                <th className="border px-4 py-2 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-lightgray">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No Data</td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{patient.name}</td>
                    <td className="border px-4 py-2">{patient.gender}</td>
                    <td className="border px-4 py-2">{patient.birthdate}</td>
                    <td className="border px-4 py-2">{patient.testDate}</td>
                    <td className="border px-4 py-2">{patient.description}</td>
                    <td className="border py-2 flex justify-center items-center gap-5">
                      <button onClick={() => handleEdit(index)}>
                        <img src="/assets/edit.png" alt="Edit" className="h-6 w-6" />
                      </button>
                      <button onClick={() => confirmDelete(index)}>
                        <img src="/assets/delete.png" alt="Delete" className="h-7 w-7" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          className="mt-7 md:mx-6 lg:mx-36 px-5 py-2 bg-darkgreen text-white font-semibold rounded-xl self-start"
          onClick={() => setShowModal(true)}
        >
          Add new data
        </button>

        {/* form data pasien */}
        {showModal ? (
            <div className="fixed z-10 inset-0 bg-white bg-opacity-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white px-8 md:px-16 py-8 border border-gray-400 rounded-xl shadow-lg w-11/12 md:w-9/12 lg:w-1/2">
                    <h2 className="text-lg font-bold mb-4">
                    {isEditing ? "Edit Patient" : "Add New Patient"}
                    </h2>

                    {/* Form Input Fields */}
                    <label className="block mb-2">Nama</label>
                    <input
                    type="text"
                    placeholder="Nama"
                    className="border p-2 mb-4 w-full"
                    value={newPatient.name}
                    onChange={(e) =>
                        setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    />

                    <label className="block mb-2">Jenis Kelamin</label>
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

                    <label className="block mb-2">Tanggal Lahir</label>
                    <input
                    type="date"
                    className={`border p-2 mb-4 w-full ${newPatient.birthdate === "" ? "text-gray-500" : "text-black"}`}
                    value={newPatient.birthdate}
                    onChange={(e) =>
                        setNewPatient({ ...newPatient, birthdate: e.target.value })
                    }
                    />

                    <label className="block mb-2">Tanggal Test</label>
                    <input
                    type="date"
                    className={`border p-2 mb-4 w-full ${newPatient.testDate === "" ? "text-gray-500" : "text-black"}`}
                    value={newPatient.testDate}
                    onChange={(e) =>
                        setNewPatient({ ...newPatient, testDate: e.target.value })
                    }
                    />

                    <label className="block mb-2">Keterangan</label>
                    <input
                    type="text"
                    placeholder="Keterangan"
                    className="border p-2 mb-4 w-full"
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
                            testDate: "",
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
        ) : null}

        {/* confirmation delete */}
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
