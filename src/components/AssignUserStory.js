import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const AssignUserStory = () => {
  const [teams, setTeams] = useState([]);
  const [unassignedStories, setUnassignedStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch teams and users
  useEffect(() => {
    const fetchTeamsAndUsers = async () => {
      try {
        const teamsResponse = await axios.get('http://localhost:5001/getTeams');
        setTeams(teamsResponse.data);

        const usersResponse = await axios.get('http://localhost:5001/getUsers');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching teams or users:', error);
        alert('Failed to fetch teams or users.');
      }
    };

    fetchTeamsAndUsers();
  }, []);

  // Fetch unassigned stories when the selected team changes
  useEffect(() => {
    if (selectedTeam) {
      const fetchUnassignedStories = async () => {
        try {
          console.log('Fetching unassigned stories for team:', selectedTeam);
          const response = await axios.get(
            `http://localhost:5001/getUnassignedUserStories?teamId=${selectedTeam}`
          );
  
          if (response.data.success) {
            console.log('Unassigned Stories Fetched:', response.data.data);
            setUnassignedStories(response.data.data);
          } else {
            console.error('Failed to fetch unassigned stories:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching unassigned stories:', error);
          alert('Failed to fetch unassigned stories.');
        }
      };
  
      fetchUnassignedStories();
    } else {
      setUnassignedStories([]); // Clear stories if no team selected
    }
  }, [selectedTeam]);

  // Handle assigning a user story
  const handleAssignStory = async () => {
    if (!selectedTeam || !selectedStory || !selectedUser) {
      alert('Please select a team, story, and user.');
      return;
    }

    try {
      const payload = {
        user_story_id: selectedStory,
        user_id: selectedUser,
      };

      console.log('Assigning story with payload:', payload);

      const response = await axios.post('http://localhost:5001/assignUserStory', payload);

      if (response.data.success) {
        alert(response.data.message || 'Story assigned successfully.');
        setSelectedStory(null);
        setSelectedUser(null);

        // Refresh unassigned stories
        const updatedStories = unassignedStories.filter((story) => story._id !== selectedStory);
        setUnassignedStories(updatedStories);
      } else {
        alert('Failed to assign story.');
      }
    } catch (error) {
      console.error('Error assigning story:', error);
      alert('Failed to assign story.');
    }
  };

  return (
    <div>
      <h1>Assign User Stories</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAssignStory();
        }}
      >
        {/* Select Team */}
        <label>Select Team:</label>
        <Select
          options={teams.map((team) => ({
            value: team._id,
            label: team.team_name,
          }))}
          value={selectedTeam ? { value: selectedTeam, label: teams.find((t) => t._id === selectedTeam)?.team_name } : null}
          onChange={(option) => setSelectedTeam(option?.value || null)}
          placeholder="Select Team"
          isClearable
        />
        <br />

        {/* Select Unassigned Story */}
        <label>Select Unassigned Story:</label>
        <Select
          options={unassignedStories.map((story) => ({
            value: story._id,
            label: story.story_name || 'Unnamed Story', // Ensure story_name is displayed
          }))}
          value={
            selectedStory
              ? {
                  value: selectedStory,
                  label: unassignedStories.find((s) => s._id === selectedStory)?.story_name || 'Unnamed Story',
                }
              : null
          }
          onChange={(option) => setSelectedStory(option?.value || null)}
          placeholder="Select Unassigned Story"
          isClearable
        />
        <br />

        {/* Select User */}
        <label>Select User:</label>
        <Select
          options={users.map((user) => ({
            value: user._id,
            label: `${user.firstName} ${user.lastName}`,
          }))}
          value={selectedUser ? { value: selectedUser, label: `${users.find((u) => u._id === selectedUser)?.firstName} ${users.find((u) => u._id === selectedUser)?.lastName}` } : null}
          onChange={(option) => setSelectedUser(option?.value || null)}
          placeholder="Select User"
          isClearable
        />
        <br />

        <button type="submit">Assign Story</button>
      </form>
    </div>
  );
};

export default AssignUserStory;
