"use client";

import Navbar2 from "../components/navbar2";
import DataCard from "../components/dataCard";
import SummaryCard from "../components/summaryCard";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export default function WeeklyReport() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patient");
  const [patientData, setPatientData] = useState(null);
  const [recordsData, setRecordsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const getBilirubinStatus = (bilirubinLevel, testDate) => {
    if (!patientData) return "Data pasien tidak tersedia";

    const ageInHours = dayjs(testDate).diff(dayjs(patientData.birth_date), 'hour');

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

  // format records data
  const formatRecordsData = (data) => {
    return data.map(record => ({
      timestamp: dayjs(record.test_date).format("DD MMM HH:mm"),
      date: dayjs(record.test_date).format("DD MMM"),
      bilirubin: record.bilirubin,
      heartRate: record.heart_rate,
      oxygenSaturation: record.oxygen,
      bilirubinStatus: getBilirubinStatus(record.bilirubin, record.test_date)
    }));
  };
  
  // Fetch patient data
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

  // Fetch records data with interval
  useEffect(() => {
    if (!patientId) return;

    let isMounted = true; // prevent state updates if component unmounts

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

    // Generate weeks based on records data
    useEffect(() => {
      if (recordsData.length > 0) {
        // Sort data by date
        const sortedRecords = [...recordsData].sort((a, b) =>
          dayjs(a.test_date).isBefore(dayjs(b.test_date)) ? -1 : 1
        );
        const startDate = dayjs(sortedRecords[0].test_date).startOf('week'); 
        const endDate = dayjs(sortedRecords[sortedRecords.length - 1].test_date).endOf('week'); 
  
        const generatedWeeks = [];
        let currentStart = startDate;
  
        while (currentStart.isBefore(endDate)) {
          const currentEnd = currentStart.endOf('week');
          generatedWeeks.push({
            label: `${currentStart.format("DD MMM YYYY")} - ${currentEnd.format("DD MMM YYYY")}`,
            start: currentStart,
            end: currentEnd
          });
          currentStart = currentStart.add(1, 'week');
        }
  
        setWeeks(generatedWeeks);
  
        // check if selectedWeek valid
        if (
          !selectedWeek ||
          !generatedWeeks.some(week => week.label === selectedWeek.label)
        ) {
          setSelectedWeek(generatedWeeks[generatedWeeks.length - 1]); // Set default to the latest week
        }
      }
    }, [recordsData, selectedWeek]);

  // Set default selectedWeek when weeks are first generated
  useEffect(() => {
    if (weeks.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[weeks.length - 1]); // Set default to the latest week
    }
  }, [weeks, selectedWeek]);

  // Filtered data based on selected week
  const filteredRecordsData = useMemo(() => {
    if (!selectedWeek) return [];
    return recordsData.filter(record => {
      const testDate = dayjs(record.test_date);
      return (
        testDate.isAfter(selectedWeek.start.subtract(1, 'day')) &&
        testDate.isBefore(selectedWeek.end.add(1, 'day'))
      );
    });
  }, [recordsData, selectedWeek]);

     // Format data for Recharts
    const formattedRecordsData = useMemo(() => formatRecordsData(filteredRecordsData), [filteredRecordsData]);
  
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

    const classifyBilirubinFluctuation = () => {
      const highReadings = formattedRecordsData.filter(record => record.bilirubinStatus === "High").length;
      return highReadings === 0 ? "normal" : "melebihi rentang normal";
    };
  
  // count average, min and max bilirubin
  const averageBilirubin = filteredRecordsData.length > 0
    ? filteredRecordsData.reduce((acc, curr) => acc + curr.bilirubin, 0) / filteredRecordsData.length
    : 0;
  const maxBilirubin = filteredRecordsData.length > 0
    ? Math.max(...filteredRecordsData.map(d => d.bilirubin))
    : 0;
  const minBilirubin = filteredRecordsData.length > 0
    ? Math.min(...filteredRecordsData.map(d => d.bilirubin))
    : 0;

    const summaryText = (
      <>
        <p>
          Kadar bilirubin Anda selama seminggu ini menunjukkan fluktuasi yang berada dalam rentang {classifyBilirubinFluctuation()}. 
          Rata-rata kadar bilirubin anda {averageBilirubin.toFixed(2)} mg/dL, 
          dengan kadar tertinggi sebesar {maxBilirubin.toFixed(2)} mg/dL 
          dan kadar terendah sebesar {minBilirubin.toFixed(2)} mg/dL.
        </p>
      </>
    );

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-6 md:px-16 mt-5 md:mt-7 items-start justify-start mb-1 md:mb-3">
        <div className="text-darkgreen text-lg md:text-2xl lg:text-3xl font-bold">Weekly Report</div>
      </div>
      <div className="line"></div>

      {/* <div className="flex w-full px-6 md:px-16 my-4 items-start justify-start text-gray-400">
        Periode: 13 Mei 2024 - 20 Mei 2024
      </div> */}

      {/* Dropdown Periode */}
      <div className="flex w-full px-6 md:px-16 my-7 items-center justify-start text-gray-400">
        <div className="mr-3 text-md md:text-xl">
          Periode : 
        </div>
        <select
          className="border border-gray-300 text-md md:text-xl rounded-md p-2"
          value={selectedWeek ? selectedWeek.label : ""}
          onChange={(e) => {
            const week = weeks.find(w => w.label === e.target.value);
            setSelectedWeek(week);
          }}
        >
          <option value="" disabled>Pilih Periode</option>
          {weeks.map((week) => (
            <option key={week.label} value={week.label}>
              {week.label}
            </option>
          ))}
        </select>
      </div>
      
       {/* Grafik weekly report */}
       <div className="grid grid-cols-1 lg:grid-cols-2 px-8 md:px-16 gap-2.5 lg:gap-3.5 w-full">
        {/* Grafik Bilirubin */}
        <div className="w-full py-0.5 px-2 h-auto bg-white rounded-lg shadow-lg">
          <h3 className="text-darkgreen font-semibold text-center mb-2">Grafik Bilirubin (mg/dL)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={formattedRecordsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="timestamp"/>
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

        {/* Grafik 2 dan 3 */}
        <div className="flex flex-col gap-2.5">
          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            {/* Grafik Heart Rate */}
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

          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            {/* Grafik Oxygen Saturation */}
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


      {/* data & summary */}
      <div className="flex flex-col lg:flex-row px-8 md:px-16 mt-12 mb-6 gap-5 md:gap-3.5">
        <DataCard 
          name={patientData.name} 
          birthDate={dayjs(patientData.birth_date).format("DD MMM YYYY")} 
          gender={patientData.gender} 
        />
        <SummaryCard>{summaryText}</SummaryCard>
      </div>
    </main>
  );
}