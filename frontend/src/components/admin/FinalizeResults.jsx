import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinalizeResults = ({ electionId }) => {  // Accept electionId as a prop
  const [groups, setGroups] = useState([]);
  const [seats, setSeats] = useState({});
  const [totalSeats, setTotalSeats] = useState(0);  // State to store total seats input

  // Fetch election groups based on electionId
  useEffect(() => {
    console.log(`Fetching groups for election ID: ${electionId}`);
    axios.get(`/api/elections/${electionId}/groups`) // Adjust to correct endpoint
      .then(response => {
        console.log("Fetched groups:", response.data);
        setGroups(response.data);
      })
      .catch(error => {
        console.error("Error fetching groups:", error);
      });
  }, [electionId]); // Dependency array to re-fetch if electionId changes

  const handleSeatInput = (groupId, seatCount) => {
    console.log(`Input received: Group ID - ${groupId}, Seat Count - ${seatCount}`);
    setSeats({
      ...seats,
      [groupId]: parseInt(seatCount, 10) || 0, // Ensure seat count is an integer
    });
  };

  const handleTotalSeatsChange = (e) => {
    setTotalSeats(e.target.value);  // Update total seats when input is changed
  };

  const handleFinalize = () => {
    if (!totalSeats || totalSeats <= 0) {
      alert('Please enter a valid number of total seats.');
      return;
    }

    console.log("Finalizing with seats:", seats);
    console.log("Total seats:", totalSeats);  // Log to verify

    axios.post(`/api/elections/${electionId}/finalize`, { totalSeats, groupResults: seats })
      .then(response => {
        console.log("Finalized successfully:", response.data);
        alert('Election results finalized');
      })
      .catch(error => {
        console.error("Error finalizing results:", error);
        alert('Error finalizing election results');
      });
  };

  return (
    <div>
      <h2>Finalize Election Results</h2>

      {/* Input for Total Seats */}
      <div>
        <label>Total Seats:</label>
        <input
          type="number"
          value={totalSeats}
          onChange={handleTotalSeatsChange}
          min="1"
          placeholder="Enter total seats"
        />
      </div>

      {/* Display election groups and their seat inputs */}
      {groups.map((group) => (
        <div key={group._id}>
          <h3>{group.name}</h3>
          <input
            type="number"
            value={seats[group._id] || 0}
            onChange={(e) => handleSeatInput(group._id, e.target.value)}
            min="0"
            placeholder="Enter seats for this group"
          />
        </div>
      ))}

      <button onClick={handleFinalize}>Finalize Results</button>
    </div>
  );
};

export default FinalizeResults;
