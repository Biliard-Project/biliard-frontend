"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import Navbar2 from "../components/navbar2";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";

// Card Component
const Card = ({ title, children }) => {
  return (
    <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full text-center">
      <h3 className="text-lg font-bold text-darkgreen mb-2">{title}</h3>
      <div className="text-5xl font-bold text-darkgreen">{children}</div>
    </div>
  );
};

// Component Data Pasien (Renamed to PatientDataCard)
const PatientDataCard = ({ name, birthDate }) => {
  return (
    <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full">
      <h3 className="text-lg font-bold text-darkgreen mb-2">Data Pasien</h3>
      <p className="mb-1"><span>Nama Lengkap:</span> {name}</p>
      <p className="mb-1"><span>Tanggal Lahir:</span> {birthDate}</p>
    </div>
  );
};

export default function Monitoring() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patient");

  const [patientData, setPatientData] = useState(null);
  const [recordsData, setRecordsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) {
      setError("No patient selected.");
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        const response = await fetch(`https://biliard-backend.dundorma.dev/patients/${patientId}`, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to fetch patient data.');
      }
    };

    const fetchRecordsData = async () => {
      try {
        const response = await fetch(`https://biliard-backend.dundorma.dev/records/patient/${patientId}`, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecordsData(data);
      } catch (err) {
        console.error('Error fetching records data:', err);
        setError('Failed to fetch records data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
    fetchRecordsData();
  }, [patientId]);

  // change data records format for Recharts
  const formatRecordsData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map(record => ({
      timestamp: dayjs(record.test_date).format("DD MMM HH:mm"),
      bilirubin: record.bilirubin,
      heartRate: record.heart_rate,
      oxygenSaturation: record.oxygen
    }));
  };

  const formattedRecordsData = formatRecordsData(recordsData);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-white items-center justify-center">
        <p className="text-gray-800">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-white items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  // check patient
  if (!patientData) {
    return (
      <main className="flex min-h-screen flex-col bg-white items-center justify-center">
        <p className="text-gray-800">No patient data available.</p>
      </main>
    );
  }

  // Get the latest test date
  const latestRecordDate = recordsData.length > 0 
  ? dayjs(recordsData[recordsData.length - 1].test_date).format("DD MMMM YYYY")
  : dayjs().format("DD MMMM YYYY");

  const latestBilirubin = formattedRecordsData.length > 0 ? formattedRecordsData[formattedRecordsData.length - 1].bilirubin : null;
  const latestHeartRate = formattedRecordsData.length > 0 ? formattedRecordsData[formattedRecordsData.length - 1].heartRate : null;
  const latestOxygen = formattedRecordsData.length > 0 ? formattedRecordsData[formattedRecordsData.length - 1].oxygenSaturation : null;

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2 />
      <div className="flex w-full px-8 md:px-16 mt-4 md:mt-6 items-start justify-start">
        <div className="text-darkgreen text-xl md:text-2xl font-bold">Monitoring</div>
      </div>
      <div className="line"></div>

      <div className="flex w-full px-8 md:px-16 my-4 items-start justify-start text-gray-400">
        Tanggal Pengecekan: {latestRecordDate}
      </div>

      {/* Grafik Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 px-8 md:px-16 gap-2 lg:gap-3.5 w-full">
        {/* Grafik Bilirubin */}
        <div className="w-full p-2 h-auto bg-white rounded-lg shadow-lg">
          <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Bilirubin (mg/dL)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={formattedRecordsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="timestamp" />
              <YAxis 
                domain={['dataMin - 0.1', 'dataMax + 0.1' ]}  
                tickFormatter={(value) => value.toFixed(2)} 
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bilirubin" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Heart Rate dan Oxygen Saturation */}
        <div className="flex flex-col gap-2">
          {/* Grafik Heart Rate */}
          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Heart Rate (bpm)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['dataMin', 'dataMax' ]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafik Oxygen Saturation */}
          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Saturasi Oksigen (%)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['dataMin', 'dataMax' ]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="oxygenSaturation" stroke="#ffc658" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-10 md:px-16 my-6 w-full">
        {/* Data Pasien */}
        <PatientDataCard 
          name={patientData.name} 
          birthDate={dayjs(patientData.birth_date).format("DD MMM YYYY")} 
          gender={patientData.gender} 
        />

        {/* Bilirubin */}
        <Card title="Bilirubin (mg/dL)">
          {latestBilirubin !== null ? latestBilirubin.toFixed(2) : "N/A"}
        </Card>

        {/* Heart Rate */}
        <Card title="Heart Rate (bpm)">
          {latestHeartRate !== null ? latestHeartRate.toFixed(2) : "N/A"}
        </Card>

        {/* Saturasi O2 */}
        <Card title="Saturasi O₂ (%)">
          {latestOxygen !== null ? latestOxygen.toFixed(2) : "N/A"}
        </Card>
      </div>
    </main>
  );
}
