import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SavedSem.css'

function SavedSem() {
  const [savedFiles, setSavedFiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://gradelix-backend.onrender.com/api/saved-semester')
      .then(res => setSavedFiles(res.data))
      .catch(err => console.error('Error fetching semester data', err));
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
      const res = await axios.post('https://gradelix-backend.onrender.com/api/compare-semester', {
        id1: selectedIds[0],
        id2: selectedIds[1]
      });
      navigate('/compare-sem', { state: res.data });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch semester comparison data');
    }
  };


  const handleLoad = (file) => {
    navigate('/analysis', { state: file }); // ✅ Pass file data to analysis page
  };

  return (
    <div className="savedsem-container">
      <h2 className="savedsem-heading">Saved Semester Analyses</h2>
      {savedFiles.length === 0 ? (
        <p className="savedsem-empty">No saved semester analyses found.</p>
      ) : (
         <div className="savedsem-list">
        {savedFiles.map(file => (
          <div className="savedsem-entry" key={file._id}>
            <input
                type="checkbox"
                checked={selectedIds.includes(file._id)}
                onChange={() => toggleSelection(file._id)}
              />
          <button className='savedsem-button'
            key={file._id}
            onClick={() => handleLoad(file)}
          >
            {file.name}
          </button> 
         </div>
          ))}
        </div>
      )}
       <button
        className="sem-compare-button"
        disabled={selectedIds.length !== 2}
        onClick={handleCompare}
      >
        Compare Selected
      </button>

    </div>
  );
}

export default SavedSem;
