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
import './CompareCae.css'; // reuse same CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CompareStaff() {

  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.entry1 || !state.entry2) {
    return <p>No comparison data found.</p>;
  }

  const { entry1, entry2 } = state;

  const labels = entry1.analysis.map(a => a.staff);

  const data1 = entry1.analysis.map(a => a.percentage);
  const data2 = entry2.analysis.map(a => a.percentage);

  const chartData = {
    labels,
    datasets: [
      {
        label: entry1.name,
        backgroundColor: 'rgba(227, 75, 75, 0.6)',
        data: data1
      },
      {
        label: entry2.name,
        backgroundColor: 'rgba(196, 199, 17, 0.6)',
        data: data2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#000' }
      },
      title: {
        display: true,
        text: 'Staff-wise Pass % Comparison',
        color: '#000',
        font: { size: 20 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#000' },
        barPercentage: 0.6,
        categoryPercentage: 0.5
      },
      y: {
        grid: { display: false },
        ticks: { color: '#000', beginAtZero: true }
      }
    }
  };

  return (
    <div className="comparison-container">

      <h2>{entry1.name} vs {entry2.name}</h2>

      <Bar data={chartData} options={options} />

      <button
        onClick={() => navigate('/saved-staff')}
        className="back-button"
      >
        🔙 Back
      </button>

    </div>
  );
}

export default CompareStaff;