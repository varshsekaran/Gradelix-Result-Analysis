import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import './Analysis.css';

function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { year, semester, cae, mode, subjectStats, studentArrears } = location.state || {};

  let totalPass = 0;
  let totalStudents = 0;

  if (subjectStats) {
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      totalPass += Number(stats.pass);
      totalStudents += Number(stats.total);
    });
  }

  const overallPercentage =
    totalStudents > 0 ? ((totalPass / totalStudents) * 100).toFixed(2) : '0.00';

  const [saveName, setSaveName] = useState('');
  const [showArrears, setShowArrears] = useState(false);

  const handleSave = async () => {
    try {
      const endpoint = mode === 'cae' ? 'save-cae' : 'save-semester';

      await axios.post(`http://localhost:5000/api/${endpoint}`, {
        name: saveName,
        year,
        semester,
        cae: mode === 'cae' ? cae : null,
        mode,
        subjectStats,
        overallPercentage,
      });

      alert('Analysis saved successfully!');
      navigate(mode === 'cae' ? '/saved-cae' : '/saved-sem');
    } catch (err) {
      console.error(err);
      alert('Failed to save analysis');
    }
  };

  const downloadCSVReport = () => {
    const filteredArrears = studentArrears?.filter((student) => student.arrearCount >= 3);

    if (!filteredArrears || filteredArrears.length === 0) {
      alert('No arrear data to download');
      return;
    }

    let csvContent = 'Register Number,Student Name,Arrear Count\n';

    filteredArrears.forEach((student) => {
      csvContent += `"${student.register}","${student.studentName}",${student.arrearCount}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const filename = `${saveName || 'Arrear_Report'}.csv`;

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ⭐ NEW FUNCTION TO DOWNLOAD ANALYSIS REPORT
  const downloadAnalysisDoc = () => {
    if (!subjectStats) {
      alert('No analysis data available');
      return;
    }

    let rows = '';

    Object.entries(subjectStats).forEach(([subject, stats]) => {
      rows += `
      <tr>
        <td>${subject}</td>
        <td>${stats.total}</td>
        <td>${stats.present}</td>
        <td>${stats.absent}</td>
        <td>${stats.fail}</td>
        <td>${stats.pass}</td>
        <td>${stats.percentage}</td>
      </tr>
      `;
    });

    const htmlContent = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Analysis Report</title>
    </head>
    <body>

      <h2>Result Analysis Report</h2>

      <p><b>Year:</b> ${year}</p>
      <p><b>Semester:</b> ${semester}</p>
      ${mode === 'cae' ? `<p><b>CAE:</b> ${cae}</p>` : ''}
      <p><b>Overall Pass Percentage:</b> ${overallPercentage}%</p>

      <table border="1" style="border-collapse:collapse; width:100%">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Total</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Fail</th>
            <th>Pass</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

    </body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${saveName || 'Analysis_Report'}.doc`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const studentsWithHighArrears =
    studentArrears?.filter((s) => s.arrearCount >= 3) || [];

  return (
    <div className="analysis-container">
      <h2>{showArrears ? 'Arrear Report' : `Analysis - ${mode?.toUpperCase()}`}</h2>

      <p>
        <strong>Year:</strong> {year} | <strong>Semester:</strong> {semester}{' '}
        {mode === 'cae' && (
          <>
            | <strong>CAE:</strong> {cae}
          </>
        )}
      </p>

      <div className="table-wrapper">
        <table className="analysis-table">
          <thead>
            <tr>
              {showArrears ? (
                <>
                  <th>Register Number</th>
                  <th>Student Name</th>
                  <th>Arrear Count</th>
                </>
              ) : (
                <>
                  <th>Subject Code</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Fail</th>
                  <th>Pass</th>
                  <th>Percentage (%)</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {showArrears ? (
              studentArrears && studentArrears.filter((s) => s.arrearCount >= 3).length > 0 ? (
                studentArrears
                  .filter((student) => student.arrearCount >= 3)
                  .map((student, index) => (
                    <tr key={index}>
                      <td>{student.register}</td>
                      <td>{student.studentName}</td>
                      <td>{student.arrearCount}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3}>No student arrear data available</td>
                </tr>
              )
            ) : subjectStats && Object.keys(subjectStats).length > 0 ? (
              Object.entries(subjectStats).map(([subject, stats]) => (
                <tr key={subject}>
                  <td>{subject}</td>
                  <td>{stats.total}</td>
                  <td>{stats.present}</td>
                  <td>{stats.absent}</td>
                  <td>{stats.fail}</td>
                  <td>{stats.pass}</td>
                  <td>{stats.percentage}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!showArrears && (
        <>
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              placeholder="Enter analysis name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              style={{ padding: '8px' }}
            />

            <button
              onClick={handleSave}
              style={{ padding: '8px 12px', backgroundColor: '#800033', color: '#fff' }}
            >
              Save As
            </button>

            {/* ⭐ DOWNLOAD BUTTON */}
            <button
              onClick={downloadAnalysisDoc}
              style={{ padding: '8px 12px', backgroundColor: '#800033', color: '#fff' }}
            >
              Download Analysis Report
            </button>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => setShowArrears(true)}
              style={{ padding: '8px 12px', backgroundColor: '#800033', color: '#fff' }}
            >
              Show Arrears
            </button>
          </div>
        </>
      )}

      {showArrears && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              placeholder="Enter report name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              style={{
                padding: '8px',
                width: '250px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />

            <button
              onClick={downloadCSVReport}
              style={{ padding: '8px 12px', backgroundColor: '#800033', color: '#fff' }}
            >
              Download Arrear Report
            </button>
          </div>

          <button
            onClick={() => setShowArrears(false)}
            style={{ padding: '8px 12px', backgroundColor: '#800033', color: '#fff' }}
          >
            Back to Analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default Analysis;