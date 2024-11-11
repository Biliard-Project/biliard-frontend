"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import Navbar2 from "../components/navbar2";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";
// import duration from 'dayjs/plugin/duration'; // Remove if not using
// dayjs.extend(duration); // Remove if not using

// StatusCard Component
const StatusCard = ({ title, value, getStatus, additionalParams = {} }) => {
  const status = value !== null ? getStatus(value, additionalParams) : '';

  // Determine text color based on status
  let colorClass = "text-darkgreen"; // Default color for "Normal"
  if (status !== "Normal") {
    colorClass = "text-red"; // Red for any non-normal status
  }

  return (
    <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full text-center">
      <h3 className="text-lg font-bold text-darkgreen mb-2 md:mb-4 lg:mb-2">{title}</h3>
      <div
        className={`text-4xl lg:text-5xl font-bold ${colorClass}`}
        data-tooltip-content={status !== '' ? status : ''}
        data-tooltip-id={`${title}Tooltip`}
      >
        {value !== null ? value.toFixed(2) : "N/A"}
      </div>
      {status !== '' && (
        <ReactTooltip id={`${title}Tooltip`} place="top" />
      )}
    </div>
  );
};

// Status Functions
const getBilirubinStatus = (bilirubinLevel, { ageInHours }) => {
  if (ageInHours <= 24 && bilirubinLevel < 5) {
    return "Normal";
  } else if (ageInHours > 24 && ageInHours <= 48 && bilirubinLevel < 10) {
    return "Normal";
  } else if (ageInHours > 48 && ageInHours <= 72 && bilirubinLevel < 12) {
    return "Normal";
  } else if (ageInHours > 72 && bilirubinLevel < 15) {
    return "Normal";
  } else {
    return "Melebihi batas normal";
  }
};

const getHeartRateStatus = (heartRate) => {
  if (heartRate >= 70 && heartRate <= 160) {
    return "Normal";
  } else if (heartRate < 70) {
    return "Dibawah batas normal";
  }
  return "Melebihi batas normal";
};

const getOxygenSaturationStatus = (oxygenSaturation) => {
  if (oxygenSaturation >= 93) {
    return "Normal";
  } else if (oxygenSaturation < 93) {
    return "Dibawah batas normal";
  }
  return "Melebihi batas normal";
};

const PatientDataCard = ({ name, birthDate }) => {
  return (
    <div className="bg-lightgreen p-4 rounded-xl shadow-md w-full">
      <h3 className="text-lg font-bold text-darkgreen mb-2">Data Pasien</h3>
      <p className="md:text-sm lg:text-lg mb-1 text-black"><span>Nama Lengkap:</span> {name}</p>
      <p className="md:text-sm lg:text-lg mb-1 text-black"><span>Tanggal Lahir:</span> {birthDate}</p>
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
        console.log("Fetching patient data...");
        const response = await fetch(`https://biliard-backend.dundorma.dev/patients/${patientId}`, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPatientData(data);
        console.log("Patient data fetched:", data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to fetch patient data.');
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch Records Data with Interval
  useEffect(() => {
    if (!patientId) return;

    let isMounted = true; // To prevent state updates if component unmounts

    const fetchRecordsData = async () => {
      try {
        console.log("Fetching records data...");
        const response = await fetch(`https://biliard-backend.dundorma.dev/records/patient/${patientId}`, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setRecordsData(data);
          console.log("Records data fetched:", data);
        }
      } catch (err) {
        console.error('Error fetching records data:', err);
        if (isMounted) {
          setError('Failed to fetch records data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchRecordsData();

    // Set up interval
    const intervalId = setInterval(() => {
      fetchRecordsData();
    }, 3000);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [patientId]);

  // Change data records format for Recharts
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

  // Check patient
  if (!patientData) {
    return (
      <main className="flex min-h-screen flex-col bg-white items-center justify-center">
        <p className="text-gray-800">No patient data available.</p>
      </main>
    );
  }

  // Get the latest test date
  const latestRecord = recordsData.length > 0 ? recordsData[recordsData.length - 1] : null;
  const latestRecordDate = latestRecord 
    ? dayjs(latestRecord.test_date).format("DD MMMM YYYY")
    : dayjs().format("DD MMMM YYYY");

  // Calculate ageInHours based on latestRecord.test_date and patientData.birth_date
  let ageInHours = null;
  if (latestRecord) {
    const birthDate = dayjs(patientData.birth_date);
    const testDate = dayjs(latestRecord.test_date);
    const diffInHours = testDate.diff(birthDate, 'hour');
    ageInHours = diffInHours >= 0 ? diffInHours : null; // Ensure non-negative
  }

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
        <div className="w-full py-2 h-48 md:h-72 lg:h-auto bg-white rounded-lg shadow-lg">
          <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Bilirubin (mg/dL)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={formattedRecordsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="timestamp" />
              <YAxis 
                domain={['dataMin - 0.1', 'dataMax + 0.1' ]}  
                tickFormatter={(value) => value.toFixed(2)} 
              />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="bilirubin" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Heart Rate dan Oxygen Saturation */}
        <div className="flex flex-col gap-2">
          {/* Grafik Heart Rate */}
          <div className="w-full h-48 md:h-72 lg:h-1/2 bg-white rounded-lg shadow-lg px-1 py-2">
            <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Heart Rate (bpm)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['dataMin', 'dataMax' ]} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafik Oxygen Saturation */}
          <div className="w-full h-48 md:h-72 lg:h-1/2 bg-white rounded-lg shadow-lg px-1 py-2">
            <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Saturasi Oksigen (%)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['dataMin', 'dataMax' ]} />
                <RechartsTooltip />
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
        />

        {/* Bilirubin */}
        <StatusCard 
          title="Bilirubin (mg/dL)"
          value={latestBilirubin}
          getStatus={getBilirubinStatus}
          additionalParams={{ ageInHours }}
        />

        {/* Heart Rate */}
        <StatusCard 
          title="Heart Rate (bpm)"
          value={latestHeartRate}
          getStatus={getHeartRateStatus}
        />

        {/* Saturasi O2 */}
        <StatusCard 
          title="Saturasi O₂ (%)"
          value={latestOxygen}
          getStatus={getOxygenSaturationStatus}
        />
      </div>
    </main>
  );
}
