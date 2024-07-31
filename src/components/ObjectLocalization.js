// src/components/ObjectLocalization.js

import { useState } from 'react';

const ObjectLocalization = () => {
  const [fileName, setFileName] = useState('');
  const [objects, setObjects] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/objectLocalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform object localization');
      }

      const data = await response.json();
      setObjects(data.objects);
      setError(null);
    } catch (err) {
      setError(err.message);
      setObjects([]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={fileName}
          onChange={handleInputChange}
          placeholder="Enter file name (e.g., image.png)"
        />
        <button type="submit">Detect Objects</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Objects:</h3>
        <ul>
          {objects.map((object, index) => (
            <li key={index}>
              <p>Name: {object.name}</p>
              <p>Confidence: {object.score}</p>
              <p>Bounding Poly: {JSON.stringify(object.boundingPoly.normalizedVertices)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ObjectLocalization;
