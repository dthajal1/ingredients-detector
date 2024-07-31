// src/components/LabelDetection.js

import { useState } from 'react';

const LabelDetection = () => {
  const [fileName, setFileName] = useState('');
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/labelDetection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform label detection');
      }

      const data = await response.json();
      setLabels(data.labels);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLabels([]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={fileName}
          onChange={handleInputChange}
          placeholder="Enter file name (e.g., potato.png)"
        />
        <button type="submit">Detect Labels</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Labels:</h3>
        <ul>
          {labels.map((label, index) => (
            <li key={index}>{label.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LabelDetection;
