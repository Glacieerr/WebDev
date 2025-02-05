import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProject = () => {
  // Project-related states
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [productOwner, setProductOwner] = useState('');
  const [manager, setManager] = useState('');
  const [team, setTeam] = useState('');

  // Team-related states
  const [teamName, setTeamName] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch users, teams, and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5001/getUsers');
        setUsers(userResponse.data);

        const teamResponse = await axios.get('http://localhost:5001/getTeams');
        setTeams(teamResponse.data);

        const projectResponse = await axios.get('http://localhost:5001/getProjects');
        setProjects(projectResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle project creation
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/createProject', {
        proj_name: projName,
        proj_desc: projDesc,
        prod_owner_id: productOwner,
        mgr_id: manager,
        team_id: team
      });
      alert('Project created successfully');
      // Clear form fields
      setProjName('');
      setProjDesc('');
      setProductOwner('');
      setManager('');
      setTeam('');
      // Refetch projects after creation
      const projectResponse = await axios.get('http://localhost:5001/getProjects');
      setProjects(projectResponse.data);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  // Handle team creation
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/createTeam', { team_name: teamName });
      alert('Team created successfully');
      setTeamName('');
      // Refetch teams after creation
      const teamResponse = await axios.get('http://localhost:5001/getTeams');
      setTeams(teamResponse.data);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  return (
    <div>
      {/* Create Project Form */}
      <h2>Create a New Project</h2>
      <form onSubmit={handleCreateProject}>
        <label>Project Name:</label>
        <input 
          type="text" 
          value={projName} 
          onChange={(e) => setProjName(e.target.value)} 
          required 
        />
        <br />

        <label>Project Description:</label>
        <textarea 
          value={projDesc} 
          onChange={(e) => setProjDesc(e.target.value)} 
          required 
        />
        <br />

        <label>Product Owner:</label>
        <select 
          onChange={(e) => setProductOwner(e.target.value)} 
          value={productOwner} 
          required
        >
          <option value="">Select Owner</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </option>
          ))}
        </select>
        <br />

        <label>Manager:</label>
        <select 
          onChange={(e) => setManager(e.target.value)} 
          value={manager} 
          required
        >
          <option value="">Select Manager</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </option>
          ))}
        </select>
        <br />

        <label>Team:</label>
        <select 
          onChange={(e) => setTeam(e.target.value)} 
          value={team} 
          required
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>{team.team_name}</option>
          ))}
        </select>
        <br />

        <button type="submit">Create Project</button>
      </form>

      <hr />

      {/* Create Team Form */}
      <h2>Create a New Team</h2>
      <form onSubmit={handleCreateTeam}>
        <label>Team Name:</label>
        <input 
          type="text" 
          value={teamName} 
          onChange={(e) => setTeamName(e.target.value)} 
          required 
        />
        <br />
        <button type="submit">Create Team</button>
      </form>

      <hr />

      {/* View Teams */}
      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team._id}>{team.team_name}</li>
        ))}
      </ul>

      <hr />

      {/* View Projects */}
      <h2>Projects</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Product Owner</th>
            <th>Manager</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.project_name}</td>
              <td>{project.description}</td>
              <td>{project.owner_name}</td>
              <td>{project.manager_name}</td>
              <td>{project.team_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateProject;