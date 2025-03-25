// frontend/src/components/admin/lists/ViewResults.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewResults = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    console.log("Fetching finalized election results...");
    axios.get("/api/elections/results")
      .then(response => {
        console.log("Fetched results:", response.data);
        setResults(response.data);
      })
      .catch(error => {
        console.error("Error fetching results:", error);
      });
  }, []);

  return (
    <div>
      <h2>View Election Results</h2>
      {results ? (
        <pre>{JSON.stringify(results, null, 2)}</pre>
      ) : (
        <p>Loading results...</p>
      )}
    </div>
  );
};

export default ViewResults;
