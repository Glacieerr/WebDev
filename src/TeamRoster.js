import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Select from 'react-select';

const TeamRoster = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch teams and users from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch teams
        const teamsResponse = await axios.get('http://localhost:5001/getTeams');
        setTeams(teamsResponse.data);

        // Fetch users
        const usersResponse = await axios.get('http://localhost:5001/getUsers');
        setUsers(usersResponse.data);

        console.log('Teams:', teamsResponse.data);
        console.log('Users:', usersResponse.data);
      } catch (error) {
        console.error('Error fetching teams or users:', error);
        alert('Failed to fetch teams or users.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMembers = async () => {
    if (!selectedTeam || selectedUsers.length === 0) {
      alert('Please select a team and members.');
      return;
    }

    try {
      // Prepare payload with selected team and members
      const payload = {
        teamId: selectedTeam,
        memberIds: selectedUsers.map(user => user.value), // Correct IDs from frontend
      };

      console.log('Payload being sent to the server:', payload);

      // API call to add members to the team
      const response = await axios.post('http://localhost:5001/addMembersToTeam', payload);

      // Display success message and log server response
      alert(response.data.message || 'Members added to the team successfully!');
      console.log('Server Response:', response.data);

      // Reset form fields
      setSelectedTeam(null);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error adding members to the team:', error.response || error);
      alert('Failed to add members to the team.');
    }
  };

  return (
    <div>
      <h1>Create Team Roster</h1>

      {loading && <p>Loading...</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddMembers();
        }}
      >
        {/* Select Team Dropdown */}
        <label>Select Team:</label>
        <Select
          options={teams.map(team => ({ value: team._id, label: team.team_name }))}
          value={
            selectedTeam
              ? { value: selectedTeam, label: teams.find(team => team._id === selectedTeam)?.team_name }
              : null
          }
          onChange={(option) => setSelectedTeam(option?.value || null)}
          placeholder="Select a Team"
        />
        <br />

        {/* Select Members Dropdown */}
        <label>Select Members:</label>
        <Select
          options={users.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))}
          isMulti
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Select Members"
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Members to Team'}
        </button>
      </form>
    </div>
  );
};

export default TeamRoster;
