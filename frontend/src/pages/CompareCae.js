import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './CompareCae.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CompareCae() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.entry1 || !state.entry2) {
    return <p>No comparison data found.</p>;
  }

  const { entry1, entry2 } = state;

  const subjects = Object.keys(entry1.subjectStats);
  const data1 = subjects.map(sub => entry1.subjectStats[sub].passPercentage || entry1.subjectStats[sub].percentage);
  const data2 = subjects.map(sub => entry2.subjectStats[sub].passPercentage || entry2.subjectStats[sub].percentage);

  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: entry1.name,
        backgroundColor: 'rgba(12, 80, 214, 0.6)',
        data: data1
      },
      {
        label: entry2.name,
        backgroundColor: 'rgba(231, 216, 16, 0.6)',
        data: data2
      }
    ]
  };

  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000', // optional: make legend text black
      }
    },
    title: {
      display: true,
      text: 'Subject-wise Pass % Comparison',
      color: '#000', // title text color
      font: {
        size: 20
      }
    }
  },
  scales: {
  x: {
    stacked: false,
    grid: { display: false },
    ticks: { color: '#000' },
    barPercentage: 0.6,
    categoryPercentage: 0.5
  },
  y: {
    stacked: false,
    grid: { display: false },
    ticks: { color: '#000', beginAtZero: true }
  }
}

};


  return (
    <div className="comparison-container">
      <h2>Comparison: {entry1.name} vs {entry2.name}</h2>
      <Bar data={chartData} options={options} />
      <button onClick={() => navigate('/saved-cae')} className="back-button">🔙 Back</button>
    </div>
  );
}

export default CompareCae;