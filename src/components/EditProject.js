import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditProject = () => {
  const { state } = useLocation(); // Get the project data passed via navigation
  const navigate = useNavigate();

  const [projName, setProjName] = useState(state.project.proj_name);
  const [description, setDescription] = useState(state.project.description);
  const [productOwner, setProductOwner] = useState(state.project.product_owner);
  const [manager, setManager] = useState(state.project.manager);
  const [team, setTeam] = useState(state.project.team);

  const handleSaveChanges = async () => {
    try {
      const updatedProjectData = {
        proj_name: projName,
        description,
        product_owner: productOwner,
        manager,
        team,
      };
      const response = await axios.put(
        `http://localhost:5001/editProject/${state.project._id}`,
        updatedProjectData
      );
      alert(response.data.message || 'Project updated successfully!'); // Use response data here
      navigate('/viewProjects'); // Redirect back to the projects page
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update the project.');
    }
  };

  return (
    <div>
      <h1>Edit Project</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Project Name:</label>
        <input
          type="text"
          value={projName}
          onChange={(e) => setProjName(e.target.value)}
          required
        />
        <br />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label>Product Owner:</label>
        <input
          type="text"
          value={productOwner}
          onChange={(e) => setProductOwner(e.target.value)}
        />
        <br />
        <label>Manager:</label>
        <input
          type="text"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />
        <br />
        <label>Team:</label>
        <input
          type="text"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <br />
        <button onClick={handleSaveChanges}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditProject;
