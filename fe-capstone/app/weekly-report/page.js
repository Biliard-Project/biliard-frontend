"use client";

import Navbar2 from "../components/navbar2";
import DataCard from "../components/dataCard";
import SummaryCard from "../components/summaryCard";
import React, { useState, useEffect } from "react";
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

    useEffect(() => {
      if (recordsData.length > 0) {
        // Urutkan data berdasarkan tanggal
        const sortedRecords = recordsData.sort((a, b) => dayjs(a.test_date).isBefore(dayjs(b.test_date)) ? -1 : 1);
        const startDate = dayjs(sortedRecords[0].test_date).startOf('week'); // Mulai dari hari Minggu
        const endDate = dayjs(sortedRecords[sortedRecords.length - 1].test_date).endOf('week'); // Sampai hari Sabtu
  
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
        setSelectedWeek(generatedWeeks[generatedWeeks.length - 1]); // Set default selectedWeek to the latest week
      }
    }, [recordsData]);

    const filteredRecordsData = selectedWeek
    ? recordsData.filter(record => {
        const testDate = dayjs(record.test_date);
        return testDate.isAfter(selectedWeek.start.subtract(1, 'day')) && testDate.isBefore(selectedWeek.end.add(1, 'day'));
      })
    : recordsData;
  
    // change data records format for Recharts
    const formatRecordsData = (data) => {
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
  
    // count average, min and max bilirubin
    const averageBilirubin = formattedRecordsData.reduce((acc, curr) => acc + curr.bilirubin, 0) / formattedRecordsData.length;
    const maxBilirubin = Math.max(...formattedRecordsData.map(d => d.bilirubin));
    const minBilirubin = Math.min(...formattedRecordsData.map(d => d.bilirubin));
  
    const summaryText = (
      <>
        <p>
          Kadar bilirubin Anda selama seminggu ini menunjukkan fluktuasi yang berada dalam rentang normal. 
          Rata-rata kadar bilirubin anda {averageBilirubin.toFixed(2)} mg/dL, 
          dengan kadar tertinggi sebesar {maxBilirubin.toFixed(2)} mg/dL 
          dan kadar terendah sebesar {minBilirubin.toFixed(2)} mg/dL.
        </p>
      </>
    );

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Navbar2></Navbar2>
      <div className="flex w-full px-6 md:px-16 mt-4 md:mt-6 items-start justify-start">
        <div className="text-darkgreen text-lg md:text-2xl font-bold">Weekly Report</div>
      </div>
      <div className="line"></div>

      {/* <div className="flex w-full px-6 md:px-16 my-4 items-start justify-start text-gray-400">
        Periode: 13 Mei 2024 - 20 Mei 2024
      </div> */}

      {/* Dropdown Periode */}
      <div className="flex w-full px-6 md:px-16 my-4 items-center justify-start text-gray-400">
        <div className="mr-3">
          Periode : 
        </div>
        <select
          className="border border-gray-300 rounded-md p-2"
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
       <div className="grid grid-cols-1 lg:grid-cols-2 px-8 md:px-16 gap-2 lg:gap-3.5 w-full">
        {/* Grafik Bilirubin */}
        <div className="w-full p-2 h-96 bg-white rounded-lg shadow-lg">
          <h3 className="text-darkgreen text-center mb-2">Grafik Bilirubin (mg/dL)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={formattedRecordsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 1.2]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bilirubin" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik 2 dan 3 */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            {/* Grafik Heart Rate */}
            <h3 className="text-darkgreen text-center mb-2">Grafik Heart Rate (bpm)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[50, 110]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full h-48 lg:h-1/2 bg-white rounded-lg shadow-lg p-2">
            {/* Grafik Oxygen Saturation */}
            <h3 className="text-darkgreen text-center mb-2">Grafik Saturasi Oksigen (%)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={formattedRecordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[85, 105]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="oxygenSaturation" stroke="#ffc658" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* data & summary */}
      <div className="flex flex-col lg:flex-row px-8 md:px-16 mt-6 mb-10 gap-5 md:gap-3.5">
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