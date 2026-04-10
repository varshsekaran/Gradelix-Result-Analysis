import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SavedCae.css'

function SavedCae() {
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://gradelix-backend.onrender.com/api/saved-cae')
      .then(res => setSavedAnalyses(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        return prev;
      }
    });
  };

  const handleCompare = async () => {
    try {
      const res = await axios.post('https://gradelix-backend.onrender.com/api/compare-cae', {
        id1: selectedIds[0],
        id2: selectedIds[1]
      });
      navigate('/compare-cae', { state: res.data }); // 🔁 Go to new page with data
    } catch (err) {
      console.error(err);
      alert('Failed to fetch comparison data');
    }
  };

  const handleLoad = (item) => {
    navigate('/analysis', { state: item });
  };

  return (
    <div className="savedcae-container">
      <h2 className="savedcae-heading">Saved CAE Analyses</h2>
      {savedAnalyses.length === 0 ? (
        <p className="savedcae-empty">No saved analyses found.</p>
      ) : (
        <div className="savedcae-list">
          {savedAnalyses.map(item => (
            <div className="savedcae-entry" key={item._id}>
              <input
                type="checkbox"
                checked={selectedIds.includes(item._id)}
                onChange={() => toggleSelection(item._id)}
              />
              <button className="savedcae-button">
                {item.name} 
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="cae-compare-button"
        disabled={selectedIds.length !== 2}
        onClick={handleCompare}
      >
        Compare Selected
      </button>
    </div>
  );
}

export default SavedCae;
