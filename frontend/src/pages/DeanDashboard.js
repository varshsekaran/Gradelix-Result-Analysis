import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './DeanDashboard.css';
import { useEffect } from 'react';

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/', { replace: true });
  }
}, []);

useEffect(() => {
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
}, []);

function DeanDashboard() {
  const [year, setYear] = useState('2025');
  const [semester, setSemester] = useState('1');
  const [cae, setCae] = useState('1');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const mode = query.get('mode'); // 'cae' or 'semester'

  function handleAnalyse() {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      let subjectStats = {};
      let studentArrears = [];
      const passMark = mode === 'semester' ? 30 : 25;

      data.forEach((row) => {
        let arrearCount = 0;
        const register = row['REG NO'] || row['Reg No'] || row['Register Number'];
        const studentName = row['NAME OF THE STUDENT'] || row['Name'] || row['Student Name'];

        Object.keys(row).forEach((key) => {
          const header = key.trim().toUpperCase();
          const value = row[key];

          if (header === 'REG NO' || header === 'NAME OF THE STUDENT') return;
          if (value === 'NA' || value === 'na' || value === '' || value === null) return;

          if (!subjectStats[header]) {
            subjectStats[header] = {
              total: 0,
              present: 0,
              absent: 0,
              fail: 0,
              pass: 0,
              percentage: 0,
            };
          }

          subjectStats[header].total++;

          const cleaned = String(value).trim().replace(/,/g, '');

          const isAbsent = cleaned === 'A' || cleaned === 'a' || cleaned === '-' || cleaned === '' || isNaN(Number(cleaned));

          if (isAbsent) {
            subjectStats[header].absent++;
          } else {
            const score = Number(cleaned);
            subjectStats[header].present++;
            if (score < passMark) {
              subjectStats[header].fail++;
              arrearCount++;
            } else {
              subjectStats[header].pass++;
            }
          }
        });
        if (register && studentName) {
          studentArrears.push({
            register: String(register).trim(),
            studentName: String(studentName).trim(),
            arrearCount,
          });
        }
      });

      Object.keys(subjectStats).forEach((subject) => {
        const stat = subjectStats[subject];
        stat.pass = stat.present - stat.fail;
        stat.percentage = ((stat.pass / stat.total) * 100).toFixed(2);
      });

      console.table(subjectStats); // for debugging
      navigate('/analysis', {
        state: {
          year,
          semester,
          cae,
          mode,
          subjectStats,
          studentArrears,
        }
      });
    };

    reader.readAsBinaryString(file);
  }

  return (
    <div className="hod-dashboard-wrapper">
      <div className="hod-dashboard-card">
        <h1 className="hod-dashboard-title">
  {mode === 'cae' ? 'CAE Analysis' : mode === 'semester' ? 'Semester Analysis' : 'Dean Dashboard'}</h1>

        {mode ? (
          <div className="hod-dashboard-form">
            <label>Enter Year</label>
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="hod-input" />

            <label>Enter Semester</label>
            <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} className="hod-input" />

            {mode === 'cae' && (
              <>
                <label>Enter CAE</label>
                <input type="text" value={cae} onChange={(e) => setCae(e.target.value)} className="hod-input" />
              </>
            )}

            <label>Upload File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hod-input" />

            <button onClick={handleAnalyse} className="hod-button">Analyse</button>
          </div>
        ) : (
          <p style={{ paddingTop: '1rem', fontStyle: 'italic', color: '#777' }}>
            Please select <strong>CAE</strong> or <strong>SEMESTER</strong> from the sidebar to begin.
          </p>
        )}
      </div>
    </div>
  );
}

export default DeanDashboard;
