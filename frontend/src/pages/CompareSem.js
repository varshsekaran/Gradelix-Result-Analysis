import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import './CompareCae.css'; // or a new CSS module

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CompareSemester() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.entry1 || !state.entry2) {
    return <p>No comparison data found.</p>;
  }

  const { entry1, entry2 } = state;
  const subjects = Object.keys(entry1.subjectStats);
  const data1 = subjects.map(sub => entry1.subjectStats[sub].percentage);
  const data2 = subjects.map(sub => entry2.subjectStats[sub].percentage);

  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: entry1.name,
        backgroundColor: 'rgba(70, 130, 180, 0.6)',
        data: data1,
      },
      {
        label: entry2.name,
        backgroundColor: 'rgba(196, 211, 33, 0.6)',
        data: data2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Semester Comparison: Subject-wise Pass %', font: { size: 20 } },
    },
    scales: {
      x: { ticks: { color: '#000' } },
      y: { beginAtZero: true, ticks: { color: '#000' } },
    },
  };

  return (
    <div className="comparison-container">
      <h2>Semester Comparison: {entry1.name} vs {entry2.name}</h2>
      <Bar data={chartData} options={options} />
      <button onClick={() => navigate('/saved-sem')} className="back-button">🔙 Back</button>
    </div>
  );
}

export default CompareSemester;