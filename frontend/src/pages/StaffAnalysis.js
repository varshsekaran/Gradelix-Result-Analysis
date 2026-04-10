import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './StaffAnalysis.css'

function StaffAnalysis() {

  const [analysis, setAnalysis] = useState([]);
  const [saveName, setSaveName] = useState('');

  const handleFileUpload = async (e) => {

    const file = e.target.files[0];
    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const response = await axios.get('https://gradelix-backend.onrender.com/api/staff-subject');

    const staffSubjectMap = {};

    response.data.forEach(entry => {
      staffSubjectMap[entry['SUBJECT CODE'].trim()] = entry['STAFF NAME'].trim();
    });

    const result = {};

    jsonData.forEach(row => {
      for (const key in row) {

        if (key !== 'REGISTER NO' && key !== 'NAME') {

          const subjectCode = key.trim();
          const mark = parseFloat(row[key]);
          const staff = staffSubjectMap[subjectCode];

          if (!staff) continue;

          if (!result[staff]) {
            result[staff] = { total: 0, pass: 0, subjectCode };
          }

          if (!isNaN(mark)) {
            result[staff].total++;

            if (mark > 25) result[staff].pass++;
          }
        }
      }
    });

    const finalData = Object.entries(result).map(([staff, { total, pass, subjectCode }]) => ({
      staff,
      subjectCode,
      pass,
      fail: total - pass,
      percentage: ((pass / total) * 100).toFixed(2)
    }));

    setAnalysis(finalData);
  };

  // SAVE STAFF ANALYSIS
  const handleSave = async () => {

    if (!saveName) {
      alert("Enter analysis name");
      return;
    }

    await axios.post("https://gradelix-backend.onrender.com/api/save-staff", {
      name: saveName,
      analysis
    });

    alert("Staff Analysis Saved!");
  };

  return (
    <div className="staffanalysis-container">

      <h2>Staff Subject-Wise Analysis</h2>

      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />

      {analysis.length > 0 && (
        <>
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter analysis name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />

            <button onClick={handleSave}>
              Save Staff Analysis
            </button>
          </div>

          <table className="staffanalysis-table">

            <thead>
              <tr>
                <th>Staff</th>
                <th>Subject Code</th>
                <th>Pass</th>
                <th>Fail</th>
                <th>Pass %</th>
              </tr>
            </thead>

            <tbody>

              {analysis.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.staff}</td>
                  <td>{item.subjectCode}</td>
                  <td>{item.pass}</td>
                  <td>{item.fail}</td>
                  <td>{item.percentage}%</td>
                </tr>
              ))}

            </tbody>

          </table>
        </>
      )}
    </div>
  );
}

export default StaffAnalysis;