import React, { useState } from 'react';
import axios from 'axios';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/createTeam', { team_name: teamName });
      alert('Team created successfully');
      setTeamName(''); // Clear the input field after successful creation
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  return (
    <form onSubmit={handleCreateTeam}>
      <label>Team Name:</label>
      <input 
        type="text" 
        value={teamName} 
        onChange={(e) => setTeamName(e.target.value)} 
        required 
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default CreateTeam;
