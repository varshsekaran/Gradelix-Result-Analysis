import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SavedStaffAnalysis.css';

function SavedStaff() {

  const [saved, setSaved] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    axios.get('http://localhost:5000/api/saved-staff')
      .then(res => setSaved(res.data));

  }, []);

  const toggleSelection = (id) => {

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }

    else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = async () => {

    const res = await axios.post('http://localhost:5000/api/compare-staff', {
      id1: selectedIds[0],
      id2: selectedIds[1]
    });

    navigate('/compare-staff', { state: res.data });
  };

  return (
  <div className="savedstaff-container">

    <h2 className="savedstaff-heading">Saved Staff Analyses</h2>

    {saved.length === 0 ? (
      <p className="savedstaff-empty">No saved staff analyses found.</p>
    ) : (
      <div className="savedstaff-list">

        {saved.map(item => (

          <div className="savedstaff-entry" key={item._id}>

            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => toggleSelection(item._id)}
            />

            <button className="savedstaff-button">
              {item.name}
            </button>

          </div>

        ))}

      </div>
    )}

    <button
      className="staff-compare-button"
      disabled={selectedIds.length !== 2}
      onClick={handleCompare}
    >
      Compare Selected
    </button>

  </div>
);
}

export default SavedStaff;