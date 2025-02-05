import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/getTeams')
      .then((response) => setTeams(response.data))
      .catch((error) => console.error('Error fetching teams:', error));
  }, []);

  return (
    <div>
      <h2>All Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team._id}>{team.team_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTeams;
